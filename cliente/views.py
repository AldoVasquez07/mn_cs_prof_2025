from django.shortcuts import render


def login_cliente(request):
    return render(request, 'cliente/login_cliente.html')


def mis_citas_option(request):
    """Renderiza la vista de las citas de los clientes."""
    return render(request, 'cliente/mis_citas.html', {
        "choice": 1
        })
    
def profesionales_option(request):
    """Renderiza la vista de búsqueda de profesionales."""
    return render(request, 'cliente/profesionales.html', {
        "choice": 2
        })
    
def bandeja_entrada_option(request):
    """Renderiza la vista de bandeja de mensaje."""
    return render(request, 'cliente/bandeja_mensaje.html', {
        "choice": 3
        })