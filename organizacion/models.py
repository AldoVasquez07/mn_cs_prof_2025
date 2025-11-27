from django.db import models
from django.conf import settings


class Organizacion(models.Model):
    ruc = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=150)
    aspecto_negocio = models.ForeignKey('sistema.AspectosNegocio', on_delete=models.SET_NULL, null=True, blank=True, related_name='organizaciones')
    
    # Auditoría
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_created"
    )
    created_date = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    
    modified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_modified"
    )
    modified_date = models.DateTimeField(null=True, blank=True, auto_now=True)
    
    flag = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre