# general/urls.py
# -------------------------------------------------------------
# Archivo de configuración de rutas (URLs) para la aplicación "general".
# Define las vistas principales relacionadas con el inicio de sesión,
# selección y registro de tipos de usuario.
# -------------------------------------------------------------

from django.urls import path, include
from .views import *

# Namespace para las URLs de esta app, útil cuando se usan nombres repetidos en el proyecto.
app_name = 'general'

urlpatterns = [
    # ---------------------------------------------------------
    # Página principal del sistema
    # ---------------------------------------------------------
    path('', main_content_page, name='main_page_citas'),

    # ---------------------------------------------------------
    # Autenticación y acceso
    # ---------------------------------------------------------
    path('login/', login_inicio_sesion, name="login_inicio_sesion"),

    # ---------------------------------------------------------
    # Selección del tipo de registro (Cliente / Profesional / Organización)
    # ---------------------------------------------------------
    path('tipo-registro/', seleccion_tipo_usuario, name='seleccion_tipo_usuario'),

    # ---------------------------------------------------------
    # Formularios de registro según tipo de usuario
    # ---------------------------------------------------------
    path('tipo-registro/cliente/', login_registro_cliente, name='login_registro_cliente'),
    path('tipo-registro/profesional/', login_registro_profesional, name='login_registro_profesional'),
    path('tipo-registro/organizacion/', login_registro_organizacion, name='login_registro_organizacion'),
]
