from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario",
        "fecha_registro",
        "created_by",
        "created_date",
        "modified_by",
        "modified_date",
        "flag",
    )
    
    list_filter = ("flag", "fecha_registro", "created_date", "modified_date")
    
    search_fields = (
        "usuario__username",
        "usuario__first_name",
        "usuario__apellido_paterno",
        "usuario__apellido_materno",
        "usuario__email",
    )

    readonly_fields = (
        "fecha_registro",
        "created_date",
        "modified_date",
    )

    fieldsets = (
        ("Información del Cliente", {
            "fields": ("usuario", "flag"),
        }),
        ("Auditoría", {
            "fields": (
                "created_by", "created_date",
                "modified_by", "modified_date",
            )
        }),
    )
