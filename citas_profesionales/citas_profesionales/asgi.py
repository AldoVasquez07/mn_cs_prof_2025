import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'citas_profesionales.settings')

application = get_asgi_application()

app = application
