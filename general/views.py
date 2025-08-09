from django.shortcuts import render


def main_content_page(request):
    return render(request, 'general/main_page_citas.html')


def seleccion_tipo_usuario(request):
    return render(request, 'general/seleccion_tipo_usuario.html')


def login_inicio_sesion(request):
    print('*'*50)
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        print(f"Email: {email}, Password: {password}")
    print('*'*50)
    
    return render(request, 'general/login/inicio_sesion/login_iniciar_sesion.html')


def login_registro_cliente(request):
    return render(request, 'general/login/registro/login_registrar_cliente.html')


def login_registro_profesional(request):
    return render(request, 'general/login/registro/login_registrar_profesional.html')


def login_registro_organizacion(request):
    return render(request, 'general/login/registro/login_registrar_organizacion.html')