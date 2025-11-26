// ===================================
// PROFESIONALES JS - VERSIÓN CORREGIDA
// ===================================

(function() {
'use strict';

// ===================================
// VARIABLES GLOBALES
// ===================================

let selectedProfessional = null;
let currentDisponibilidades = [];

// Verificar que profesionalesData existe (viene del template)
if (typeof profesionalesData === 'undefined') {
    console.error('profesionalesData no está definida. Verifica el template.');
}

// ===================================
// ELEMENTOS DEL DOM
// ===================================

const mainSearch = document.getElementById('mainSearch');
const specialtyFilter = document.getElementById('specialtyFilter');
const typeFilter = document.getElementById('typeFilter');
const ratingFilter = document.getElementById('ratingFilter');
const professionalCards = document.querySelectorAll('.professional-card');
const emptyState = document.getElementById('emptyState');
const professionalsGrid = document.getElementById('professionalsGrid');

const appointmentModal = document.getElementById('appointmentModal');
const closeAppointment = document.getElementById('closeAppointment');
const cancelAppointment = document.getElementById('cancelAppointment');
const confirmAppointment = document.getElementById('confirmAppointment');
const appointmentForm = document.getElementById('appointmentForm');
const bookButtons = document.querySelectorAll('.btn-book-appointment');

// ===================================
// UTILIDADES
// ===================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// FILTROS Y BÚSQUEDA
// ===================================

function applyFilters() {
    const searchTerm = mainSearch ? mainSearch.value.toLowerCase().trim() : '';
    const specialty = specialtyFilter ? specialtyFilter.value.toLowerCase() : '';
    const type = typeFilter ? typeFilter.value.toLowerCase() : '';
    const rating = ratingFilter ? parseInt(ratingFilter.value) || 0 : 0;
    
    let visibleCount = 0;
    
    professionalCards.forEach(card => {
        const cardSpecialty = card.dataset.specialty?.toLowerCase() || '';
        const cardRating = parseInt(card.dataset.rating) || 0;
        const cardTypes = card.dataset.types?.toLowerCase() || '';
        
        const professionalName = card.querySelector('.professional-name')?.textContent.toLowerCase() || '';
        const professionalSpecialtyText = card.querySelector('.professional-specialty')?.textContent.toLowerCase() || '';
        
        const matchesSearch = searchTerm === '' || 
                            professionalName.includes(searchTerm) || 
                            professionalSpecialtyText.includes(searchTerm);
        
        const matchesSpecialty = specialty === '' || cardSpecialty === specialty;
        const matchesType = type === '' || cardTypes.includes(type);
        const matchesRating = rating === 0 || cardRating >= rating;
        
        if (matchesSearch && matchesSpecialty && matchesType && matchesRating) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (professionalsGrid && emptyState) {
        if (visibleCount === 0) {
            professionalsGrid.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            professionalsGrid.style.display = 'grid';
            emptyState.style.display = 'none';
        }
    }
}

if (mainSearch) mainSearch.addEventListener('input', applyFilters);
if (specialtyFilter) specialtyFilter.addEventListener('change', applyFilters);
if (typeFilter) typeFilter.addEventListener('change', applyFilters);
if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);

// ===================================
// MODAL DE AGENDAR CITA
// ===================================

function openAppointmentModal() {
    console.log('Abriendo modal de cita...');
    
    if (!appointmentModal) {
        console.error('Modal no encontrado');
        return;
    }
    
    if (!selectedProfessional) {
        console.error('No hay profesional seleccionado');
        return;
    }

    console.log('Datos del profesional:', selectedProfessional);
    console.log('Disponibilidades:', currentDisponibilidades);
    
    // Verificar si hay disponibilidades
    if (!currentDisponibilidades || currentDisponibilidades.length === 0) {
        showNotification('Este profesional no tiene horarios disponibles en este momento', 'error');
        return;
    }
    
    // Llenar información del profesional
    const modalName = document.getElementById('modalProfessionalName');
    const modalSpecialty = document.getElementById('modalProfessionalSpecialty');
    const modalAvatar = document.getElementById('modalProfessionalAvatar');
    const hiddenId = document.getElementById('hiddenProfessionalId');
    
    if (modalName) modalName.textContent = selectedProfessional.nombre;
    if (modalSpecialty) modalSpecialty.textContent = selectedProfessional.especialidad;
    if (modalAvatar) {
        modalAvatar.src = selectedProfessional.foto;
        modalAvatar.alt = selectedProfessional.nombre;
    }
    if (hiddenId) hiddenId.value = selectedProfessional.id;
    
    console.log('Hidden ID set to:', hiddenId?.value);
    
    // Configurar opciones de tipo de consulta
    const consultationType = document.getElementById('consultationType');
    if (consultationType) {
        consultationType.innerHTML = '<option value="">Selecciona el tipo</option>';
        
        if (selectedProfessional.permite_presencial) {
            const precio = selectedProfessional.precio_presencial || '0';
            consultationType.innerHTML += `<option value="presencial" data-price="${precio}">Presencial - S/ ${precio}</option>`;
        }
        
        if (selectedProfessional.permite_online) {
            const precio = selectedProfessional.precio_online || '0';
            consultationType.innerHTML += `<option value="online" data-price="${precio}">Online - S/ ${precio}</option>`;
        }
        
        console.log('Tipos de consulta configurados');
    }
    
    // Resetear el formulario pero mantener el ID
    const hiddenIdValue = hiddenId ? hiddenId.value : null;
    if (appointmentForm) appointmentForm.reset();
    if (hiddenId && hiddenIdValue) hiddenId.value = hiddenIdValue;
    
    // Cargar fechas disponibles
    const dateSelect = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    
    if (dateSelect) {
        dateSelect.innerHTML = '<option value="">Selecciona una fecha</option>';
        cargarFechasDisponibles();
        console.log('Fechas cargadas');
    }
    
    if (timeSelect) {
        timeSelect.innerHTML = '<option value="">Primero selecciona una fecha</option>';
    }
    
    const priceElement = document.getElementById('consultationPrice');
    if (priceElement) priceElement.textContent = 'S/ 0.00';
    
    // Mostrar modal
    appointmentModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    setTimeout(() => {
        appointmentModal.classList.add('show');
        console.log('Modal mostrado correctamente');
    }, 10);
}

function closeAppointmentModal() {
    console.log('Cerrando modal...');
    
    if (appointmentModal) {
        appointmentModal.classList.remove('show');
        
        setTimeout(() => {
            appointmentModal.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }, 300);
    }
    
    selectedProfessional = null;
    currentDisponibilidades = [];
}

function cargarFechasDisponibles() {
    const dateSelect = document.getElementById('appointmentDate');
    if (!dateSelect || !currentDisponibilidades || currentDisponibilidades.length === 0) {
        console.warn('No se pueden cargar fechas: dateSelect o disponibilidades no disponibles');
        return;
    }
    
    console.log('Cargando fechas desde:', currentDisponibilidades);
    
    // Agrupar slots por fecha
    const fechasUnicas = {};
    currentDisponibilidades.forEach(slot => {
        const fecha = slot.fecha;
        if (!fechasUnicas[fecha]) {
            fechasUnicas[fecha] = {
                fecha: fecha,
                display: `${slot.dia} ${slot.fecha_display}`,
                horarios: []
            };
        }
        fechasUnicas[fecha].horarios.push(slot);
    });
    
    console.log('Fechas únicas agrupadas:', Object.keys(fechasUnicas).length);
    
    // Llenar el select de fechas
    dateSelect.innerHTML = '<option value="">Selecciona una fecha</option>';
    Object.values(fechasUnicas).forEach(fechaData => {
        const option = document.createElement('option');
        option.value = fechaData.fecha;
        option.textContent = fechaData.display;
        option.dataset.horarios = JSON.stringify(fechaData.horarios);
        dateSelect.appendChild(option);
    });
    
    console.log('Fechas cargadas en select:', dateSelect.options.length - 1);
}

function cargarHorasDisponibles(fecha) {
    const timeSelect = document.getElementById('appointmentTime');
    const dateSelect = document.getElementById('appointmentDate');
    
    if (!timeSelect || !dateSelect) {
        console.warn('timeSelect o dateSelect no encontrados');
        return;
    }
    
    const selectedOption = dateSelect.options[dateSelect.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.horarios) {
        timeSelect.innerHTML = '<option value="">Selecciona una fecha primero</option>';
        return;
    }
    
    const horarios = JSON.parse(selectedOption.dataset.horarios);
    console.log('Horarios para la fecha seleccionada:', horarios.length);
    
    timeSelect.innerHTML = '<option value="">Selecciona una hora</option>';
    horarios.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.hora;
        option.textContent = slot.hora_display || slot.hora;
        timeSelect.appendChild(option);
    });
    
    console.log('Horas cargadas:', timeSelect.options.length - 1);
}

// ===================================
// EVENT LISTENERS PARA AGENDAR CITA
// ===================================

bookButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('═══════════════════════════════════');
        console.log('CLICK EN AGENDAR CITA');
        console.log('═══════════════════════════════════');
        
        // Obtener el ID del profesional desde el botón
        const professionalId = this.dataset.professionalId;
        console.log('Buscando profesional con ID:', professionalId);
        
        // Verificar que profesionalesData existe
        if (typeof profesionalesData === 'undefined') {
            console.error('profesionalesData no definida');
            showNotification('Error: Datos de profesionales no disponibles', 'error');
            return;
        }
        
        console.log('Total profesionales disponibles:', profesionalesData.length);
        
        // Buscar el profesional en profesionalesData
        const professional = profesionalesData.find(p => p.id == professionalId);
        
        if (!professional) {
            console.error('Profesional no encontrado en profesionalesData');
            console.log('IDs disponibles:', profesionalesData.map(p => p.id));
            showNotification('Error: Profesional no encontrado', 'error');
            return;
        }
        
        console.log('Profesional encontrado:', professional.nombre);
        console.log('Datos completos:', professional);
        
        // Verificar disponibilidades
        if (!professional.disponibilidades || professional.disponibilidades.length === 0) {
            console.warn('⚠️ Sin disponibilidades para este profesional');
            showNotification('Este profesional no tiene horarios disponibles actualmente', 'error');
            return;
        }
        
        console.log('Disponibilidades:', professional.disponibilidades.length, 'slots');
        
        // Guardar datos globalmente
        selectedProfessional = {
            id: professional.id,
            nombre: professional.nombre,
            especialidad: professional.especialidad,
            foto: professional.foto,
            precio_presencial: professional.precio_presencial,
            precio_online: professional.precio_online,
            permite_presencial: professional.permite_presencial,
            permite_online: professional.permite_online
        };
        
        currentDisponibilidades = professional.disponibilidades;
        
        console.log('Datos guardados globalmente');
        console.log('selectedProfessional:', selectedProfessional);
        console.log('currentDisponibilidades:', currentDisponibilidades.length);
        console.log('═══════════════════════════════════');
        
        // Abrir el modal
        openAppointmentModal();
    });
});

