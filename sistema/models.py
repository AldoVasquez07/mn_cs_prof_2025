from django.db import models
from django.contrib.auth.models import AbstractUser
    

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Usuario(AbstractUser):
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
    

class LogProcesos(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    proceso = models.CharField(max_length=250)
    mensaje = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='logs')
    flag = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.proceso} - {self.fecha}'
    


class Pais(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Ciudad(models.Model):
    nombre = models.CharField(max_length=150)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE, related_name='ciudades')
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Persona(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='persona')
    nombre = models.CharField(max_length=150)
    apellido_paterno = models.CharField(max_length=150, blank=True)
    apellido_materno = models.CharField(max_length=150, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    documento_identidad = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    ciudad = models.ForeignKey(Ciudad, on_delete=models.SET_NULL, null=True, blank=True, related_name='personas')
    calificacion = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    flag = models.BooleanField(default=True)
        
    def __str__(self):
        return f'{self.nombre} {self.apellido_paterno} {self.apellido_materno}'


class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
    

class AspectosNegocio(models.Model):
    direccion = models.CharField(max_length=255, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    hora_apertura = models.TimeField(null=True, blank=True)
    hora_cierre = models.TimeField(null=True, blank=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

