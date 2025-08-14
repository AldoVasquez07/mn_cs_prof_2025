from django.shortcuts import render, redirect
from sistema.models import Ciudad, Usuario, Rol, Profesion, Especialidad
from cliente.models import Cliente
from profesional.models import Profesional
import json


def main_content_page(request):
    return render(request, 'general/main_page_citas.html')


def seleccion_tipo_usuario(request):
    return render(request, 'general/seleccion_tipo_usuario.html')


def login_inicio_sesion(request):
    mensaje = None
    menu = {
        'cliente': 'general:login_registro_cliente',
        'profesional': 'general:login_registro_profesional',
        'organizacion': 'general:login_registro_organizacion'
    }
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        usuario = Usuario.objects.filter(email=email, password=password).first()
        
        if usuario:
            for m in menu:
                if usuario.rol.nombre == m:
                    print(f"Redirigiendo a {menu[m]}")
                    # return redirect(menu[m])
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
    ciudades = Ciudad.objects.filter(flag=True).order_by('nombre')
    profesiones = Profesion.objects.filter(flag=True).order_by('nombre')
    mensaje = None
    
    for profesion in profesiones:
        profesion.especialidades_json = json.dumps(
            list(profesion.especialidades.values_list('nombre', flat=True))
        )
        
    
    if request.method == 'POST':
        contrasena_profesional = request.POST.get('contrasena_profesional')
        confirmar_contrasena_profesional = request.POST.get('confirmar_contrasena_profesional')
        
        if contrasena_profesional != confirmar_contrasena_profesional:
            return render(request, 'general/login/registro/login_registrar_profesional.html',
                          {'ciudades': ciudades, 'mensaje': 'Las contraseñas no coinciden.'})
        
        nuevo_usuario = Usuario(
            first_name=request.POST.get('nombre_profesional'),
            email=request.POST.get('correo_profesional'),
            password=contrasena_profesional,
            apellido_paterno=request.POST.get('apellido_paterno_profesional'),
            apellido_materno=request.POST.get('apellido_materno_profesional'),
            fecha_nacimiento=request.POST.get('fecha_nacimiento_profesional'),
            documento_identidad=request.POST.get('documento_identidad_profesional'),
            telefono=request.POST.get('telefono_profesional'),
            ciudad=Ciudad.objects.filter(id=request.POST.get('ciudad_profesional')).first(),
            rol=Rol.objects.filter(nombre='cliente').first()
        )
        
        try:
            # nuevo_usuario.clean()
            # nuevo_usuario.save()
            
            print("GUARDAR PROFESIONAL")
                        
            return redirect('general:login_inicio_sesion')
        except Exception as e:
            return render(request, 'general/login/registro/login_registrar_profesional.html',
                          {'ciudades': ciudades, 'mensaje': str(e)})

    return render(request,'general/login/registro/login_registrar_profesional.html',
                  {'ciudades': ciudades, 'profesiones': profesiones, 'mensaje': mensaje})


def login_registro_organizacion(request):
    return render(request, 'general/login/registro/login_registrar_organizacion.html')