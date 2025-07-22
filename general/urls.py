from django.urls import path, include
from .views import *

app_name = 'general'

urlpatterns = [
    # Página principal
    path('', main_content_page, name='main_page_citas'),
    path('login/', login_inicio_sesion, name="login_inicio_sesion"),
    path('tipo-registro/', seleccion_tipo_usuario, name='seleccion_tipo_usuario'),
    path('tipo-registro/cliente/', login_registro_cliente, name='login_registro_cliente'),
    path('tipo-registro/profesional/', login_registro_profesional, name='login_registro_profesional'),
    path('tipo-registro/organizacion/', login_registro_organizacion, name='login_registro_organizacion'),
]