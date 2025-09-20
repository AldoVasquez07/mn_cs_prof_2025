from django.shortcuts import render


def login_profesional(request):
    return render(request, 'profesional/login_profesional.html')

def home_profesional(request):
    return render(request, 'profesional/home_profesional.html')