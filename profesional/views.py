# profesional/views.py
# -------------------------------------------------------------
# Vistas correspondientes al módulo de profesionales.
# Incluye la navegación principal del panel profesional y la
# funcionalidad de predicción de ACV mediante integración con
# un modelo de Machine Learning externo (API Flask).
# -------------------------------------------------------------

import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import datetime
from sistema.models import Disponibilidad, AspectosNegocio
from profesional.models import Profesional, ProfesionalCliente
from django.utils import timezone

# -------------------------------------------------------------
# CONFIGURACIÓN DE LOGGING
# -------------------------------------------------------------
# Permite registrar eventos, errores y advertencias del sistema
# en la consola o en archivos de log configurados en settings.py
logger = logging.getLogger(__name__)

# -------------------------------------------------------------
# URL BASE DE LA API DE PREDICCIÓN (Flask u otro servicio externo)
# -------------------------------------------------------------
API_BASE_URL = "http://localhost:5000"



# -------------------------------------------------------------
# VISTAS DEL PANEL PROFESIONAL (simples renders con "choice")
# -------------------------------------------------------------
@login_required(login_url='general:login_inicio_sesion')
def campanias_puntuales_option(request):
    """Renderiza la vista de campañas puntuales."""
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    return render(request, 'profesional/campanias_puntuales.html', {
        "choice": 1,
        "modelo_predictivo": modelo_predictivo
        })


@login_required(login_url='general:login_inicio_sesion')
def clientes_option(request):
    """Renderiza la vista de clientes."""
    try:
        # Obtener el profesional actual
        profesional = request.user.profesional
        
        # Obtener todas las relaciones activas del profesional
        relaciones = ProfesionalCliente.objects.filter(
            profesional=profesional,
            estado='activo'
        ).select_related(
            'cliente__usuario'
        ).prefetch_related(
            'citas'
        )
        
        # Preparar datos de clientes con información de citas
        clientes_data = []
        for relacion in relaciones:
            cliente = relacion.cliente
            usuario = cliente.usuario
            
            # Obtener última cita completada
            ultima_cita = relacion.citas.filter(
                estado='completada'
            ).order_by('-fecha').first()
            
            # Obtener próxima cita pendiente o confirmada
            proxima_cita = relacion.citas.filter(
                estado__in=['pendiente', 'confirmada'],
                fecha__gte=timezone.now()
            ).order_by('fecha').first()
            
            clientes_data.append({
                'id': cliente.id,
                'nombre_completo': usuario.get_full_name(),
                'email': usuario.email if usuario.email else None,
                'telefono': usuario.telefono if usuario.telefono else None,
                'ultima_visita': ultima_cita.fecha if ultima_cita else None,
                'proxima_visita': proxima_cita.fecha if proxima_cita else None,
                'relacion_id': relacion.id
            })
        
        modelo_predictivo = request.session.get('modelo_predictivo', False)
        
        return render(request, 'profesional/clientes.html', {
            "choice": 2,
            "modelo_predictivo": modelo_predictivo,
            "clientes": clientes_data
        })
        
    except Exception as e:
        # Log del error
        print(f"Error en clientes_option: {str(e)}")
        return render(request, 'profesional/clientes.html', {
            "choice": 2,
            "modelo_predictivo": False,
            "clientes": [],
            "error": "No se pudieron cargar los clientes"
        })


@login_required(login_url='general:login_inicio_sesion')
def bandeja_mensaje_option(request):
    """Renderiza la vista de bandeja de mensajes."""
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    return render(request, 'profesional/bandeja_entrada.html', {
        "choice": 3,
        "modelo_predictivo": modelo_predictivo
        })


@login_required(login_url='general:login_inicio_sesion')
def productividad_ingresos_option(request):
    """Renderiza la vista de productividad e ingresos."""
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    return render(request, 'profesional/productividad_ingresos.html', {
        "choice": 4,
        "modelo_predictivo": modelo_predictivo
        })




