(function() {
'use strict';

// Toggle del formulario de búsqueda en móviles
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

if (searchButton && searchButtonIcon && searchForm) {
    searchButton.addEventListener('click', function (e) {
        if (window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            if (searchForm.classList.contains('show')) {
                searchButtonIcon.classList.replace('bx-search', 'bx-x');
            } else {
                searchButtonIcon.classList.replace('bx-x', 'bx-search');
            }
        }
    });
}

// Dark Mode Switch
const switchMode = document.getElementById('switch-mode');

if (switchMode) {
    switchMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Cargar preferencia de dark mode
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        switchMode.checked = true;
    }
}

// Profile Menu Toggle
const profileIcon = document.querySelector('.profile');
const profileMenu = document.querySelector('.profile-menu');

if (profileIcon && profileMenu) {
    profileIcon.addEventListener('click', function (e) {
        e.preventDefault();
        profileMenu.classList.toggle('show');
    });
}

// Cerrar menú de perfil al hacer clic fuera
window.addEventListener('click', function (e) {
    if (!e.target.closest('.profile')) {
        if (profileMenu) {
            profileMenu.classList.remove('show');
        }
    }
});

// ============================================
// FUNCIONALIDAD DE CAMPAÑAS PUNTUALES
// ============================================

// Contador de clientes seleccionados
let clientesSeleccionados = 0;

// Actualizar contador visual
function actualizarContador() {
    const contadorElement = document.getElementById('contador-seleccionados');
    if (contadorElement) {
        contadorElement.textContent = `${clientesSeleccionados} seleccionado${clientesSeleccionados !== 1 ? 's' : ''}`;
    }
}

// Funcionalidad de selección de clientes
const clientButtons = document.querySelectorAll('.btn-select-client');

clientButtons.forEach(button => {
    button.addEventListener('click', function () {
        this.classList.toggle('selected');
        
        // Obtener el checkbox asociado
        const clientCard = this.closest('.client-card');
        const checkbox = clientCard.querySelector('.client-checkbox');
        
        // Cambiar el icono
        const icon = this.querySelector('i');
        if (this.classList.contains('selected')) {
            icon.classList.remove('bx-plus');
            icon.classList.add('bx-check');
            checkbox.checked = true;
            clientesSeleccionados++;
        } else {
            icon.classList.remove('bx-check');
            icon.classList.add('bx-plus');
            checkbox.checked = false;
            clientesSeleccionados--;
        }
        
        actualizarContador();
    });
});

// Funcionalidad del formulario de envío
const formCampania = document.getElementById('form-campania');
const messageInput = document.getElementById('mensaje-input');

if (formCampania) {
    formCampania.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const mensaje = messageInput.value.trim();
        const checkboxes = document.querySelectorAll('.client-checkbox:checked');
        
        // Validaciones
        if (mensaje === '') {
            mostrarAlerta('Por favor, escribe un mensaje.', 'error');
            return;
        }
        
        if (checkboxes.length === 0) {
            mostrarAlerta('Por favor, selecciona al menos un cliente.', 'error');
            return;
        }
        
        // Deshabilitar botón de envío
        const btnEnviar = formCampania.querySelector('.btn-send-message');
        const textoOriginal = btnEnviar.textContent;
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        
        // Crear FormData
        const formData = new FormData(formCampania);
        
        // Enviar el formulario con fetch
        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarModal(
                    '¡Éxito!',
                    data.mensaje,
                    'success'
                );
                
                // Limpiar formulario
                messageInput.value = '';
                
                // Deseleccionar todos los clientes
                document.querySelectorAll('.btn-select-client.selected').forEach(btn => {
                    btn.classList.remove('selected');
                    const icon = btn.querySelector('i');
                    icon.classList.remove('bx-check');
                    icon.classList.add('bx-plus');
                });
                
                document.querySelectorAll('.client-checkbox').forEach(cb => {
                    cb.checked = false;
                });
                
                clientesSeleccionados = 0;
                actualizarContador();
            } else {
                mostrarAlerta(data.error || 'Error al enviar el mensaje', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('Error de conexión. Por favor, intenta nuevamente.', 'error');
        })
        .finally(() => {
            // Rehabilitar botón
            btnEnviar.disabled = false;
            btnEnviar.textContent = textoOriginal;
        });
    });
}

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo = 'info') {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.innerHTML = `
        <i class='bx ${tipo === 'error' ? 'bx-error-circle' : 'bx-info-circle'}'></i>
        <span>${mensaje}</span>
    `;
    
    // Agregar al body
    document.body.appendChild(alerta);
    
    // Mostrar con animación
    setTimeout(() => {
        alerta.classList.add('show');
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        alerta.classList.remove('show');
        setTimeout(() => {
            alerta.remove();
        }, 300);
    }, 3000);
}

// Función para mostrar modal de confirmación
function mostrarModal(titulo, mensaje, tipo = 'success') {
    const modal = document.getElementById('modal-confirmacion');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    
    if (modal && modalTitulo && modalMensaje) {
        modalTitulo.textContent = titulo;
        modalMensaje.textContent = mensaje;
        modal.style.display = 'flex';
    }
}

// Cerrar modal
const closeModal = document.querySelector('.close-modal');
const btnModalOk = document.querySelector('.btn-modal-ok');
const modal = document.getElementById('modal-confirmacion');

if (closeModal) {
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });
}

if (btnModalOk) {
    btnModalOk.addEventListener('click', function () {
        modal.style.display = 'none';
    });
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Inicializar contador al cargar
actualizarContador();

})();