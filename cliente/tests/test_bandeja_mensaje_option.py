from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from cliente.models import Cliente
from profesional.models import Profesional, ProfesionalCliente, Mensaje, Especialidad
from django.utils import timezone

User = get_user_model()


class BandejaMensajeOptionTest(TestCase):

    def setUp(self):
        self.client = Client()

        self.user = User.objects.create_user(username="cli", password="123456")
        self.cliente = Cliente.objects.create(usuario=self.user)

        self.user_pro = User.objects.create_user(username="pro", password="123456")
        self.especialidad = Especialidad.objects.create(nombre="Psicología")
        self.pro = Profesional.objects.create(
            usuario=self.user_pro,
            especialidad=self.especialidad,
            flag=True
        )

        self.rel = ProfesionalCliente.objects.create(
            cliente=self.cliente,
            profesional=self.pro
        )

        self.msg = Mensaje.objects.create(
            relacion=self.rel,
            contenido="Hola cliente",
            fecha_envio=timezone.now(),
            emisor="profesional"
        )

        self.url = reverse("cliente:bandeja_mensaje_option")

    def test_bandeja_mensajes(self):
        self.client.login(username="cli", password="123456")

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "cliente/bandeja_mensaje.html")
        self.assertContains(response, "Bandeja de mensajes")
        self.assertIn("conversaciones", response.context)
        self.assertEqual(len(response.context["conversaciones"]), 1)