@login_required(login_url='general:login_inicio_sesion')
def horarios_option(request):
    """Vista principal que maneja tanto GET (mostrar) como POST (guardar)."""
    
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    
    try:
        profesional = Profesional.objects.get(usuario=request.user)
    except Profesional.DoesNotExist:
        messages.error(request, 'No se encontró el perfil de profesional')
        return redirect('general:login_inicio_sesion')
    
    # Crear AspectosNegocio si no existe
    if not profesional.aspectos_negocio:
        aspectos = AspectosNegocio.objects.create()
        profesional.aspectos_negocio = aspectos
        profesional.save()
    
    # MANEJAR POST - Guardar datos
    if request.method == 'POST':
        accion = request.POST.get('accion')
        
        # Guardar aspectos de negocio
        if accion == 'guardar_aspectos':
            aspectos = profesional.aspectos_negocio
            aspectos.direccion = request.POST.get('direccion', '')
            aspectos.permite_presencial = request.POST.get('permite_presencial') == 'on'
            aspectos.permite_virtual = request.POST.get('permite_virtual') == 'on'
            
            # Horarios generales
            hora_apertura = request.POST.get('hora_apertura')
            if hora_apertura:
                aspectos.hora_apertura = datetime.strptime(hora_apertura, '%H:%M').time()
            
            hora_cierre = request.POST.get('hora_cierre')
            if hora_cierre:
                aspectos.hora_cierre = datetime.strptime(hora_cierre, '%H:%M').time()
            
            # Precios
            precio_presencial = request.POST.get('precio_presencial')
            if precio_presencial:
                aspectos.precio_presencial = float(precio_presencial)
            
            precio_online = request.POST.get('precio_online')
            if precio_online:
                aspectos.precio_online = float(precio_online)
            
            aspectos.save()
            messages.success(request, 'Aspectos de negocio guardados correctamente')
        
        # Guardar disponibilidad
        elif accion == 'guardar_disponibilidad':
            dia = request.POST.get('dia')
            hora_inicio_str = request.POST.get('hora_inicio')
            hora_fin_str = request.POST.get('hora_fin')
            
            if dia and hora_inicio_str and hora_fin_str:
                hora_inicio = datetime.strptime(hora_inicio_str, '%H:%M').time()
                hora_fin = datetime.strptime(hora_fin_str, '%H:%M').time()
                
                # Validar
                if hora_inicio >= hora_fin:
                    messages.error(request, 'La hora de inicio debe ser menor que la hora de fin')
                else:
                    # Crear o actualizar
                    disponibilidad, created = Disponibilidad.objects.update_or_create(
                        aspectos_negocio=profesional.aspectos_negocio,
                        dia=dia.lower(),
                        defaults={
                            'hora_inicio': hora_inicio,
                            'hora_fin': hora_fin
                        }
                    )
                    
                    if created:
                        messages.success(request, f'Horario para {dia} agregado correctamente')
                    else:
                        messages.success(request, f'Horario para {dia} actualizado correctamente')
            else:
                messages.error(request, 'Por favor completa todos los campos')
        
        # Eliminar disponibilidad
        elif accion == 'eliminar_disponibilidad':
            disp_id = request.POST.get('disponibilidad_id')
            try:
                disponibilidad = Disponibilidad.objects.get(
                    id=disp_id,
                    aspectos_negocio=profesional.aspectos_negocio
                )
                dia = disponibilidad.dia
                disponibilidad.delete()
                messages.success(request, f'Horario de {dia} eliminado correctamente')
            except Disponibilidad.DoesNotExist:
                messages.error(request, 'Horario no encontrado')
        
        return redirect('profesional:horarios_option')
    
    # MANEJAR GET - Mostrar datos
    disponibilidades = Disponibilidad.objects.filter(
        aspectos_negocio=profesional.aspectos_negocio
    ).order_by('dia', 'hora_inicio')
    
    # Ordenar disponibilidades por día de la semana
    dias_orden = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
    disponibilidades = sorted(
        disponibilidades,
        key=lambda x: dias_orden.index(x.dia) if x.dia in dias_orden else 999
    )
    
    context = {
        "choice": 5,
        "modelo_predictivo": modelo_predictivo,
        "profesional": profesional,
        "disponibilidades": disponibilidades,
        "aspectos_negocio": profesional.aspectos_negocio,
    }
    
    return render(request, 'profesional/horarios.html', context)


@login_required(login_url='general:login_inicio_sesion')
def planes_option(request):
    """Renderiza la vista de planes."""
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    return render(request, 'profesional/planes.html', {
        "choice": 6,
        "modelo_predictivo": modelo_predictivo
        })


@login_required(login_url='general:login_inicio_sesion')
def ajustes_option(request):
    """Renderiza la vista de ajustes."""
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    return render(request, 'profesional/ajustes.html', {
        "modelo_predictivo": modelo_predictivo
    })


@login_required(login_url='general:login_inicio_sesion')
def perfil(request):
    """Renderiza la vista de perfil."""
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    return render(request, 'profesional/perfil.html', {
        "modelo_predictivo": modelo_predictivo
    })


@login_required(login_url='general:login_inicio_sesion')
def prediction_acv_option(request):
    """Renderiza la página principal del módulo de predicción de ACV."""
    modelo_predictivo = request.session.get('modelo_predictivo', False)
    return render(request, 'profesional/prediction_acv.html', {
        "choice": 7,
        "modelo_predictivo": modelo_predictivo
        })


