from django.contrib import admin
from .models import (
    Pais, Ciudad, Rol, Usuario,
    LogProcesos, RegistroAcceso,
    AspectosNegocio, Disponibilidad
)


# -------------------------------------------------------------------
# MODELOS BÁSICOS
# -------------------------------------------------------------------

@admin.register(Pais)
class PaisAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'flag', 'created_date')
    search_fields = ('nombre', 'codigo')
    list_filter = ('flag',)
    ordering = ('nombre',)


@admin.register(Ciudad)
class CiudadAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'pais', 'flag', 'created_date')
    search_fields = ('nombre',)
    list_filter = ('pais', 'flag')
    ordering = ('nombre',)


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'flag', 'created_date')
    search_fields = ('nombre',)
    ordering = ('nombre',)


# -------------------------------------------------------------------
# USUARIO PERSONALIZADO
# -------------------------------------------------------------------

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = (
        'email', 'first_name', 'apellido_paterno', 'apellido_materno',
        'documento_identidad', 'rol', 'ciudad', 'flag'
    )
    search_fields = ('email', 'first_name', 'apellido_paterno', 'documento_identidad')
    list_filter = ('rol', 'ciudad', 'flag')
    ordering = ('email',)
    filter_horizontal = ()  # puedes agregar grupos o permisos si los usas


# -------------------------------------------------------------------
# LOGS Y REGISTROS DE ACCESO
# -------------------------------------------------------------------

@admin.register(LogProcesos)
class LogProcesosAdmin(admin.ModelAdmin):
    list_display = ('proceso', 'usuario', 'fecha', 'flag')
    search_fields = ('proceso', 'mensaje', 'usuario__email')
    list_filter = ('flag', 'fecha')
    ordering = ('-fecha',)


@admin.register(RegistroAcceso)
class RegistroAccesoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'accion', 'fecha', 'ip')
    search_fields = ('usuario__email', 'accion', 'ip')
    list_filter = ('accion', 'fecha')
    ordering = ('-fecha',)


# -------------------------------------------------------------------
# ASPECTOS DE NEGOCIO + DISPONIBILIDAD INLINE
# -------------------------------------------------------------------

class DisponibilidadInline(admin.TabularInline):
    model = Disponibilidad
    extra = 1
    ordering = ('dia', 'hora_inicio')


@admin.register(AspectosNegocio)
class AspectosNegocioAdmin(admin.ModelAdmin):
    list_display = (
        'direccion', 'experiencia', 'permite_presencial',
        'permite_virtual', 'precio_presencial', 'precio_online', 'flag'
    )
    search_fields = ('direccion', 'experiencia')
    list_filter = ('permite_presencial', 'permite_virtual', 'flag')
    ordering = ('direccion',)
    inlines = [DisponibilidadInline]


@admin.register(Disponibilidad)
class DisponibilidadAdmin(admin.ModelAdmin):
    list_display = ('aspectos_negocio', 'dia', 'hora_inicio', 'hora_fin')
    search_fields = ('dia', 'aspectos_negocio__direccion')
    list_filter = ('dia',)
    ordering = ('aspectos_negocio', 'dia', 'hora_inicio')
