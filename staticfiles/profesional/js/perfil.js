// ===================================
// NAVBAR FUNCTIONALITY
// ===================================

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

// ===================================
// FILE UPLOAD FUNCTIONALITY
// ===================================

// Foto de Perfil
const fotoPerfilInput = document.getElementById('foto_perfil');
const btnUploadFoto = document.getElementById('btnUploadFoto');
const fotoFileName = document.getElementById('fotoFileName');
const previewAvatar = document.getElementById('previewAvatar');

if (btnUploadFoto && fotoPerfilInput) {
    btnUploadFoto.addEventListener('click', function() {
        fotoPerfilInput.click();
    });

    fotoPerfilInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fotoFileName.textContent = file.name;
            
            // Mostrar preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewAvatar.src = e.target.result;
                showNotification('Foto de perfil cargada exitosamente', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Experiencia
const experienciaInput = document.getElementById('experiencia');
const btnUploadExperiencia = document.getElementById('btnUploadExperiencia');
const experienciaFileName = document.getElementById('experienciaFileName');

if (btnUploadExperiencia && experienciaInput) {
    btnUploadExperiencia.addEventListener('click', function() {
        experienciaInput.click();
    });

    experienciaInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            experienciaFileName.textContent = file.name;
            showNotification('Archivo de experiencia cargado', 'success');
        }
    });
}

// Curriculum
const curriculumInput = document.getElementById('curriculum');
const btnUploadCurriculum = document.getElementById('btnUploadCurriculum');
const curriculumFileName = document.getElementById('curriculumFileName');

if (btnUploadCurriculum && curriculumInput) {
    btnUploadCurriculum.addEventListener('click', function() {
        curriculumInput.click();
    });

    curriculumInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            curriculumFileName.textContent = file.name;
            showNotification('Curriculum Vitae cargado', 'success');
        }
    });
}

// ===================================
// PASSWORD TOGGLE
// ===================================

const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('contrasena');

if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('bx-hide', 'bx-show');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('bx-show', 'bx-hide');
        }
    });
}

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

const profileForm = document.getElementById('profileForm');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');

if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos
        if (validateForm()) {
            saveProfile();
        }
    });
}

function validateForm() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellidoPaterno = document.getElementById('apellido_paterno').value.trim();
    const documento = document.getElementById('documento_identidad').value.trim();
    
    if (nombre === '') {
        showNotification('El nombre es obligatorio', 'error');
        document.getElementById('nombre').focus();
        return false;
    }
    
    if (apellidoPaterno === '') {
        showNotification('El apellido paterno es obligatorio', 'error');
        document.getElementById('apellido_paterno').focus();
        return false;
    }
    
    if (documento === '') {
        showNotification('El documento de identidad es obligatorio', 'error');
        document.getElementById('documento_identidad').focus();
        return false;
    }
    
    return true;
}

function saveProfile() {
    // Mostrar loading
    btnSave.disabled = true;
    btnSave.textContent = 'Guardando...';
    
    // Obtener datos del formulario
    const formData = {
        nombre: document.getElementById('nombre').value,
        apellido_paterno: document.getElementById('apellido_paterno').value,
        apellido_materno: document.getElementById('apellido_materno').value,
        documento_identidad: document.getElementById('documento_identidad').value,
        direccion: document.getElementById('direccion').value,
        linkedin: document.getElementById('linkedin').value
    };
    
    // Simular guardado (aquí harías la petición AJAX al servidor)
    setTimeout(() => {
        console.log('Perfil guardado:', formData);
        updatePreview();
        showNotification('Perfil actualizado exitosamente', 'success');
        
        btnSave.disabled = false;
        btnSave.textContent = 'Guardar cambios';
    }, 1500);
}

if (btnCancel) {
    btnCancel.addEventListener('click', function() {
        if (confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
            // Recargar la página o redirigir
            location.reload();
        }
    });
}

// ===================================
// PREVIEW UPDATE
// ===================================

function updatePreview() {
    const nombre = document.getElementById('nombre').value;
    const apellidoPaterno = document.getElementById('apellido_paterno').value;
    const apellidoMaterno = document.getElementById('apellido_materno').value;
    const direccion = document.getElementById('direccion').value;
    const linkedin = document.getElementById('linkedin').value;
    
    const fullName = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
    
    document.getElementById('previewName').textContent = fullName || 'Nombre Completo';
    document.getElementById('previewAddress').textContent = direccion || 'Dirección';
    
    const linkedinLink = document.getElementById('previewLinkedin');
    if (linkedin) {
        linkedinLink.href = linkedin;
        linkedinLink.style.display = 'flex';
    } else {
        linkedinLink.style.display = 'none';
    }
}