// Cerrar modal
if (closeAppointment) {
    closeAppointment.addEventListener('click', function(e) {
        e.preventDefault();
        closeAppointmentModal();
    });
}

if (cancelAppointment) {
    cancelAppointment.addEventListener('click', function(e) {
        e.preventDefault();
        closeAppointmentModal();
    });
}

// Cerrar al hacer click fuera
if (appointmentModal) {
    appointmentModal.addEventListener('click', function(e) {
        if (e.target === appointmentModal) {
            closeAppointmentModal();
        }
    });
}

// Actualizar precio cuando se selecciona tipo de consulta
const consultationType = document.getElementById('consultationType');
if (consultationType) {
    consultationType.addEventListener('change', function() {
        console.log('Tipo de consulta seleccionado:', this.value);
        
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.getAttribute('data-price') || '0';
        
        const priceElement = document.getElementById('consultationPrice');
        if (priceElement) {
            priceElement.textContent = `S/ ${price}.00`;
            console.log('Precio actualizado:', price);
        }
    });
}

// Cargar horas cuando se selecciona fecha
const appointmentDate = document.getElementById('appointmentDate');
if (appointmentDate) {
    appointmentDate.addEventListener('change', function() {
        console.log('Fecha seleccionada:', this.value);
        cargarHorasDisponibles(this.value);
    });
}

