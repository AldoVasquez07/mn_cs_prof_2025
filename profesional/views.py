from django.shortcuts import render


def campanias_puntuales_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 1})

def clientes_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 2})

def bandeja_entrada_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 3})

def productividad_ingresos_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 4})

def horarios_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 5})

def planes_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 6})

def ajustes_option(request):
    return render(request, 'profesional/campanias_puntuales.html', {"choice": 7})