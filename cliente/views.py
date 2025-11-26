from django.contrib.auth.decorators import login_required
from django.db.models import Q
from profesional.models import Cita, Profesional, Especialidad, ProfesionalCliente, Mensaje
from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils import timezone
from datetime import datetime, timedelta
from cliente.models import Cliente


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
    """Vista principal para mostrar profesionales, sus horarios y agendar citas"""
    
    # MANEJAR POST - Agendar cita
    if request.method == 'POST':
        print("=" * 50)
        print("DEBUG: POST recibido")
        print("POST data*:", request.POST)
        print("=" * 50)
        
        try:
            # Obtener el cliente
            try:
                cliente = Cliente.objects.get(usuario=request.user)
                print(f"✅ Cliente encontrado: {cliente}")
            except Cliente.DoesNotExist:
                print("❌ Cliente no existe")
                messages.error(request, 'No se encontró el perfil de cliente')
                return redirect('cliente:profesionales_option')
            
            # Obtener datos del formulario
            profesional_id = request.POST.get('profesional_id')
            fecha = request.POST.get('fecha')
            hora = request.POST.get('hora')
            tipo_consulta = request.POST.get('tipo_consulta')
            motivo = request.POST.get('motivo', '')
            
            print(f"Datos recibidos:")
            print(f"  - Profesional ID: {profesional_id}")
            print(f"  - Fecha: {fecha}")
            print(f"  - Hora: {hora}")
            print(f"  - Tipo: {tipo_consulta}")
            print(f"  - Motivo: {motivo}")
            
            # Validaciones
            if not all([profesional_id, fecha, hora, tipo_consulta]):
                print("❌ Faltan datos requeridos")
                messages.error(request, 'Por favor completa todos los campos requeridos')
                return redirect('cliente:profesionales_option')
            
            # Obtener profesional
            try:
                profesional = Profesional.objects.get(id=profesional_id, flag=True)
                print(f"✅ Profesional encontrado: {profesional}")
            except Profesional.DoesNotExist:
                print("❌ Profesional no encontrado")
                messages.error(request, 'Profesional no encontrado')
                return redirect('cliente:profesionales_option')
            
            # Validar aspectos de negocio
            if not profesional.aspectos_negocio:
                print("❌ Profesional sin aspectos de negocio")
                messages.error(request, 'El profesional no tiene configuración de horarios')
                return redirect('cliente:profesionales_option')
            
            # Validar tipo de consulta
            if tipo_consulta == 'presencial' and not profesional.aspectos_negocio.permite_presencial:
                print("❌ No permite presencial")
                messages.error(request, 'El profesional no permite consultas presenciales')
                return redirect('cliente:profesionales_option')
            
            if tipo_consulta == 'online' and not profesional.aspectos_negocio.permite_virtual:
                print("❌ No permite online")
                messages.error(request, 'El profesional no permite consultas virtuales')
                return redirect('cliente:profesionales_option')
            
            # Combinar fecha y hora
            fecha_hora_str = f"{fecha} {hora}"
            print(f"Parseando fecha y hora: {fecha_hora_str}")
            fecha_hora = datetime.strptime(fecha_hora_str, '%Y-%m-%d %H:%M')
            fecha_hora = timezone.make_aware(fecha_hora)
            print(f"✅ Fecha y hora parseada: {fecha_hora}")
            
            # Verificar que la fecha sea futura
            if fecha_hora <= timezone.now():
                print(f"❌ Fecha no es futura. Ahora: {timezone.now()}, Seleccionada: {fecha_hora}")
                messages.error(request, 'La fecha y hora deben ser futuras')
                return redirect('cliente:profesionales_option')
            
            # Crear o obtener relación profesional-cliente
            relacion, created = ProfesionalCliente.objects.get_or_create(
                profesional=profesional,
                cliente=cliente,
                defaults={'estado': 'activo'}
            )
            print(f"✅ Relación: {'creada' if created else 'existente'} - ID: {relacion.id}")
            
            # Verificar que no haya conflicto de horario
            conflicto = Cita.objects.filter(
                relacion__profesional=profesional,
                fecha=fecha_hora,
                estado__in=['pendiente', 'confirmada']
            ).exists()
            
            if conflicto:
                print("❌ Conflicto de horario encontrado")
                messages.error(request, 'Este horario ya no está disponible')
                return redirect('cliente:profesionales_option')
            
            print("✅ No hay conflictos, creando cita...")
            
            # Crear la cita
            cita = Cita.objects.create(
                relacion=relacion,
                fecha=fecha_hora,
                estado='pendiente',
                motivo=motivo
            )
            
            print(f"✅✅✅ CITA CREADA EXITOSAMENTE - ID: {cita.id}")
            print(f"  - Relación: {cita.relacion}")
            print(f"  - Fecha: {cita.fecha}")
            print(f"  - Estado: {cita.estado}")
            print(f"  - Motivo: {cita.motivo}")
            
            nombre_prof = f"{profesional.usuario.first_name} {profesional.usuario.apellido_paterno}"
            messages.success(request, f'¡Cita agendada exitosamente con {nombre_prof}!')
            return redirect('cliente:profesionales_option')
            
        except Exception as e:
            print(f"❌❌❌ ERROR CRÍTICO: {str(e)}")
            import traceback
            print(traceback.format_exc())
            messages.error(request, f'Error al agendar la cita: {str(e)}')
            return redirect('cliente:profesionales_option')
    
    # MANEJAR GET - Mostrar profesionales
    buscar = request.GET.get("search", "").strip()
    especialidad_id = request.GET.get("especialidad", "")
    tipo = request.GET.get("tipo", "")
    rating_filter = request.GET.get("rating", "")

    profesionales = Profesional.objects.filter(flag=True) \
        .select_related("usuario", "especialidad", "organizacion", "aspectos_negocio") \
        .prefetch_related("aspectos_negocio__disponibilidades")

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
            iniciales = ""
            if p.usuario.first_name:
                iniciales += p.usuario.first_name[0].upper()
            if p.usuario.apellido_paterno:
                iniciales += p.usuario.apellido_paterno[0].upper()
            
            if not iniciales:
                iniciales = "?"
            
            nombre_url = nombre.replace(" ", "+")
            foto_url = f"https://ui-avatars.com/api/?name={nombre_url}&background=3b82f6&color=fff&size=200&bold=true"

        # Generar slots disponibles
        disponibilidades_futuras = generar_slots_disponibles(p, dias=14)

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
            "disponibilidad_preview": disponibilidades_futuras[:3],  # Primeros 3 para card
            "disponibilidad_completa": disponibilidades_futuras,  # Todos para el modal
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