// Confirmar cita - enviar formulario
if (confirmAppointment) {
    confirmAppointment.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('═══════════════════════════════════');
        console.log('CONFIRMAR CITA - INICIANDO');
        console.log('═══════════════════════════════════');
        
        // Obtener valores del formulario
        const professionalId = document.getElementById('hiddenProfessionalId')?.value;
        const consultationType = document.getElementById('consultationType')?.value;
        const appointmentDate = document.getElementById('appointmentDate')?.value;
        const appointmentTime = document.getElementById('appointmentTime')?.value;
        const appointmentReason = document.getElementById('appointmentReason')?.value;
        
        console.log('Datos del formulario:');
        console.log('  - Professional ID:', professionalId);
        console.log('  - Tipo Consulta:', consultationType);
        console.log('  - Fecha:', appointmentDate);
        console.log('  - Hora:', appointmentTime);
        console.log('  - Motivo:', appointmentReason);
        
        // Validaciones
        if (!professionalId) {
            console.error('Falta professional ID');
            showNotification('Error: No se detectó el profesional', 'error');
            return;
        }
        
        if (!consultationType) {
            console.warn('Falta tipo de consulta');
            showNotification('Por favor, selecciona el tipo de consulta', 'error');
            return;
        }
        
        if (!appointmentDate) {
            console.warn('Falta fecha');
            showNotification('Por favor, selecciona una fecha', 'error');
            return;
        }
        
        if (!appointmentTime) {
            console.warn('Falta hora');
            showNotification('Por favor, selecciona una hora', 'error');
            return;
        }
        
        console.log('Todas las validaciones pasadas');
        
        // Deshabilitar botón mientras se procesa
        confirmAppointment.disabled = true;
        confirmAppointment.textContent = 'Procesando...';
        
        console.log('Enviando formulario...');
        console.log('═══════════════════════════════════');
        
        // Enviar el formulario
        if (appointmentForm) {
            appointmentForm.submit();
        } else {
            console.error('Formulario no encontrado');
            confirmAppointment.disabled = false;
            confirmAppointment.textContent = 'Confirmar Cita';
        }
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // ESC para cerrar modal
    if (e.key === 'Escape' && appointmentModal && appointmentModal.classList.contains('show')) {
        closeAppointmentModal();
    }
    
    // Ctrl/Cmd + K para buscar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (mainSearch) mainSearch.focus();
    }
});

