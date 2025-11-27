from django.db import models
from django.conf import settings


class Cliente(models.Model):
    usuario = models.OneToOneField('sistema.Usuario', on_delete=models.CASCADE, related_name='cliente')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    
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
        return f'Cliente: {self.usuario.first_name} {self.usuario.apellido_paterno}'