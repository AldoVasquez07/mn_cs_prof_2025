from django.shortcuts import render


def main_content_page(request):
    return render(request, 'general/main_page_citas.html')
