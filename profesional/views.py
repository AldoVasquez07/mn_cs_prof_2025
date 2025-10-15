import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

# Configurar logging
logger = logging.getLogger(__name__)

# URL de la API de predicción
API_BASE_URL = "http://localhost:5000"


def campanias_puntuales_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 1})

def clientes_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 2})

def bandeja_entrada_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 3})

def productividad_ingresos_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 4})

def horarios_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 5})

def planes_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 6})

def ajustes_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 7})


def prediction_acv_option(request):
    """Renderiza la página de predicción"""
    return render(request, 'profesional/prediction_acv.html', {"choice": 8})


@csrf_exempt
def realizar_prediccion_acv(request):
    """Procesa el formulario y envía los datos a la API de predicción"""
    
    if request.method != 'POST':
        logger.warning("Método no permitido en realizar_prediccion_acv")
        return JsonResponse({
            'success': False,
            'error': 'Método no permitido'
        }, status=405)
    
    try:
        # Obtener la imagen del formulario
        image_file = request.FILES.get('image')
        
        logger.info(f"=== DEBUG INFO ===")
        logger.info(f"Método: {request.method}")
        logger.info(f"Content-Type: {request.content_type}")
        logger.info(f"Archivos recibidos: {list(request.FILES.keys())}")
        logger.info(f"Datos POST recibidos: {list(request.POST.keys())}")
        logger.info(f"Datos GET recibidos: {list(request.GET.keys())}")
        logger.info(f"==================")
        
        if not image_file:
            logger.error("No se proporcionó ninguna imagen")
            # Mostrar qué se recibió para debug
            logger.error(f"POST keys: {list(request.POST.keys())}")
            logger.error(f"FILES keys: {list(request.FILES.keys())}")
            logger.error(f"GET keys: {list(request.GET.keys())}")
            return JsonResponse({
                'success': False,
                'error': 'No se proporcionó ninguna imagen. Asegúrate de seleccionar un archivo antes de enviar el formulario.'
            }, status=400)
        
        logger.info(f"Imagen recibida: {image_file.name}, Tamaño: {image_file.size} bytes")
        
        # Obtener los datos clínicos del formulario
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
            'smoking_status': request.POST.get('fumador')
        }
        
        logger.info(f"Datos clínicos recibidos: {clinical_data}")
        
        # Validar que todos los campos estén presentes
        campos_faltantes = [k for k, v in clinical_data.items() if not v]
        if campos_faltantes:
            logger.error(f"Campos faltantes: {campos_faltantes}")
            return JsonResponse({
                'success': False,
                'error': f'Faltan campos requeridos: {", ".join(campos_faltantes)}'
            }, status=400)
        
        # Preparar los archivos para enviar a la API
        # IMPORTANTE: Reset del puntero del archivo
        image_file.seek(0)
        
        files = {
            'image': (image_file.name, image_file.read(), image_file.content_type or 'image/jpeg')
        }
        
        logger.info(f"Enviando petición a {API_BASE_URL}/predict")
        
        # Hacer la petición a la API de predicción
        response = requests.post(
            f"{API_BASE_URL}/predict",
            data=clinical_data,
            files=files,
            timeout=30
        )
        
        logger.info(f"Respuesta de API: Status {response.status_code}")
        
        # Verificar si la petición fue exitosa
        if response.status_code == 200:
            result = response.json()
            logger.info(f"Resultado de API: {result}")
            
            # Formatear la respuesta para el frontend
            prediction_result = result.get('result', {})
            
            # Asegurarse de que todos los valores sean numéricos
            try:
                clinical_prob = float(prediction_result.get('clinical_probability', 0))
                image_prob = float(prediction_result.get('image_probability', 0))
                hybrid_prob = float(prediction_result.get('hybrid_probability', 0))
                confidence = float(prediction_result.get('confidence', 0))
            except (ValueError, TypeError) as e:
                logger.error(f"Error convirtiendo probabilidades: {e}")
                clinical_prob = image_prob = hybrid_prob = confidence = 0
            
            response_data = {
                'success': True,
                'result': {
                    'clinical_probability': round(clinical_prob * 100, 2),
                    'image_probability': round(image_prob * 100, 2),
                    'hybrid_probability': round(hybrid_prob * 100, 2),
                    'prediction': prediction_result.get('prediction', 'Sin ACV'),
                    'confidence': round(confidence * 100, 2)
                },
                'message': 'Predicción realizada exitosamente'
            }
            
            logger.info(f"Respuesta enviada al frontend: {response_data}")
            return JsonResponse(response_data)
        else:
            # Error de la API
            logger.error(f"Error de API: Status {response.status_code}, Content: {response.text}")
            try:
                error_data = response.json()
            except:
                error_data = {'error': response.text}
            
            return JsonResponse({
                'success': False,
                'error': error_data.get('error', f'Error del servidor de predicción (Status: {response.status_code})')
            }, status=response.status_code)
    
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Error de conexión: {e}")
        return JsonResponse({
            'success': False,
            'error': 'No se pudo conectar con el servidor de predicción. Verifique que la API esté en ejecución en http://localhost:5000'
        }, status=503)
    
    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout: {e}")
        return JsonResponse({
            'success': False,
            'error': 'El servidor tardó demasiado en responder. Intente nuevamente.'
        }, status=504)
    
    except Exception as e:
        logger.exception(f"Error inesperado: {e}")
        return JsonResponse({
            'success': False,
            'error': f'Error inesperado: {str(e)}'
        }, status=500)