// Actualizar preview en tiempo real
const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
    input.addEventListener('input', updatePreview);
});

// ===================================
// MODAL DE COMENTARIOS
// ===================================

const btnComentarios = document.getElementById('btnComentarios');
const comentariosModal = document.getElementById('comentariosModal');
const closeComentarios = document.getElementById('closeComentarios');

if (btnComentarios) {
    btnComentarios.addEventListener('click', function() {
        comentariosModal.classList.add('show');
    });
}

if (closeComentarios) {
    closeComentarios.addEventListener('click', function() {
        comentariosModal.classList.remove('show');
    });
}

// Cerrar modal al hacer clic fuera
if (comentariosModal) {
    comentariosModal.addEventListener('click', function(e) {
        if (e.target === comentariosModal) {
            comentariosModal.classList.remove('show');
        }
    });
}

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && comentariosModal.classList.contains('show')) {
        comentariosModal.classList.remove('show');
    }
});

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class='bx ${getNotificationIcon(type)}'></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 24px;
                background: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10001;
                animation: slideIn 0.3s ease;
                min-width: 300px;
                font-family: var(--poppins);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            .notification.slide-out {
                animation: slideOut 0.3s ease;
            }
            
            .notification i {
                font-size: 24px;
            }
            
            .notification span {
                font-size: 14px;
                font-weight: 500;
                color: var(--dark);
            }
            
            .notification-info {
                border-left: 4px solid var(--blue);
            }
            
            .notification-info i {
                color: var(--blue);
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification-success i {
                color: #28a745;
            }
            
            .notification-warning {
                border-left: 4px solid #ffc107;
            }
            
            .notification-warning i {
                color: #ffc107;
            }
            
            .notification-error {
                border-left: 4px solid #dc3545;
            }
            
            .notification-error i {
                color: #dc3545;
            }
            
            @media screen and (max-width: 576px) {
                .notification {
                    right: 16px;
                    left: 16px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.add('slide-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'bx-info-circle',
        'success': 'bx-check-circle',
        'warning': 'bx-error-circle',
        'error': 'bx-x-circle'
    };
    return icons[type] || icons.info;
}

// ===================================
// AUTO-SAVE (DRAFT)
// ===================================

let autoSaveTimer;

function enableAutoSave() {
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveDraft();
            }, 2000); // Guardar borrador después de 2 segundos de inactividad
        });
    });
}

function saveDraft() {
    const draftData = {
        nombre: document.getElementById('nombre').value,
        apellido_paterno: document.getElementById('apellido_paterno').value,
        apellido_materno: document.getElementById('apellido_materno').value,
        documento_identidad: document.getElementById('documento_identidad').value,
        direccion: document.getElementById('direccion').value,
        linkedin: document.getElementById('linkedin').value,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('profile_draft', JSON.stringify(draftData));
    console.log('Borrador guardado automáticamente');
}

function loadDraft() {
    const draft = localStorage.getItem('profile_draft');
    
    if (draft) {
        const draftData = JSON.parse(draft);
        
        // Preguntar si desea cargar el borrador
        if (confirm('Se encontró un borrador guardado. ¿Deseas cargarlo?')) {
            document.getElementById('nombre').value = draftData.nombre || '';
            document.getElementById('apellido_paterno').value = draftData.apellido_paterno || '';
            document.getElementById('apellido_materno').value = draftData.apellido_materno || '';
            document.getElementById('documento_identidad').value = draftData.documento_identidad || '';
            document.getElementById('direccion').value = draftData.direccion || '';
            document.getElementById('linkedin').value = draftData.linkedin || '';
            
            updatePreview();
            showNotification('Borrador cargado', 'info');
        }
    }
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S para guardar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (validateForm()) {
            saveProfile();
        }
    }
    
    // Ctrl/Cmd + K para enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('#content nav form input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de perfil profesional inicializado');
    
    // Cargar borrador si existe
    loadDraft();
    
    // Habilitar auto-guardado
    enableAutoSave();
    
    // Actualizar preview inicial
    updatePreview();
    
    // Agregar tooltip a campos con candado
    const lockedLabels = document.querySelectorAll('.form-label i.bx-lock-alt');
    lockedLabels.forEach(label => {
        label.title = 'Este campo tiene configuraciones de privacidad';
    });
    
    console.log('Atajos de teclado disponibles:');
    console.log('- Ctrl/Cmd + S: Guardar cambios');
    console.log('- Ctrl/Cmd + K: Buscar');
    console.log('- ESC: Cerrar modal');
});