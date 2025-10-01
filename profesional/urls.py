from django.urls import path
from .views import *

app_name = 'profesional'

urlpatterns = [
    path('campanias-puntuales/', campanias_puntuales_option, name='campanias_puntuales_option'),
    path('clientes/', clientes_option, name='clientes_option'),
    path('bandeja-entrada-option/', bandeja_entrada_option, name='bandeja_entrada_option'),
    path('productividad-ingresos-option/', productividad_ingresos_option, name='productividad_ingresos_option'),
    path('horarios-option/', horarios_option, name='horarios_option'),
    path('planes-option/', planes_option, name='planes_option'),
    path('ajustes-option/', ajustes_option, name='ajustes_option'),
]