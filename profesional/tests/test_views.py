from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from profesional.models import Profesional, ProfesionalCliente, Mensaje, Cita
from sistema.models import AspectosNegocio

User = get_user_model()


class ProfesionalViewsTest(TestCase):

    def setUp(self):
        self.client = Client()

        # Usuario profesional
        self.user = User.objects.create_user(
            username="pro1",
            password="123456",
            first_name="Juan",
            last_name="Pérez"
        )

        self.profesional = Profesional.objects.create(usuario=self.user)

        # Crear cliente relacionado
        cliente_user = User.objects.create_user(
            username="cli1",
            password="123456",
            first_name="Carlos",
            last_name="Gómez"
        )

        # Aspectos de negocio
        aspectos = AspectosNegocio.objects.create()

        self.profesional.aspectos_negocio = aspectos
        self.profesional.save()

        self.relacion = ProfesionalCliente.objects.create(
            profesional=self.profesional,
            cliente_id=1,  # Ajusta según tu modelo
            estado="activo"
        )

    # ---------------------------------------------------------
    # TEST 1: campanias_puntuales_option (GET)
    # ---------------------------------------------------------
    def test_campanias_puntuales_get(self):
        self.client.login(username="pro1", password="123456")

        url = reverse("profesional:campanias_puntuales_option")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "profesional/campanias_puntuales.html")
        self.assertIn("clientes", response.context)

    # ---------------------------------------------------------
    # TEST 2: campanias_puntuales_option (POST)
    # ---------------------------------------------------------
    def test_campanias_puntuales_post_envia_mensaje(self):
        self.client.login(username="pro1", password="123456")

        url = reverse("profesional:campanias_puntuales_option")

        response = self.client.post(url, {
            "mensaje": "Hola cliente",
            "clientes[]": [self.relacion.id]
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Mensaje.objects.count(), 1)

    # ---------------------------------------------------------
    # TEST 3: clientes_option (GET)
    # ---------------------------------------------------------
    def test_clientes_option(self):
        self.client.login(username="pro1", password="123456")

        url = reverse("profesional:clientes_option")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "profesional/clientes.html")
        self.assertIn("clientes", response.context)

    # ---------------------------------------------------------
    # TEST 4: bandeja_mensaje_option (GET)
    # ---------------------------------------------------------
    def test_bandeja_mensaje_option(self):
        self.client.login(username="pro1", password="123456")

        # Crear mensajes
        Mensaje.objects.create(
            relacion=self.relacion,
            emisor="cliente",
            contenido="Hola"
        )

        url = reverse("profesional:bandeja_mensaje_option")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "profesional/bandeja_entrada.html")
        self.assertIn("mensajes_no_gestionados", response.context)
        self.assertEqual(len(response.context["mensajes_no_gestionados"]), 1)

    # ---------------------------------------------------------
    # TEST 5: mis_citas_option (GET)
    # ---------------------------------------------------------
    def test_mis_citas_option(self):
        self.client.login(username="pro1", password="123456")

        url = reverse("profesional:mis_citas_option")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "profesional/mis_citas.html")
