from django.shortcuts import render, redirect
from sistema.models import Ciudad, Usuario, Rol, AspectosNegocio
from cliente.models import Cliente
from profesional.models import Profesion, Especialidad, Profesional
from sistema.forms import RegistrarUsuarioForm, RegistrarAspectosNegocioForm
import json
from django.forms.utils import ErrorDict


def main_content_page(request):
    return render(request, 'general/main_page_citas.html')


def seleccion_tipo_usuario(request):
    return render(request, 'general/seleccion_tipo_usuario.html')


def login_inicio_sesion(request):
    mensaje = None
    menu = {
        'cliente': 'general:login_registro_cliente',
        'profesional': 'profesional:home_profesional',
        'organizacion': 'general:login_registro_organizacion'
    }
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        usuario = Usuario.objects.filter(email=email, password=password).first()
        print("ACCEDI")
        if usuario:
            for m in menu:
                if usuario.rol.nombre == m:
                    return redirect(menu[m])
        else:
            mensaje = "El usuario no existe o la contraseña es incorrecta."

    return render(request, 'general/login/inicio_sesion/login_iniciar_sesion.html',
                  {'mensaje':mensaje})


def login_registro_cliente(request):
    ciudades = Ciudad.objects.filter(flag=True).order_by('nombre')
    mensaje = None
    
    if request.method == 'POST':
        contrasena_cliente = request.POST.get('contrasena_cliente')
        confirmar_contrasena_cliente = request.POST.get('confirmar_contrasena_cliente')
        
        if contrasena_cliente != confirmar_contrasena_cliente:
            return render(request, 'general/login/registro/login_registrar_cliente.html',
                          {'ciudades': ciudades, 'mensaje': 'Las contraseñas no coinciden.'})
        
        nuevo_usuario = Usuario(
            first_name=request.POST.get('nombre_cliente'),
            email=request.POST.get('correo_cliente'),
            password=contrasena_cliente,
            apellido_paterno=request.POST.get('apellido_paterno_cliente'),
            apellido_materno=request.POST.get('apellido_materno_cliente'),
            fecha_nacimiento=request.POST.get('fecha_nacimiento_cliente'),
            documento_identidad=request.POST.get('documento_identidad_cliente'),
            telefono=request.POST.get('telefono_cliente'),
            ciudad=Ciudad.objects.filter(id=request.POST.get('ciudad_cliente')).first(),
            rol=Rol.objects.filter(nombre='cliente').first()
        )
        
        try:
            nuevo_usuario.clean()
            nuevo_usuario.save()
            
            nuevo_cliente = Cliente(usuario=nuevo_usuario)
            nuevo_cliente.save()
            
            return redirect('general:login_inicio_sesion')
        except Exception as e:
            return render(request, 'general/login/registro/login_registrar_cliente.html',
                          {'ciudades': ciudades, 'mensaje': str(e)})

    return render(request,'general/login/registro/login_registrar_cliente.html',
                  {'ciudades': ciudades, 'mensaje': mensaje})


def login_registro_profesional(request):
    # Objetos de Ciudad para el combo-box
    ciudades = Ciudad.objects.filter(flag=True).order_by('nombre')
    # Objetos de Profesion para el combo-box
    profesiones = Profesion.objects.filter(flag=True).order_by('nombre')
    mensaje = None
    
    # Integrando especialidades en formato json en las profesiones
    for profesion in profesiones:
        profesion.especialidades_json = json.dumps(
            list(profesion.especialidades.values('id', 'nombre'))
        )
    
    if request.method == 'POST':
        form_user = RegistrarUsuarioForm(request.POST)
        form_aspectos_negocio = RegistrarAspectosNegocioForm(request.POST)
        
        if form_user.is_valid() and form_aspectos_negocio.is_valid():
            # Creando instancia de Usuario para registrar al cliente
            nuevo_usuario = form_user.save(commit=False)
            nuevo_usuario.set_password(form_user.cleaned_data['password'])
            nuevo_usuario.rol = Rol.objects.get(nombre='profesional')
            nuevo_usuario.ciudad = Ciudad.objects.get(id=request.POST.get('ciudad_profesional'))
            
            nuevos_aspectos_negocio = form_aspectos_negocio.save(commit=False)

            try:
                nuevo_usuario.clean()
                nuevo_usuario.save()
                
                nuevos_aspectos_negocio.clean()
                nuevos_aspectos_negocio.save()
                
                nuevo_profesional = Profesional(
                    usuario=nuevo_usuario,
                    especialidad=Especialidad.objects.filter(id=request.POST.get('especialidad_profesional')).first(),
                    aspectos_negocio=nuevos_aspectos_negocio
                )
                
                nuevo_profesional.save()
            except (Exception, ValueError, ValidationError) as ex:
                return render(request, 'general/login/registro/login_registrar_profesional.html', {
                    'ciudades': ciudades,
                    'profesiones': profesiones,
                    'mensaje': str(ex),
                    'form_user': form_user,
                    'form_aspectos_negocio': form_aspectos_negocio
                })
        
            return redirect('general:login_inicio_sesion')

        else:
            mensaje = ErrorDict()
            mensaje.update(form_user.errors)
            mensaje.update(form_aspectos_negocio.errors)

    else:
        form_user = RegistrarUsuarioForm()
        form_aspectos_negocio = RegistrarAspectosNegocioForm()
        mensaje = None
    
    return render(request, 'general/login/registro/login_registrar_profesional.html', {
        'ciudades': ciudades,
        'profesiones': profesiones,
        'mensaje': mensaje,
        'form_user': form_user,
        'form_aspectos_negocio': form_aspectos_negocio
    })


def login_registro_organizacion(request):
    return render(request, 'general/login/registro/login_registrar_organizacion.html')