from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from cliente.models import Cliente
from profesional.models import Cita, Profesional, ProfesionalCliente, Especialidad
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class MisCitasOptionViewTest(TestCase):

    def setUp(self):
        self.client = Client()

        # Crear usuario + cliente
        self.user = User.objects.create_user(
            username="cliente1",
            password="123456",
            first_name="Juan",
            apellido_paterno="Ramírez"
        )
        self.cliente = Cliente.objects.create(usuario=self.user)

        # Profesional
        self.prof_user = User.objects.create_user(
            username="pro1",
            password="123456"
        )
        self.especialidad = Especialidad.objects.create(nombre="Psicología")
        self.pro = Profesional.objects.create(
            usuario=self.prof_user,
            especialidad=self.especialidad,
            flag=True
        )

        # Relación
        self.relacion = ProfesionalCliente.objects.create(
            profesional=self.pro,
            cliente=self.cliente
        )

        # Crear citas
        self.cita1 = Cita.objects.create(
            relacion=self.relacion,
            fecha=timezone.now() + timedelta(days=1),
            estado="pendiente"
        )

        self.url = reverse("cliente:mis_citas_option")

    def test_acceso_sin_login(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 302)
        self.assertIn("/login", response.url)

    def test_mostrar_citas(self):
        self.client.login(username="cliente1", password="123456")

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "cliente/mis_citas.html")
        self.assertContains(response, "Mis citas")
        self.assertIn("citas", response.context)

    def test_filtrar_proximas(self):
        self.client.login(username="cliente1", password="123456")

        response = self.client.get(self.url, {"filtro": "proximas"})
        citas = response.context["citas"]

        self.assertEqual(len(citas), 1)
        self.assertEqual(citas[0].estado, "pendiente")