# -------------------------------------------------------------
# VISTA PRINCIPAL DE PREDICCIÓN DE ACV
# -------------------------------------------------------------
@csrf_exempt
@login_required(login_url='general:login_inicio_sesion')
def realizar_prediccion_acv(request):
    """
    Procesa la información del formulario de predicción de ACV.

    - Recibe los datos clínicos del paciente y la imagen médica (ecografía).
    - Envía esta información al servicio Flask de predicción (API externa).
    - Devuelve una respuesta JSON al frontend con las probabilidades calculadas.
    """
    if request.method != 'POST':
        logger.warning("Método no permitido en realizar_prediccion_acv")
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

    try:
        # ---------------------------------------------------------
        # 1. Lectura de archivos y datos del formulario
        # ---------------------------------------------------------
        image_file = request.FILES.get('image')

        logger.info("=== DEBUG INFO ===")
        logger.info(f"Método: {request.method}")
        logger.info(f"Content-Type: {request.content_type}")
        logger.info(f"Archivos recibidos: {list(request.FILES.keys())}")
        logger.info(f"Datos POST recibidos: {list(request.POST.keys())}")
        logger.info("==================")

        # Validación: verificar que se haya recibido una imagen
        if not image_file:
            logger.error("No se proporcionó ninguna imagen")
            return JsonResponse({
                'success': False,
                'error': 'No se proporcionó ninguna imagen. Selecciona un archivo antes de enviar el formulario.'
            }, status=400)

        logger.info(f"Imagen recibida: {image_file.name} ({image_file.size} bytes)")

        # ---------------------------------------------------------
        # 2. Recolectar y validar datos clínicos
        # ---------------------------------------------------------
        clinical_data = {
            'gender': request.POST.get('genero'),
            'age': request.POST.get('edad'),
            'hypertension': request.POST.get('hipertension'),
            'heart_disease': request.POST.get('problemas_cardiacos'),
            'ever_married': request.POST.get('casado'),
            'work_type': request.POST.get('trabajo'),
            'Residence_type': request.POST.get('residencia'),
            'avg_glucose_level': request.POST.get('glucosa'),
            'bmi': request.POST.get('imc'),
            'smoking_status': request.POST.get('fumador'),
        }

        campos_faltantes = [k for k, v in clinical_data.items() if not v]
        if campos_faltantes:
            logger.error(f"Campos faltantes: {campos_faltantes}")
            return JsonResponse({
                'success': False,
                'error': f'Faltan campos requeridos: {", ".join(campos_faltantes)}'
            }, status=400)

        # ---------------------------------------------------------
        # 3. Preparar y enviar solicitud a la API Flask
        # ---------------------------------------------------------
        image_file.seek(0)  # Reiniciar puntero del archivo
        files = {'image': (image_file.name, image_file.read(), image_file.content_type or 'image/jpeg')}

        logger.info(f"Enviando datos a la API de predicción ({API_BASE_URL}/predict)...")

        response = requests.post(
            f"{API_BASE_URL}/predict",
            data=clinical_data,
            files=files,
            timeout=30
        )

        logger.info(f"Respuesta recibida: Status {response.status_code}")

        # ---------------------------------------------------------
        # 4. Procesar respuesta de la API
        # ---------------------------------------------------------
        if response.status_code == 200:
            result = response.json()
            prediction_result = result.get('result', {})

            # Intentar convertir las probabilidades a float
            try:
                clinical_prob = float(prediction_result.get('clinical_probability', 0))
                image_prob = float(prediction_result.get('image_probability', 0))
                hybrid_prob = float(prediction_result.get('hybrid_probability', 0))
                confidence = float(prediction_result.get('confidence', 0))
            except (ValueError, TypeError):
                clinical_prob = image_prob = hybrid_prob = confidence = 0
                logger.warning("Error al convertir las probabilidades a número")

            response_data = {
                'success': True,
                'result': {
                    'clinical_probability': round(clinical_prob * 100, 2),
                    'image_probability': round(image_prob * 100, 2),
                    'hybrid_probability': round(hybrid_prob * 100, 2),
                    'prediction': prediction_result.get('prediction', 'Sin ACV'),
                    'confidence': round(confidence * 100, 2),
                },
                'message': 'Predicción realizada exitosamente'
            }

            logger.info(f"Resultado enviado al frontend: {response_data}")
            return JsonResponse(response_data)

        # Si la API devuelve error
        logger.error(f"Error de API: {response.status_code} - {response.text}")
        try:
            error_data = response.json()
        except Exception:
            error_data = {'error': response.text}

        return JsonResponse({
            'success': False,
            'error': error_data.get('error', f'Error del servidor de predicción (Status: {response.status_code})')
        }, status=response.status_code)

    # -------------------------------------------------------------
    # MANEJO DE ERRORES DE CONEXIÓN Y TIMEOUT
    # -------------------------------------------------------------
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Error de conexión con la API: {e}")
        return JsonResponse({
            'success': False,
            'error': 'No se pudo conectar con el servidor de predicción. '
                     'Verifica que la API esté activa en http://localhost:5000'
        }, status=503)

    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout de conexión: {e}")
        return JsonResponse({
            'success': False,
            'error': 'El servidor tardó demasiado en responder. Intenta nuevamente.'
        }, status=504)

    # -------------------------------------------------------------
    # ERRORES NO CONTROLADOS
    # -------------------------------------------------------------
    except Exception as e:
        logger.exception(f"Error inesperado: {e}")
        return JsonResponse({
            'success': False,
            'error': f'Error inesperado: {str(e)}'
        }, status=500)