// ===================================
// FAVORITOS
// ===================================

function initializeFavorites() {
    professionalCards.forEach(card => {
        const cardHeader = card.querySelector('.card-header');
        if (!cardHeader) return;
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'btn-favorite';
        favoriteBtn.innerHTML = '<i class="bx bx-heart"></i>';
        favoriteBtn.style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
            border: none;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            color: #dc3545;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s;
            z-index: 10;
        `;
        
        cardHeader.style.position = 'relative';
        cardHeader.appendChild(favoriteBtn);
        
        const professionalName = card.querySelector('.professional-name')?.textContent || '';
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.includes(professionalName)) {
            const icon = favoriteBtn.querySelector('i');
            if (icon) icon.classList.replace('bx-heart', 'bxs-heart');
        }
        
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(professionalName, this);
        });
    });
}

function toggleFavorite(professionalName, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const icon = button.querySelector('i');
    
    if (!icon) return;
    
    if (favorites.includes(professionalName)) {
        favorites = favorites.filter(name => name !== professionalName);
        icon.classList.replace('bxs-heart', 'bx-heart');
        showNotification('Removido de favoritos', 'info');
    } else {
        favorites.push(professionalName);
        icon.classList.replace('bx-heart', 'bxs-heart');
        showNotification('Agregado a favoritos', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ===================================
// AUTO-OCULTAR MENSAJES
// ===================================

function autoHideMessages() {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
        setTimeout(() => {
            messagesContainer.style.transition = 'opacity 0.5s';
            messagesContainer.style.opacity = '0';
            setTimeout(() => messagesContainer.remove(), 500);
        }, 5000);
    }
}

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('═══════════════════════════════════');
    console.log('SISTEMA DE PROFESIONALES');
    console.log('═══════════════════════════════════');
    console.log('Profesionales cargados:', professionalCards.length);
    console.log('Botones de agendar:', bookButtons.length);
    console.log('profesionalesData disponible:', typeof profesionalesData !== 'undefined');
    
    if (typeof profesionalesData !== 'undefined') {
        console.log('Total en profesionalesData:', profesionalesData.length);
        profesionalesData.forEach((p, i) => {
            console.log(`  ${i+1}. ID: ${p.id} - ${p.nombre} - Disp: ${p.disponibilidades?.length || 0}`);
        });
    }
    
    console.log('═══════════════════════════════════');
    
    initializeFavorites();
    autoHideMessages();
    
    console.log('Sistema listo y operativo');
});

})(); // Fin del IIFE