from django.shortcuts import render


def main_content_page(request):
    return render(request, 'general/main_page_citas.html')



def seleccion_tipo_usuario(request):
    return render(request, 'general/seleccion_tipo_usuario.html')