def generar_slots_disponibles(profesional, dias=14):
    """
    Genera slots de horarios disponibles para un profesional
    basándose en sus disponibilidades configuradas
    """
    if not profesional.aspectos_negocio:
        return []
    
    # Obtener disponibilidades del profesional
    disponibilidades = profesional.aspectos_negocio.disponibilidades.all()
    
    if not disponibilidades:
        return []
    
    # Mapa de días en español a números (0=lunes, 6=domingo)
    dias_semana = {
        'lunes': 0,
        'martes': 1,
        'miércoles': 2,
        'jueves': 3,
        'viernes': 4,
        'sábado': 5,
        'domingo': 6
    }
    
    slots = []
    hoy = timezone.now().date()
    
    # Obtener citas ya agendadas
    citas_agendadas = Cita.objects.filter(
        relacion__profesional=profesional,
        fecha__gte=timezone.now(),
        estado__in=['pendiente', 'confirmada']
    ).values_list('fecha', flat=True)
    
    fechas_ocupadas = set(citas_agendadas)
    
    # Generar slots para los próximos N días
    for i in range(dias):
        fecha = hoy + timedelta(days=i)
        dia_semana_num = fecha.weekday()  # 0=lunes, 6=domingo
        
        # Buscar disponibilidad para este día
        for disp in disponibilidades:
            dia_disp = dias_semana.get(disp.dia.lower())
            
            if dia_disp is None or dia_disp != dia_semana_num:
                continue
            
            # Generar slots de 1 hora dentro del rango
            hora_actual = disp.hora_inicio
            hora_fin = disp.hora_fin
            
            while hora_actual < hora_fin:
                # Combinar fecha y hora
                fecha_hora = timezone.make_aware(
                    datetime.combine(fecha, hora_actual)
                )
                
                # Verificar que no esté ocupado y que sea futuro
                if fecha_hora > timezone.now() and fecha_hora not in fechas_ocupadas:
                    slots.append({
                        'fecha': fecha.strftime('%Y-%m-%d'),
                        'fecha_display': fecha.strftime('%d %b'),
                        'hora': hora_actual.strftime('%H:%M'),
                        'hora_display': hora_actual.strftime('%I:%M %p'),
                        'dia': disp.dia.capitalize(),
                    })
                
                # Incrementar 1 hora
                hora_siguiente = (datetime.combine(fecha, hora_actual) + timedelta(hours=1)).time()
                
                # Asegurar que no pasemos la hora de cierre
                if hora_siguiente >= hora_fin:
                    break
                    
                hora_actual = hora_siguiente
    
    return slots


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
                "unread": ultimo_mensaje.emisor == "profesional",
            })

    return render(request, 'cliente/bandeja_mensaje.html', {
        "choice": 3,
        "option_name": "Bandeja de mensajes",
        "conversaciones": conversaciones,
        "profesionales": [r.profesional for r in relaciones]
    })
