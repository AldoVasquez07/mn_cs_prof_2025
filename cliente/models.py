from django.db import models

# Create your models here.
class Cliente(models.Model):
    persona = models.OneToOneField('sistema.Persona', on_delete=models.CASCADE, related_name='cliente')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return f'Cliente: {self.persona.nombre} {self.persona.apellido_paterno}'