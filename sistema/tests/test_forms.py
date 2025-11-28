from django.test import TestCase
from django.core.exceptions import ValidationError
from datetime import date, time

from sistema.forms import RegistrarUsuarioForm, RegistrarAspectosNegocioForm
from sistema.models import Usuario, AspectosNegocio


class RegistrarUsuarioFormTest(TestCase):

    def setUp(self):
        # Usuario existente para probar unicidad
        self.user = Usuario.objects.create_user(
            username="existente",
            email="ya_existe@test.com",
            password="12345678",
            documento_identidad="99999999"
        )

        self.valid_data = {
            "first_name": "Aldo",
            "apellido_paterno": "Vasquez",
            "apellido_materno": "Lopez",
            "email": "nuevo@test.com",
            "password": "123456",
            "confirmar_contrasena": "123456",
            "fecha_nacimiento": "2000-01-01",
            "documento_identidad": "12345678",
            "telefono": "987654321"
        }

    def test_form_valido(self):
        form = RegistrarUsuarioForm(data=self.valid_data)
        self.assertTrue(form.is_valid())

    def test_contrasenas_diferentes(self):
        data = self.valid_data.copy()
        data["confirmar_contrasena"] = "diferente"

        form = RegistrarUsuarioForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn("Las contraseñas no coinciden", str(form.errors))

    def test_correo_duplicado(self):
        data = self.valid_data.copy()
        data["email"] = "ya_existe@test.com"  # correo ya usado

        form = RegistrarUsuarioForm(data=data)
        self.assertFalse(form.is_valid())

    def test_documento_identidad_duplicado(self):
        data = self.valid_data.copy()
        data["documento_identidad"] = "99999999"

        form = RegistrarUsuarioForm(data=data)
        self.assertFalse(form.is_valid())

    def test_creacion_usuario_con_username_autogenerado(self):
        form = RegistrarUsuarioForm(data=self.valid_data)
        self.assertTrue(form.is_valid())
        user = form.save(commit=False)
        user.set_password(form.cleaned_data["password"])
        user.save()

        self.assertEqual(user.username, user.email)


class RegistrarAspectosNegocioFormTest(TestCase):

    def setUp(self):
        self.valid_data = {
            "direccion": "Av. Siempre Viva 742",
            "hora_apertura": "08:00",
            "hora_cierre": "18:00"
        }

    def test_form_valido(self):
        form = RegistrarAspectosNegocioForm(data=self.valid_data)
        self.assertTrue(form.is_valid())

    def test_faltan_campos_requeridos(self):
        data = self.valid_data.copy()
        data["direccion"] = ""

        form = RegistrarAspectosNegocioForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn("direccion", form.errors)
