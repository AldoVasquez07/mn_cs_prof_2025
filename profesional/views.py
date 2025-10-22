# profesional/views.py
# -------------------------------------------------------------
# Vistas correspondientes al módulo de profesionales.
# Incluye la navegación principal del panel profesional y la
# funcionalidad de predicción de ACV mediante integración con
# un modelo de Machine Learning externo (API Flask).
# -------------------------------------------------------------

import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

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
def campanias_puntuales_option(request):
    """Renderiza la vista de campañas puntuales."""
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 1})


def clientes_option(request):
    """Renderiza la vista de clientes."""
    return render(request, 'profesional/clientes.html', {"choice": 2})


def bandeja_entrada_option(request):
    """Renderiza la vista de bandeja de entrada."""
    return render(request, 'profesional/bandeja_entrada.html', {"choice": 3})


def productividad_ingresos_option(request):
    """Renderiza la vista de productividad e ingresos."""
    return render(request, 'profesional/productividad_ingresos.html', {"choice": 4})


def horarios_option(request):
    """Renderiza la vista de horarios."""
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 5})


def planes_option(request):
    """Renderiza la vista de planes."""
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 6})


def ajustes_option(request):
    """Renderiza la vista de ajustes."""
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 7})


def prediction_acv_option(request):
    """Renderiza la página principal del módulo de predicción de ACV."""
    return render(request, 'profesional/prediction_acv.html', {"choice": 8})


# -------------------------------------------------------------
# VISTA PRINCIPAL DE PREDICCIÓN DE ACV
# -------------------------------------------------------------
@csrf_exempt
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
