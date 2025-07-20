from django.urls import path, include
from .views import *

app_name = 'general'

urlpatterns = [
    # Página principal
    path('', main_content_page, name='main_page_citas'),
]