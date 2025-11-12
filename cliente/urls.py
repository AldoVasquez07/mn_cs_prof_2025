from django.urls import path
from .views import *

app_name = 'cliente'

urlpatterns = [
    path('mis-citas/', mis_citas_option, name='mis_citas_option'),
    path('profesionales/', profesionales_option, name='profesionales_option'),
    path('bandeja-mensaje/', bandeja_mensaje_option, name='bandeja_mensaje_option'),
]