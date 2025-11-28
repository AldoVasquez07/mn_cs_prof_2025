import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone

from profesional.models import (
    Profesion, Especialidad, Profesional,
    ProfesionalCliente, Mensaje, Cita
)

from sistema.models import Usuario, AspectosNegocio
from cliente.models import Cliente
from organizacion.models import Organizacion


@pytest.mark.django_db
class TestProfesionModel:

    def test_crear_profesion(self):
        profesion = Profesion.objects.create(
            nombre="Medicina",
            descripcion="Área de salud"
        )
        assert profesion.id is not None
        assert profesion.nombre == "Medicina"
        assert profesion.flag is True

    def test_str(self):
        profesion = Profesion.objects.create(nombre="Ingeniería")
        assert str(profesion) == "Ingeniería"


@pytest.mark.django_db
class TestEspecialidadModel:

    def test_crear_especialidad(self):
        profesion = Profesion.objects.create(nombre="Psicología")

        esp = Especialidad.objects.create(
            nombre="Psicología Clínica",
            profesion=profesion
        )

        assert esp.id is not None
        assert esp.profesion == profesion

    def test_str(self):
        profesion = Profesion.objects.create(nombre="Medicina")
        esp = Especialidad.objects.create(nombre="Cardiología", profesion=profesion)

        assert str(esp) == "Cardiología"


@pytest.mark.django_db
class TestProfesionalModel:

    def crear_relaciones_base(self):
        usuario = Usuario.objects.create_user(
            username="user1",
            password="123",
            first_name="Aldo",
            apellido_paterno="Vásquez"
        )
        profesion = Profesion.objects.create(nombre="Ingeniería")
        especialidad = Especialidad.objects.create(
            nombre="Software",
            profesion=profesion
        )
        aspectos = AspectosNegocio.objects.create(nombre="Consultoría")
        organizacion = Organizacion.objects.create(nombre="Mi Empresa")

        return usuario, especialidad, aspectos, organizacion

    def test_crear_profesional(self):
        usuario, esp, asp, org = self.crear_relaciones_base()

        profesional = Profesional.objects.create(
            usuario=usuario,
            especialidad=esp,
            aspectos_negocio=asp,
            organizacion=org
        )

        assert profesional.id is not None
        assert profesional.usuario == usuario
        assert profesional.especialidad == esp

    def test_str(self):
        usuario, esp, asp, org = self.crear_relaciones_base()

        profesional = Profesional.objects.create(
            usuario=usuario, especialidad=esp,
            aspectos_negocio=asp, organizacion=org
        )

        assert str(profesional) == "Profesional: Aldo Vásquez"


@pytest.mark.django_db
class TestProfesionalClienteModel:

    def test_crear_relacion_profesional_cliente(self):
        # Crear base
        usuario = Usuario.objects.create_user(
            username="p1", password="123",
            first_name="Juan", apellido_paterno="Pérez"
        )
        profesion = Profesion.objects.create(nombre="Psicología")
        esp = Especialidad.objects.create(nombre="Clínica", profesion=profesion)
        asp = AspectosNegocio.objects.create(nombre="Terapias")
        org = Organizacion.objects.create(nombre="Centro Salud")

        profesional = Profesional.objects.create(
            usuario=usuario, especialidad=esp,
            aspectos_negocio=asp, organizacion=org
        )
        cliente = Cliente.objects.create(nombre="Carlos")

        rel = ProfesionalCliente.objects.create(
            profesional=profesional,
            cliente=cliente
        )

        assert rel.id is not None
        assert rel.estado == "activo"

    def test_unique_together(self):
        usuario = Usuario.objects.create_user(username="u2", password="123")
        profesion = Profesion.objects.create(nombre="Ingeniería")
        esp = Especialidad.objects.create(nombre="Software", profesion=profesion)
        asp = AspectosNegocio.objects.create(nombre="DevOps")
        org = Organizacion.objects.create(nombre="Empresa X")

        profesional = Profesional.objects.create(
            usuario=usuario, especialidad=esp,
            aspectos_negocio=asp, organizacion=org
        )
        cliente = Cliente.objects.create(nombre="Pedro")

        ProfesionalCliente.objects.create(profesional=profesional, cliente=cliente)

        with pytest.raises(Exception):  # IntegrityError
            ProfesionalCliente.objects.create(profesional=profesional, cliente=cliente)


@pytest.mark.django_db
class TestMensajeModel:

    def test_crear_mensaje(self):
        usuario = Usuario.objects.create_user(username="pro1", password="123")
        profesion = Profesion.objects.create(nombre="Medicina")
        esp = Especialidad.objects.create(nombre="General", profesion=profesion)
        asp = AspectosNegocio.objects.create(nombre="Consultas")
        org = Organizacion.objects.create(nombre="Clínica X")

        profesional = Profesional.objects.create(
            usuario=usuario, especialidad=esp,
            aspectos_negocio=asp, organizacion=org
        )
        cliente = Cliente.objects.create(nombre="Luis")

        rel = ProfesionalCliente.objects.create(
            profesional=profesional, cliente=cliente
        )

        mensaje = Mensaje.objects.create(
            relacion=rel,
            emisor="cliente",
            contenido="Hola, necesito una consulta"
        )

        assert mensaje.id is not None
        assert mensaje.emisor == "cliente"
        assert mensaje.relacion == rel

    def test_str(self):
        usuario = Usuario.objects.create_user(username="pro2", password="123")
        profesion = Profesion.objects.create(nombre="Medicina")
        esp = Especialidad.objects.create(nombre="General", profesion=profesion)
        asp = AspectosNegocio.objects.create(nombre="Consultoría")
        org = Organizacion.objects.create(nombre="Clínica Z")

        profesional = Profesional.objects.create(
            usuario=usuario, especialidad=esp,
            aspectos_negocio=asp, organizacion=org
        )
        cliente = Cliente.objects.create(nombre="Luis")

        rel = ProfesionalCliente.objects.create(profesional=profesional, cliente=cliente)

        mensaje = Mensaje.objects.create(
            relacion=rel,
            emisor="profesional",
            contenido="Hola"
        )

        assert "Mensaje de profesional" in str(mensaje)


@pytest.mark.django_db
class TestCitaModel:

    def crear_relacion(self):
        usuario = Usuario.objects.create_user(username="p3", password="123")
        profesion = Profesion.objects.create(nombre="Psicología")
        esp = Especialidad.objects.create(nombre="Clínica", profesion=profesion)
        asp = AspectosNegocio.objects.create(nombre="Terapias")
        org = Organizacion.objects.create(nombre="Centro X")
        profesional = Profesional.objects.create(
            usuario=usuario, especialidad=esp,
            aspectos_negocio=asp, organizacion=org
        )
        cliente = Cliente.objects.create(nombre="Fernando")

        return ProfesionalCliente.objects.create(profesional=profesional, cliente=cliente)

    def test_crear_cita(self):
        rel = self.crear_relacion()

        fecha = timezone.now()
        cita = Cita.objects.create(
            relacion=rel,
            fecha=fecha,
            motivo="Sesión inicial"
        )

        assert cita.id is not None
        assert cita.estado == "pendiente"

    def test_validacion_calificacion(self):
        rel = self.crear_relacion()
        fecha = timezone.now()

        cita = Cita.objects.create(relacion=rel, fecha=fecha)

        cita.calificacion_profesional = 6  # inválido (>5)

        with pytest.raises(ValidationError):
            cita.full_clean()

    def test_str(self):
        rel = self.crear_relacion()
        fecha = timezone.now()

        cita = Cita.objects.create(relacion=rel, fecha=fecha)

        assert "Cita" in str(cita)
