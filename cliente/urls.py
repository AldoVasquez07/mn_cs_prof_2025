from django.urls import path
from .views import *

app_name = 'cliente'

urlpatterns = [
    path('', login_cliente, name='login_cliente'),
]