from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from profesional.models import Profesional


@login_required(login_url='general:login_inicio_sesion')
def mis_citas_option(request):
    """Renderiza la vista de las citas de los clientes."""
    return render(request, 'cliente/mis_citas.html', {
        "choice": 1,
        "option_name": "Mis citas"
        })


@login_required(login_url='general:login_inicio_sesion')
def profesionales_option(request):
    """Renderiza la vista de búsqueda de profesionales."""

    profesionales = Profesional.objects.filter(flag=True).select_related(
        "usuario", "especialidad", "organizacion", "aspectos_negocio"
    )

    # PREPARAR DATA PARA LA PLANTILLA
    profesionales_data = []

    for p in profesionales:
        profesion_nombre = p.especialidad.profesion.nombre if p.especialidad and p.especialidad.profesion else "No definido"

        # Calificación promedio del profesional (promedio de citas completadas)
        citas = p.relaciones_cliente.all().values_list(
            "citas__calificacion_profesional", flat=True
        )
        calificaciones = [c for c in citas if c is not None]
        rating = round(sum(calificaciones) / len(calificaciones), 1) if calificaciones else 0

        profesionales_data.append({
            "id": p.id,
            "nombre": f"{p.usuario.first_name} {p.usuario.apellido_paterno}",
            "especialidad": p.especialidad.nombre if p.especialidad else "No especificado",
            "profesion": profesion_nombre,
            "foto": p.usuario.foto.url if getattr(p.usuario, "foto", None) else None,
            "organizacion": p.organizacion.nombre if p.organizacion else "Independiente",
            "direccion": p.organizacion.direccion if p.organizacion and hasattr(p.organizacion, "direccion") else "Sin dirección",
            "rating": rating,
            "rating_int": int(rating),
            "opciones": {
                "presencial": p.aspectos_negocio.permite_presencial if p.aspectos_negocio else False,
                "online": p.aspectos_negocio.permite_virtual if p.aspectos_negocio else False,
                "precio_presencial": p.aspectos_negocio.precio_presencial if p.aspectos_negocio else None,
                "precio_online": p.aspectos_negocio.precio_online if p.aspectos_negocio else None,
            },
            "disponibilidad": p.aspectos_negocio.disponibilidades.all() if p.aspectos_negocio else [],
        })

    return render(request, 'cliente/profesionales.html', {
        "choice": 2,
        "option_name": "Profesionales",
        "profesionales": profesionales_data,
    })



@login_required(login_url='general:login_inicio_sesion')
def bandeja_mensaje_option(request):
    """Renderiza la vista de bandeja de mensaje."""
    return render(request, 'cliente/bandeja_mensaje.html', {
        "choice": 3,
        "option_name": "Bandeja de mensajes"
        })
