from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from profesional.models import Profesional, Especialidad

@login_required(login_url='general:login_inicio_sesion')
def mis_citas_option(request):
    """Renderiza la vista de las citas de los clientes."""
    return render(request, 'cliente/mis_citas.html', {
        "choice": 1,
        "option_name": "Mis citas"
        })


@login_required(login_url='general:login_inicio_sesion')
def profesionales_option(request):

    buscar = request.GET.get("search", "").strip()
    especialidad_id = request.GET.get("especialidad", "")
    tipo = request.GET.get("tipo", "")
    rating_filter = request.GET.get("rating", "")

    profesionales = Profesional.objects.filter(flag=True) \
        .select_related("usuario", "especialidad", "organizacion", "aspectos_negocio")

    # FILTRO: Búsqueda
    if buscar:
        profesionales = profesionales.filter(
            Q(usuario__first_name__icontains=buscar) |
            Q(usuario__apellido_paterno__icontains=buscar) |
            Q(especialidad__nombre__icontains=buscar) |
            Q(especialidad__profesion__nombre__icontains=buscar) |
            Q(organizacion__nombre__icontains=buscar)
        ).distinct()

    # FILTRO: Especialidad
    if especialidad_id:
        profesionales = profesionales.filter(especialidad__id=especialidad_id)

    # FILTRO: Tipo consulta
    if tipo == "presencial":
        profesionales = profesionales.filter(aspectos_negocio__permite_presencial=True)
    elif tipo == "online":
        profesionales = profesionales.filter(aspectos_negocio__permite_virtual=True)

    # Para calcular rating luego y filtrar por mínimo
    profesionales_data = []
    for p in profesionales:
        citas = p.relaciones_cliente.all().values_list("citas__calificacion_profesional", flat=True)
        calificaciones = [c for c in citas if c is not None]
        rating = round(sum(calificaciones) / len(calificaciones), 1) if calificaciones else 0

        prof_dict = {
            "id": p.id,
            "nombre": f"{p.usuario.first_name} {p.usuario.apellido_paterno}",
            "especialidad": p.especialidad.nombre if p.especialidad else "",
            "foto": p.usuario.foto.url if getattr(p.usuario, "foto", None) else None,
            "direccion": p.organizacion.direccion if p.organizacion else "",
            "rating": rating,
            "rating_int": int(rating),
            "opciones": {
                "presencial": p.aspectos_negocio.permite_presencial if p.aspectos_negocio else False,
                "online": p.aspectos_negocio.permite_virtual if p.aspectos_negocio else False,
                "precio_presencial": p.aspectos_negocio.precio_presencial if p.aspectos_negocio else None,
                "precio_online": p.aspectos_negocio.precio_online if p.aspectos_negocio else None,
            },
            "disponibilidad": [],
        }

        # FILTRO: rating mínimo
        if rating_filter and rating < int(rating_filter):
            continue

        profesionales_data.append(prof_dict)

    # Especialidades dinámicas
    especialidades = Especialidad.objects.filter(flag=True)

    return render(request, "cliente/profesionales.html", {
        "choice": 2,
        "option_name": "Profesionales",
        "profesionales": profesionales_data,
        "especialidades": especialidades,
        "search_value": buscar,
        "especialidad_id": especialidad_id,
        "tipo": tipo,
        "rating_filter": rating_filter,
    })



@login_required(login_url='general:login_inicio_sesion')
def bandeja_mensaje_option(request):
    """Renderiza la vista de bandeja de mensaje."""
    return render(request, 'cliente/bandeja_mensaje.html', {
        "choice": 3,
        "option_name": "Bandeja de mensajes"
        })
