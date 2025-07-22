from django.urls import path, include
from .views import *

app_name = 'general'

urlpatterns = [
    # Página principal
    path('', main_content_page, name='main_page_citas'),
    path('tipo-registro/', seleccion_tipo_usuario, name='seleccion_tipo_usuario'),
    path('login/', login_inicio_sesion, name="login_inicio_sesion"),
]