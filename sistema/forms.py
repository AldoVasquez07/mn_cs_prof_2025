from django import forms
from .models import Usuario, AspectosNegocio
from django.core.exceptions import ValidationError


class RegistrarUsuarioForm(forms.ModelForm):
    confirmar_contrasena = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': '**************', 'required':True}),
        label='Confirmar contraseña'
    )
    
    class Meta:
        model = Usuario
        fields = [
            'first_name', 'email', 'password',
            'apellido_paterno', 'apellido_materno', 'fecha_nacimiento',
            'documento_identidad', 'telefono'
        ]
        
        
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'Nombre', 'required': True}),
            'apellido_paterno': forms.TextInput(attrs={'placeholder': 'Apellido paterno', 'required': True}),
            'apellido_materno': forms.TextInput(attrs={'placeholder': 'Apellido materno', 'required': True}),
            'fecha_nacimiento': forms.DateInput(attrs={'type': 'date', 'required': True}),
            'documento_identidad': forms.TextInput(attrs={'placeholder': '45124556'}),
            'telefono': forms.TextInput(
                attrs={
                    'type': 'tel',
                    'placeholder': '975 234 567',
                    'pattern': '[0-9]{1,14}',
                    'title': 'Ingrese un numero de teléfono válido',
                    'minlength': '9',
                    'maxlength': '15',
                    'required': True
                }
            ),
            'email': forms.EmailInput(attrs={'placeholder': 'mi.correo@gmail.com', 'required': True}),
            'password': forms.PasswordInput(attrs={'placeholder': '**************', 'required': True}),
        }
        
        labels = {
            'first_name': 'Nombre',
            'apellido_paterno': 'Apellido paterno',
            'apellido_materno': 'Apellido materno',
            'fecha_nacimiento': 'Fecha de nacimiento',
            'documento_identidad': 'Documento de identidad',
            'telefono': 'Telefono',
            'ciudad': 'Ciudad',
            'email': 'Correo electrónico',
            'password': 'Contraseña',
        }
        
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirmar_contrasena = cleaned_data.get('confirmar_contrasena')
            
        if password and confirmar_contrasena and password != confirmar_contrasena:
            raise ValidationError('Las contraseñas no coinciden')
            
        return cleaned_data
    
    
class RegistrarAspectosNegocioForm(forms.ModelForm):
    class Meta:
        model = AspectosNegocio
        
        fields = [
            'direccion', 'hora_apertura', 'hora_cierre'
        ]
        
        widgets = {
            'direccion': forms.TextInput(attrs={'placeholder': 'Av. Mi direccion', 'required': True}),
            'hora_apertura': forms.TimeInput(attrs={'type': 'time', 'required': True}),
            'hora_cierre': forms.TimeInput(attrs={'type': 'time', 'required': True}),
        }
        
        labels = {
            'direccion': 'Dirección',
            'hora_apertura': 'Hora de Apertura',
            'hora_cierre': 'Hora de Cierre',
        }