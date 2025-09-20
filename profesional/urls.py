from django.urls import path
from .views import *

app_name = 'profesional'

urlpatterns = [
    path('', home_profesional, name='home_profesional'),
]