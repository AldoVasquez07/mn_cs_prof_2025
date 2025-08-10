from django.db import models

class Cliente(models.Model):
    usuario = models.OneToOneField('sistema.Usuario', on_delete=models.CASCADE, related_name='cliente')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return f'Cliente: {self.usuario.first_name} {self.usuario.apellido_paterno}'