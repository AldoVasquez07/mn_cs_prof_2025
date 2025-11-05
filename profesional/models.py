# profesional/models.py
# -------------------------------------------------------------
# Modelos de datos para la aplicación "profesional".
# Estos modelos representan las profesiones, especialidades
# y la entidad del profesional dentro del sistema.
# -------------------------------------------------------------

from django.db import models


class Profesion(models.Model):
    """
    Representa una profesión general (por ejemplo: Medicina, Psicología, Ingeniería, etc.)
    a la que pueden pertenecer distintas especialidades.
    """
    nombre = models.TextField(max_length=150, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    flag = models.BooleanField(default=True, help_text="Indica si el registro está activo o no.")

    def __str__(self):
        """Devuelve una representación legible de la profesión."""
        return self.nombre


class Especialidad(models.Model):
    """
    Representa una especialidad dentro de una profesión específica.
    Ejemplo: Cardiología dentro de Medicina, o Desarrollo Web dentro de Ingeniería.
    """
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    profesion = models.ForeignKey(
        Profesion,
        on_delete=models.CASCADE,
        related_name='especialidades',
        null=True,
        help_text="Profesión a la que pertenece esta especialidad."
    )
    flag = models.BooleanField(default=True, help_text="Indica si la especialidad está activa.")

    def __str__(self):
        """Devuelve el nombre de la especialidad."""
        return self.nombre


class Profesional(models.Model):
    """
    Representa al usuario profesional del sistema.
    Se vincula a su usuario base, a su especialidad y a los aspectos de negocio registrados.
    """
    usuario = models.OneToOneField(
        'sistema.Usuario',
        on_delete=models.CASCADE,
        related_name='profesional',
        help_text="Referencia al usuario asociado (modelo Usuario)."
    )
    especialidad = models.ForeignKey(
        Especialidad,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='profesionales',
        help_text="Especialidad que ejerce el profesional."
    )
    aspectos_negocio = models.ForeignKey(
        'sistema.AspectosNegocio',
        on_delete=models.SET_NULL,
        null=True,
        related_name='profesionales',
        help_text="Aspectos de negocio relacionados con este profesional."
    )
    organizacion = models.ForeignKey(
        'organizacion.Organizacion',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='profesionales',
        help_text="Organización o institución a la que pertenece el profesional."
    )
    flag = models.BooleanField(default=True, help_text="Indica si el profesional está activo en el sistema.")

    def __str__(self):
        """
        Retorna una representación legible del profesional,
        combinando su nombre y apellido paterno.
        """
        return f'Profesional: {self.usuario.first_name} {self.usuario.apellido_paterno}'


class ProfesionalCliente(models.Model):
    profesional = models.ForeignKey(
        'profesional.Profesional',
        on_delete=models.CASCADE,
        related_name='relaciones_cliente'
    )
    cliente = models.ForeignKey(
        'cliente.Cliente',
        on_delete=models.CASCADE,
        related_name='relaciones_profesional'
    )
    fecha_inicio = models.DateField(auto_now_add=True)
    estado = models.CharField(
        max_length=50,
        default='activo',
        help_text='Estado de la relación (activo, finalizado, suspendido, etc.)'
    )

    class Meta:
        unique_together = ('profesional', 'cliente')
        verbose_name = 'Relación Profesional-Cliente'
        verbose_name_plural = 'Relaciones Profesionales-Clientes'

    def __str__(self):
        return f'{self.profesional} ↔ {self.cliente}'


class Mensaje(models.Model):
    relacion = models.ForeignKey(
        'profesional.ProfesionalCliente',
        on_delete=models.CASCADE,
        related_name='mensajes'
    )
    emisor = models.CharField(
        max_length=20,
        choices=[('profesional', 'Profesional'), ('cliente', 'Cliente')]
    )
    contenido = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha_envio']

    def __str__(self):
        return f'Mensaje de {self.emisor} ({self.fecha_envio:%Y-%m-%d %H:%M})'



class Cita(models.Model):
    relacion = models.ForeignKey(
        'profesional.ProfesionalCliente',
        on_delete=models.CASCADE,
        related_name='citas',
        help_text="Relación profesional-cliente a la que pertenece esta cita."
    )
    fecha = models.DateTimeField(help_text="Fecha y hora programada de la cita.")
    estado = models.CharField(
        max_length=20,
        choices=[
            ('pendiente', 'Pendiente'),
            ('confirmada', 'Confirmada'),
            ('completada', 'Completada'),
            ('cancelada', 'Cancelada')
        ],
        default='pendiente'
    )
    motivo = models.TextField(blank=True, null=True, help_text="Motivo o descripción de la cita.")
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']
        verbose_name = "Cita"
        verbose_name_plural = "Citas"

    def __str__(self):
        return f'Cita {self.fecha:%Y-%m-%d %H:%M} | {self.relacion}'
