from django.db import models


class Profesion(models.Model):
    nombre = models.TextField(max_length=150, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    flag = models.BooleanField(default=True)


class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    profesion = models.ForeignKey(Profesion, on_delete=models.CASCADE, related_name='especialidades', null=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Profesional(models.Model):
    usuario = models.OneToOneField('sistema.Usuario', on_delete=models.CASCADE, related_name='profesional')
    especialidad = models.ForeignKey(Especialidad, on_delete=models.SET_NULL, null=True, blank=True, related_name='profesionales')
    aspectos_negocio = models.ForeignKey('sistema.AspectosNegocio', on_delete=models.SET_NULL, null=True, related_name='profesionales')
    organizacion = models.ForeignKey('organizacion.Organizacion', on_delete=models.SET_NULL, null=True, blank=True, related_name='profesionales')
    flag = models.BooleanField(default=True)

    def __str__(self):
        return f'Profesional: {self.usuario.nombre} {self.usuario.apellido_paterno}'