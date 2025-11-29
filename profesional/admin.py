from django.contrib import admin
from .models import (
    Profesion, Especialidad, Profesional,
    ProfesionalCliente, Mensaje, Cita
)


# ---------------------------------------------------------
# PROFESIÓN
# ---------------------------------------------------------
@admin.register(Profesion)
class ProfesionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'flag', 'created_date')
    search_fields = ('nombre',)
    list_filter = ('flag',)
    ordering = ('nombre',)


# ---------------------------------------------------------
# ESPECIALIDAD
# ---------------------------------------------------------
@admin.register(Especialidad)
class EspecialidadAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'profesion', 'flag', 'created_date')
    search_fields = ('nombre', 'profesion__nombre')
    list_filter = ('profesion', 'flag')
    ordering = ('nombre',)


# ---------------------------------------------------------
# PROFESIONAL
# ---------------------------------------------------------
@admin.register(Profesional)
class ProfesionalAdmin(admin.ModelAdmin):
    list_display = (
        'usuario', 'especialidad', 'organizacion',
        'aspectos_negocio', 'flag'
    )
    search_fields = ('usuario__email', 'usuario__first_name', 'usuario__apellido_paterno')
    list_filter = ('especialidad', 'organizacion', 'flag')
    ordering = ('usuario__email',)


# ---------------------------------------------------------
# MENSAJES INLINE DENTRO DE PROFESIONAL-CLIENTE
# ---------------------------------------------------------
class MensajeInline(admin.TabularInline):
    model = Mensaje
    extra = 0
    readonly_fields = ('fecha_envio',)
    ordering = ('-fecha_envio',)


# ---------------------------------------------------------
# CITAS INLINE DENTRO DE PROFESIONAL-CLIENTE
# ---------------------------------------------------------
class CitaInline(admin.TabularInline):
    model = Cita
    extra = 0
    readonly_fields = ('fecha_creacion',)
    ordering = ('-fecha',)


# ---------------------------------------------------------
# PROFESIONAL - CLIENTE
# ---------------------------------------------------------
@admin.register(ProfesionalCliente)
class ProfesionalClienteAdmin(admin.ModelAdmin):
    list_display = ('profesional', 'cliente', 'fecha_inicio', 'estado')
    search_fields = ('profesional__usuario__email', 'cliente__usuario__email')
    list_filter = ('estado', 'fecha_inicio')
    ordering = ('-fecha_inicio',)

    inlines = [MensajeInline, CitaInline]


# ---------------------------------------------------------
# MENSAJE
# ---------------------------------------------------------
@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ('relacion', 'emisor', 'fecha_envio')
    search_fields = ('relacion__profesional__usuario__email', 'relacion__cliente__usuario__email')
    list_filter = ('emisor', 'fecha_envio')
    ordering = ('-fecha_envio',)


# ---------------------------------------------------------
# CITA
# ---------------------------------------------------------
@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = (
        'relacion', 'fecha', 'estado',
        'calificacion_profesional', 'calificacion_cliente'
    )
    search_fields = (
        'relacion__profesional__usuario__email',
        'relacion__cliente__usuario__email'
    )
    list_filter = ('estado', 'fecha')
    ordering = ('-fecha',)
