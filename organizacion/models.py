from django.db import models


class Organizacion(models.Model):
    ruc = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=150)
    aspecto_negocio = models.ForeignKey('sistema.AspectosNegocio', on_delete=models.SET_NULL, null=True, blank=True, related_name='organizaciones')
    flag = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre