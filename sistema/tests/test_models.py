from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date, time

from sistema.models import (
    Pais, Ciudad, Rol, Usuario,
    LogProcesos, AspectosNegocio, Disponibilidad
)


class BaseTestCase(TestCase):
    """Crea un usuario base para auditoría."""
    def setUp(self):
        self.user = Usuario.objects.create_user(
            username="admin",
            email="admin@test.com",
            documento_identidad="99999999"
        )


class PaisModelTest(BaseTestCase):

    def test_creacion_pais(self):
        pais = Pais.objects.create(
            nombre="Perú",
            codigo="PE",
            created_by=self.user
        )
        self.assertEqual(str(pais), "Perú")
        self.assertEqual(pais.codigo, "PE")
        self.assertIsNotNone(pais.created_date)


class CiudadModelTest(BaseTestCase):

    def test_creacion_ciudad(self):
        pais = Pais.objects.create(nombre="México", codigo="MX")
        ciudad = Ciudad.objects.create(
            nombre="Guadalajara",
            pais=pais,
            created_by=self.user
        )

        self.assertEqual(str(ciudad), "Guadalajara")
        self.assertEqual(ciudad.pais.nombre, "México")


class RolModelTest(BaseTestCase):

    def test_creacion_rol(self):
        rol = Rol.objects.create(nombre="Administrador")
        self.assertEqual(str(rol), "Administrador")


class UsuarioModelTest(BaseTestCase):

    def test_creacion_usuario_minimo(self):
        user = Usuario.objects.create_user(
            username="aldo",
            email="aldo@test.com",
            documento_identidad="12345678"
        )
        self.assertEqual(user.username, "aldo")
        self.assertEqual(user.email, "aldo@test.com")

    def test_username_autogenerado_por_email(self):
        user = Usuario(
            email="auto@test.com",
            documento_identidad="00010001"
        )
        user.set_password("testpass123")
        user.save()

        self.assertEqual(user.username, "auto@test.com")

    def test_documento_identidad_unico(self):
        Usuario.objects.create_user(
            username="user1",
            email="u1@test.com",
            documento_identidad="1234"
        )

        with self.assertRaises(ValidationError):
            user = Usuario(
                username="user2",
                email="u2@test.com",
                documento_identidad="1234"
            )
            user.full_clean()

    def test_fecha_nacimiento_futura_invalida(self):
        futura = date.today().replace(year=date.today().year + 1)

        user = Usuario(
            username="future",
            email="future@test.com",
            documento_identidad="10101010",
            fecha_nacimiento=futura
        )
        with self.assertRaises(ValidationError):
            user.full_clean()

    def test_get_full_name(self):
        user = Usuario.objects.create(
            username="nombrecompleto",
            first_name="Aldo",
            apellido_paterno="Vásquez",
            apellido_materno="López",
            email="nc@test.com",
            documento_identidad="20202020"
        )

        self.assertEqual(user.get_full_name(), "Aldo Vásquez López")


class LogProcesosModelTest(BaseTestCase):

    def test_creacion_log(self):
        log = LogProcesos.objects.create(
            proceso="Registro",
            mensaje="Operación exitosa",
            usuario=self.user
        )

        self.assertIn("Registro", str(log))
        self.assertIsNotNone(log.fecha)


class AspectosNegocioModelTest(BaseTestCase):

    def test_creacion_aspectos_negocio(self):
        aspecto = AspectosNegocio.objects.create(
            direccion="Av. Siempre Viva 742",
            experiencia="5 años en el rubro",
            permite_presencial=True,
            created_by=self.user
        )

        self.assertEqual(str(aspecto), "Av. Siempre Viva 742")


class DisponibilidadModelTest(BaseTestCase):

    def test_creacion_disponibilidad(self):
        aspecto = AspectosNegocio.objects.create(direccion="Calle 1")
        disp = Disponibilidad.objects.create(
            aspectos_negocio=aspecto,
            dia="lunes",
            hora_inicio=time(8, 0),
            hora_fin=time(12, 0),
            created_by=self.user
        )

        self.assertEqual(
            str(disp),
            "lunes: 08:00 - 12:00"
        )
