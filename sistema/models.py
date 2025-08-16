from django.db import models
from datetime import datetime
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser


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


class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Usuario(AbstractUser):
    apellido_paterno = models.CharField(max_length=150, blank=True)
    apellido_materno = models.CharField(max_length=150, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    documento_identidad = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    ciudad = models.ForeignKey(Ciudad, on_delete=models.SET_NULL, null=True, blank=True)
    calificacion = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)
    flag = models.BooleanField(default=True)
    
    def __str__(self):
        return f'{self.first_name} {self.apellido_paterno} {self.apellido_materno}'
    

    def clean(self):
        super().clean()
        
        if Usuario.objects.filter(documento_identidad=self.documento_identidad).exclude(id=self.id).exists():
            raise ValueError("El documento de identidad ya está en uso.")
        
        if Usuario.objects.filter(email=self.email).exclude(id=self.id).exists():
            raise ValueError("El correo electrónico ya está en uso.")

        if isinstance(self.fecha_nacimiento, str):
            self.fecha_nacimiento = datetime.strptime(self.fecha_nacimiento, "%Y-%m-%d").date()

        if self.fecha_nacimiento and self.fecha_nacimiento > timezone.now().date():
            raise ValidationError("La fecha de nacimiento no puede ser futura.")
        
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class LogProcesos(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    proceso = models.CharField(max_length=250)
    mensaje = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='logs')
    flag = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.proceso} - {self.fecha}'
    

class AspectosNegocio(models.Model):
    direccion = models.CharField(max_length=255, blank=True)
    experiencia = models.TextField(blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    hora_apertura = models.TimeField(null=True, blank=True)
    hora_cierre = models.TimeField(null=True, blank=True)
    flag = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
    
    def clean(self):
        if isinstance(self.hora_apertura, str):
            self.hora_apertura = datetime.strptime(self.hora_apertura, '%H:%M').time()
            
        if isinstance(self.hora_cierre, str):
            self.hora_cierre = datetime.strptime(self.hora_cierre, '%H:%M').time()

