# auditoria/signals.py
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.utils import timezone
from sistema.models import RegistroAcceso
from .utils import get_client_ip

@receiver(user_logged_in)
def registrar_login(sender, request, user, **kwargs):

    # Registrar login
    registro = RegistroAcceso.objects.create(
        usuario=user,
        accion="login",
        ip=get_client_ip(request),
        user_agent=request.META.get("HTTP_USER_AGENT", "")
    )

    # Guardar el ID del registro en la sesión para calcular duración luego
    request.session["registro_login_id"] = registro.id


@receiver(user_logged_out)
def registrar_logout(sender, request, user, **kwargs):
    if not user or not user.is_authenticated:
        return

    duracion = None
    registro_id = request.session.get("registro_login_id")

    # Si se tiene un login previo, calcular duración
    if registro_id:
        try:
            registro_login = RegistroAcceso.objects.get(id=registro_id)
            duracion = timezone.now() - registro_login.fecha
        except RegistroAcceso.DoesNotExist:
            pass

    # Registrar logout
    RegistroAcceso.objects.create(
        usuario=user,
        accion="logout",
        ip=get_client_ip(request),
        user_agent=request.META.get("HTTP_USER_AGENT", ""),
        duracion_sesion=duracion
    )
