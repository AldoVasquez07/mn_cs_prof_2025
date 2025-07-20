from django.shortcuts import render


def login_cliente(request):
    return render(request, 'cliente/login_cliente.html')