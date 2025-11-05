# profesional/urls.py
# -------------------------------------------------------------
# Archivo de configuración de rutas (URLs) para la aplicación "profesional".
# Define las rutas principales para las distintas secciones del panel
# del profesional, incluyendo la funcionalidad de predicción de ACV.
# -------------------------------------------------------------

from django.urls import path
from .views import *

# Namespace para las URLs de esta app (evita conflictos con otras apps)
app_name = 'profesional'

urlpatterns = [
    # ---------------------------------------------------------
    # Sección de campañas puntuales
    # ---------------------------------------------------------
    path('campanias-puntuales/', campanias_puntuales_option, name='campanias_puntuales_option'),

    # ---------------------------------------------------------
    # Gestión de clientes del profesional
    # ---------------------------------------------------------
    path('clientes/', clientes_option, name='clientes_option'),

    # ---------------------------------------------------------
    # Bandeja de entrada (mensajes o solicitudes)
    # ---------------------------------------------------------
    path('bandeja-entrada-option/', bandeja_entrada_option, name='bandeja_entrada_option'),

    # ---------------------------------------------------------
    # Reportes de productividad e ingresos
    # ---------------------------------------------------------
    path('productividad-ingresos-option/', productividad_ingresos_option, name='productividad_ingresos_option'),

    # ---------------------------------------------------------
    # Administración de horarios del profesional
    # ---------------------------------------------------------
    path('horarios-option/', horarios_option, name='horarios_option'),

    # ---------------------------------------------------------
    # Planes y suscripciones del profesional
    # ---------------------------------------------------------
    path('planes-option/', planes_option, name='planes_option'),

    # ---------------------------------------------------------
    # Configuración general o ajustes de cuenta
    # ---------------------------------------------------------
    path('ajustes-option/', ajustes_option, name='ajustes_option'),
    
    
    # ---------------------------------------------------------
    # Vista del perfil de usuario
    # ---------------------------------------------------------
    path('perfil-option/', perfil, name='perfil_option'),

    # ---------------------------------------------------------
    # Módulo de predicción de ACV (vista principal)
    # ---------------------------------------------------------
    path('prediction-acv-option/', prediction_acv_option, name='prediction_acv_option'),

    # ---------------------------------------------------------
    # Endpoint para procesar la predicción de ACV (POST con imagen + datos)
    # ---------------------------------------------------------
    path('prediction-acv-option/realizar/', realizar_prediccion_acv, name='realizar_prediccion_acv'),
]
