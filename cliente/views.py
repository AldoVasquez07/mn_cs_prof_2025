from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from profesional.models import Cita, Profesional, Especialidad, ProfesionalCliente, Mensaje


@login_required(login_url='general:login_inicio_sesion')
def mis_citas_option(request):

    cliente = request.user.cliente

    filtro = request.GET.get("filtro", "todas")

    citas = Cita.objects.filter(relacion__cliente=cliente).select_related(
        "relacion__profesional__usuario",
        "relacion__profesional__especialidad"
    )

    # Filtros por estado
    if filtro == "proximas":
        citas = citas.filter(estado__in=["pendiente", "confirmada"])
    elif filtro == "completadas":
        citas = citas.filter(estado="completada")
    elif filtro == "canceladas":
        citas = citas.filter(estado="cancelada")

    return render(request, 'cliente/mis_citas.html', {
        "choice": 1,
        "option_name": "Mis citas",
        "citas": citas,
        "filtro": filtro
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

        nombre = f"{p.usuario.first_name} {p.usuario.apellido_paterno}"
        
        # Generar avatar: usar foto si existe, sino usar iniciales
        foto_url = None
        if hasattr(p.usuario, 'foto') and p.usuario.foto:
            try:
                foto_url = p.usuario.foto.url
            except (ValueError, AttributeError):
                foto_url = None
        
        # Si no hay foto, generar avatar con iniciales
        if not foto_url:
            # Extraer iniciales (primera letra de nombre y apellido)
            iniciales = ""
            if p.usuario.first_name:
                iniciales += p.usuario.first_name[0].upper()
            if p.usuario.apellido_paterno:
                iniciales += p.usuario.apellido_paterno[0].upper()
            
            # Si no hay iniciales, usar '?'
            if not iniciales:
                iniciales = "?"
            
            # Generar URL de avatar con iniciales
            # Reemplazar espacios con + para la URL
            nombre_url = nombre.replace(" ", "+")
            foto_url = f"https://ui-avatars.com/api/?name={nombre_url}&background=3b82f6&color=fff&size=200&bold=true"

        prof_dict = {
            "id": p.id,
            "nombre": nombre,
            "especialidad": p.especialidad.nombre if p.especialidad else "",
            "foto": foto_url,
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

    cliente = request.user.cliente

    # Obtener todas las relaciones que tienen mensajes
    relaciones = (
        ProfesionalCliente.objects
        .filter(cliente=cliente)
        .prefetch_related("mensajes", "profesional__usuario", "profesional__especialidad")
    )

    conversaciones = []

    for r in relaciones:

        ultimo_mensaje = r.mensajes.order_by('-fecha_envio').first()

        if ultimo_mensaje:
            conversaciones.append({
                "id": r.id,
                "profesional": r.profesional,
                "nombre": f"{r.profesional.usuario.first_name} {r.profesional.usuario.apellido_paterno}",
                "especialidad": r.profesional.especialidad.nombre if r.profesional.especialidad else "Sin especialidad",
                "ultimo_mensaje": ultimo_mensaje.contenido[:120] + ("..." if len(ultimo_mensaje.contenido) > 120 else ""),
                "fecha": ultimo_mensaje.fecha_envio,
                "unread": ultimo_mensaje.emisor == "profesional",   # Ejemplo simple: si lo envió el profesional y no es cliente
            })

    return render(request, 'cliente/bandeja_mensaje.html', {
        "choice": 3,
        "option_name": "Bandeja de mensajes",
        "conversaciones": conversaciones,
        "profesionales": [r.profesional for r in relaciones]  # para el select del modal
    })
