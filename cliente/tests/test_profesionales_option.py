from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta, time, datetime
from cliente.models import Cliente
from profesional.models import (
    Profesional, Especialidad, ProfesionalCliente,
    Cita
)
from sistema.models import AspectosNegocio

User = get_user_model()


class ProfesionalesOptionViewTest(TestCase):

    def setUp(self):
        self.client = Client()

        # Usuario cliente
        self.user = User.objects.create_user(
            username="cli",
            password="123456",
            first_name="Mario",
            apellido_paterno="López"
        )
        self.cliente = Cliente.objects.create(usuario=self.user)

        # Profesional
        self.user_pro = User.objects.create_user(
            username="pro",
            password="123456",
            first_name="Ana",
            apellido_paterno="Pérez"
        )
        self.especialidad = Especialidad.objects.create(nombre="Psicología")

        self.pro = Profesional.objects.create(
            usuario=self.user_pro,
            especialidad=self.especialidad,
            flag=True
        )

        # Aspectos de negocio
        self.aspectos = AspectosNegocio.objects.create(
            profesional=self.pro,
            permite_presencial=True,
            permite_virtual=True,
            hora_apertura=time(8, 0),
            hora_cierre=time(17, 0),
            precio_presencial=100,
            precio_online=80
        )

        self.url = reverse("cliente:profesionales_option")

    # ---------------------------
    # TEST GET
    # ---------------------------
    def test_get_profesionales_lista(self):
        self.client.login(username="cli", password="123456")

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "cliente/profesionales.html")
        self.assertIn("profesionales", response.context)

    # ---------------------------
    # TEST POST — Crear cita
    # ---------------------------
    def test_post_crear_cita_correcta(self):
        self.client.login(username="cli", password="123456")

        fecha = (timezone.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        hora = "10:00"

        response = self.client.post(self.url, {
            "profesional_id": self.pro.id,
            "fecha": fecha,
            "hora": hora,
            "tipo_consulta": "presencial",
            "motivo": "Consulta general"
        })

        self.assertEqual(response.status_code, 302)

        cita = Cita.objects.first()
        self.assertIsNotNone(cita)
        self.assertEqual(cita.relacion.cliente, self.cliente)

    # ---------------------------
    # TEST POST — Error por fecha pasada
    # ---------------------------
    def test_post_fecha_pasada(self):
        self.client.login(username="cli", password="123456")

        fecha = (timezone.now() - timedelta(days=1)).strftime("%Y-%m-%d")

        response = self.client.post(self.url, {
            "profesional_id": self.pro.id,
            "fecha": fecha,
            "hora": "10:00",
            "tipo_consulta": "online"
        })

        self.assertEqual(response.status_code, 302)
        self.assertEqual(Cita.objects.count(), 0)
