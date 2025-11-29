from django.db import models
from datetime import datetime
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class Pais(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=10, unique=True)
    
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


class Ciudad(models.Model):
    nombre = models.CharField(max_length=150)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE, related_name='ciudades')
    
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


class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
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


class Usuario(AbstractUser):
    apellido_paterno = models.CharField(max_length=150, blank=True)
    apellido_materno = models.CharField(max_length=150, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    documento_identidad = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    ciudad = models.ForeignKey(Ciudad, on_delete=models.SET_NULL, null=True, blank=True)
    calificacion = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)
    
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
        return f'{self.first_name} {self.apellido_paterno} {self.apellido_materno}'
    

    def clean(self):
        super().clean()
        
        if Usuario.objects.filter(documento_identidad=self.documento_identidad).exclude(id=self.id).exists():
            raise ValidationError("El documento de identidad ya está en uso.")
        
        if Usuario.objects.filter(email=self.email).exclude(id=self.id).exists():
            raise ValidationError("El correo electrónico ya está en uso.")

        if isinstance(self.fecha_nacimiento, str):
            self.fecha_nacimiento = datetime.strptime(self.fecha_nacimiento, "%Y-%m-%d").date()

        if self.fecha_nacimiento and self.fecha_nacimiento > timezone.now().date():
            raise ValidationError("La fecha de nacimiento no puede ser futura.")
    
        
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
        
    def get_full_name(self):
        nombre = self.first_name or ""
        ap_paterno = self.apellido_paterno or ""
        ap_materno = self.apellido_materno or ""

        return f"{nombre} {ap_paterno} {ap_materno}".strip()



class LogProcesos(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    proceso = models.CharField(max_length=250)
    mensaje = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='logs')
    flag = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.proceso} - {self.fecha}'
    


class RegistroAcceso(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    accion = models.CharField(max_length=10)  # login / logout
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    duracion_sesion = models.DurationField(null=True, blank=True)  # solo para logout

    def __str__(self):
        return f"{self.usuario.email} - {self.accion} - {self.fecha}"


class AspectosNegocio(models.Model):
    direccion = models.CharField(max_length=255, blank=True)
    experiencia = models.TextField(blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    hora_apertura = models.TimeField(null=True, blank=True)
    hora_cierre = models.TimeField(null=True, blank=True)

    permite_presencial = models.BooleanField(default=False)
    permite_virtual = models.BooleanField(default=False)

    # CAMPOS FALTANTES (AGREGAR)
    precio_presencial = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    precio_online = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    
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
        return self.direccion or "Aspectos Negocio"
    
    
class Disponibilidad(models.Model):
    aspectos_negocio = models.ForeignKey(
        AspectosNegocio,
        on_delete=models.CASCADE,
        related_name='disponibilidades'
    )
    dia = models.CharField(
        max_length=15,
        choices=[
            ("lunes", "Lunes"),
            ("martes", "Martes"),
            ("miércoles", "Miércoles"),
            ("jueves", "Jueves"),
            ("viernes", "Viernes"),
            ("sábado", "Sábado"),
            ("domingo", "Domingo"),
        ]
    )
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    
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

    def __str__(self):
        return f"{self.dia}: {self.hora_inicio.strftime('%H:%M')} - {self.hora_fin.strftime('%H:%M')}"

