from django.test import TestCase
from django.contrib.auth import get_user_model
from cliente.models import Cliente

User = get_user_model()


class ClienteModelTest(TestCase):

    def setUp(self):
        # Usuario base
        self.user = User.objects.create_user(
            username="cliente1",
            password="123456",
            first_name="Mario",
            apellido_paterno="López"
        )

    # ---------------------------------------------------------
    # TEST 1: Crear un cliente correctamente
    # ---------------------------------------------------------
    def test_crear_cliente(self):
        cliente = Cliente.objects.create(usuario=self.user)

        self.assertEqual(cliente.usuario.username, "cliente1")
        self.assertTrue(cliente.flag)
        self.assertIsNotNone(cliente.fecha_registro)
        self.assertIsNone(cliente.created_by)

    # ---------------------------------------------------------
    # TEST 2: Validar __str__
    # ---------------------------------------------------------
    def test_str_cliente(self):
        cliente = Cliente.objects.create(usuario=self.user)
        self.assertEqual(str(cliente), "Cliente: Mario López")

    # ---------------------------------------------------------
    # TEST 3: Validar campos de auditoría
    # ---------------------------------------------------------
    def test_auditoria_set_creado_por(self):
        admin = User.objects.create_user(username="admin", password="123456")

        cliente = Cliente.objects.create(
            usuario=self.user,
            created_by=admin
        )

        self.assertEqual(cliente.created_by.username, "admin")
        self.assertIsNone(cliente.modified_by)

    # ---------------------------------------------------------
    # TEST 4: Validar actualización del cliente (modified_by)
    # ---------------------------------------------------------
    def test_modificacion_cliente(self):
        cliente = Cliente.objects.create(usuario=self.user)

        editor = User.objects.create_user(username="editor", password="123456")

        cliente.modified_by = editor
        cliente.save()

        cliente.refresh_from_db()
        self.assertEqual(cliente.modified_by.username, "editor")

    # ---------------------------------------------------------
    # TEST 5: Relación 1 a 1 con usuario
    # ---------------------------------------------------------
    def test_relacion_uno_a_uno_usuario(self):
        cliente = Cliente.objects.create(usuario=self.user)
        self.assertEqual(self.user.cliente, cliente)
