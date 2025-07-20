from django.shortcuts import render


def login_profesional(request):
    return render(request, 'profesional/login_profesional.html')