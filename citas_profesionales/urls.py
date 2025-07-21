from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('general.urls', namespace='general')),
    path('profesionales/', include('profesional.urls', namespace='profesional')),
    path('clientes/', include('cliente.urls', namespace='cliente')),
    path('sistema/', include('sistema.urls', namespace='sistema')),
]
