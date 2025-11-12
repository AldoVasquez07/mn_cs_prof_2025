from django.shortcuts import render


def mis_citas_option(request):
    """Renderiza la vista de las citas de los clientes."""
    return render(request, 'cliente/mis_citas.html', {
        "choice": 1,
        "option_name": "Mis citas"
        })
    
def profesionales_option(request):
    """Renderiza la vista de búsqueda de profesionales."""
    return render(request, 'cliente/profesionales.html', {
        "choice": 2,
        "option_name": "Profesionales"
        })
    
def bandeja_mensaje_option(request):
    """Renderiza la vista de bandeja de mensaje."""
    return render(request, 'cliente/bandeja_mensaje.html', {
        "choice": 3,
        "option_name": "Bandeja de mensajes"
        })
