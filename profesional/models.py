from django.db import models


class Profesional(models.Model):
    persona = models.OneToOneField('sistema.Persona', on_delete=models.CASCADE, related_name='profesional')
    especialidad = models.ForeignKey('sistema.Especialidad', on_delete=models.SET_NULL, null=True, blank=True, related_name='profesionales')
    experiencia = models.TextField(blank=True)
    organizacion = models.ForeignKey('organizacion.Organizacion', on_delete=models.SET_NULL, null=True, blank=True, related_name='profesionales')
    aspecto_negocio = models.ForeignKey('sistema.AspectosNegocio', on_delete=models.SET_NULL, null=True, related_name='profesionales')
    flag = models.BooleanField(default=True)

    def __str__(self):
        return f'Profesional: {self.persona.nombre} {self.persona.apellido_paterno}'