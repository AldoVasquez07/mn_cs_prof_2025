from django.urls import path
from .views import *

app_name = 'profesional'

urlpatterns = [
    path('', login_profesional, name='login_profesional'),
]