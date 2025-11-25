// ===================================
// PROFESIONALES JS
// Solo funcionalidad específica de profesionales
// ===================================

(function() {
'use strict';

// ===================================
// SEARCH AND FILTER FUNCTIONALITY
// ===================================

const mainSearch = document.getElementById('mainSearch');
const specialtyFilter = document.getElementById('specialtyFilter');
const typeFilter = document.getElementById('typeFilter');
const ratingFilter = document.getElementById('ratingFilter');
const professionalCards = document.querySelectorAll('.professional-card');
const emptyState = document.getElementById('emptyState');
const professionalsGrid = document.getElementById('professionalsGrid');

if (mainSearch) {
    mainSearch.addEventListener('input', applyFilters);
}

if (specialtyFilter) specialtyFilter.addEventListener('change', applyFilters);
if (typeFilter) typeFilter.addEventListener('change', applyFilters);
if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);

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
    
    console.log(`Filtros aplicados. ${visibleCount} profesionales encontrados.`);
}

// ===================================
// MODAL DE AGENDAR CITA
// ===================================

const appointmentModal = document.getElementById('appointmentModal');
const closeAppointment = document.getElementById('closeAppointment');
const cancelAppointment = document.getElementById('cancelAppointment');
const confirmAppointment = document.getElementById('confirmAppointment');
const bookButtons = document.querySelectorAll('.btn-book-appointment');

let selectedProfessional = null;

function openAppointmentModal() {
    console.log('🔵 Intentando abrir modal...');
    
    if (!appointmentModal) {
        console.error('❌ Modal no encontrado en el DOM!');
        return;
    }
    
    // Llenar información del profesional
    const modalName = document.getElementById('modalProfessionalName');
    const modalSpecialty = document.getElementById('modalProfessionalSpecialty');
    const modalAvatar = document.getElementById('modalProfessionalAvatar');
    
    if (modalName) modalName.textContent = selectedProfessional.name;
    if (modalSpecialty) modalSpecialty.textContent = selectedProfessional.specialty;
    if (modalAvatar) {
        modalAvatar.src = selectedProfessional.avatar;
        modalAvatar.alt = selectedProfessional.name;
    }
    
    // Configurar opciones de tipo de consulta
    const consultationType = document.getElementById('consultationType');
    if (consultationType) {
        consultationType.innerHTML = '<option value="">Selecciona el tipo</option>';
        
        console.log('Tipos disponibles:', selectedProfessional.types);
        
        if (selectedProfessional.types.includes('presencial')) {
            consultationType.innerHTML += `<option value="presencial" data-price="${selectedProfessional.precioPresencial}">Presencial - S/ ${selectedProfessional.precioPresencial}</option>`;
        }
        
        if (selectedProfessional.types.includes('online')) {
            consultationType.innerHTML += `<option value="online" data-price="${selectedProfessional.precioOnline}">Online - S/ ${selectedProfessional.precioOnline}</option>`;
        }
        
        if (selectedProfessional.types.length === 0) {
            consultationType.innerHTML += `<option value="presencial" data-price="200">Presencial - S/ 200</option>`;
            consultationType.innerHTML += `<option value="online" data-price="200">Online - S/ 200</option>`;
        }
    }
    
    // Resetear formulario
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) appointmentForm.reset();
    
    const priceElement = document.getElementById('consultationPrice');
    if (priceElement) priceElement.textContent = 'S/ 0.00';
    
    // Establecer fecha mínima (hoy)
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // MOSTRAR EL MODAL
    appointmentModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    setTimeout(() => {
        appointmentModal.classList.add('show');
        console.log('✅ Modal mostrado correctamente');
    }, 10);
}

function closeAppointmentModal() {
    console.log('🔴 Cerrando modal...');
    
    if (appointmentModal) {
        appointmentModal.classList.remove('show');
        
        setTimeout(() => {
            appointmentModal.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }, 300);
    }
    
    selectedProfessional = null;
}

// Event listeners para los botones de "Agendar Cita"
bookButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🟢 Click en botón Agendar Cita');
        
        const professionalName = this.dataset.professional;
        const card = this.closest('.professional-card');
        
        if (!card) {
            console.error('❌ No se encontró la card del profesional');
            return;
        }
        
        console.log('Profesional:', professionalName);
        
        // Obtener tipos de consulta disponibles
        const typesString = card.dataset.types || '';
        let types = [];
        
        if (typesString) {
            types = typesString.split(',').map(t => t.trim()).filter(t => t);
        }
        
        // Si no hay data-types, buscar en los badges
        if (types.length === 0) {
            const badges = card.querySelectorAll('.type-badge');
            badges.forEach(badge => {
                const text = badge.textContent.toLowerCase();
                if (text.includes('presencial')) types.push('presencial');
                if (text.includes('online')) types.push('online');
            });
        }
        
        console.log('Tipos encontrados:', types);
        
        // Obtener precios
        const servicePrices = card.querySelectorAll('.service-price');
        let precioPresencial = '200';
        let precioOnline = '200';
        
        servicePrices.forEach(priceElement => {
            const label = priceElement.previousElementSibling;
            if (label) {
                const labelText = label.textContent.toLowerCase();
                const price = priceElement.textContent.replace('S/', '').trim();
                
                if (labelText.includes('presencial')) {
                    precioPresencial = price;
                }
                if (labelText.includes('online')) {
                    precioOnline = price;
                }
            }
        });
        
        console.log('Precios - Presencial:', precioPresencial, 'Online:', precioOnline);
        
        selectedProfessional = {
            name: professionalName,
            specialty: card.querySelector('.professional-specialty')?.textContent || 'Especialidad',
            avatar: card.querySelector('.professional-avatar-large img')?.src || '',
            types: types,
            precioPresencial: precioPresencial,
            precioOnline: precioOnline
        };
        
        console.log('Profesional seleccionado:', selectedProfessional);
        
        openAppointmentModal();
    });
});

// Event listeners para cerrar el modal
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

// Cerrar modal al hacer click fuera
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
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.getAttribute('data-price') || '0';
        
        const priceElement = document.getElementById('consultationPrice');
        if (priceElement) {
            priceElement.textContent = `S/ ${price}.00`;
        }
    });
}

// Confirmar cita
if (confirmAppointment) {
    confirmAppointment.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateAppointmentForm()) {
            bookAppointment();
        }
    });
}

function validateAppointmentForm() {
    const consultationType = document.getElementById('consultationType')?.value;
    const appointmentDate = document.getElementById('appointmentDate')?.value;
    const appointmentTime = document.getElementById('appointmentTime')?.value;
    
    if (!consultationType) {
        alert('Por favor, selecciona el tipo de consulta');
        return false;
    }
    
    if (!appointmentDate) {
        alert('Por favor, selecciona una fecha');
        return false;
    }
    
    if (!appointmentTime) {
        alert('Por favor, selecciona una hora');
        return false;
    }
    
    return true;
}

function bookAppointment() {
    const appointmentData = {
        professional: selectedProfessional.name,
        specialty: selectedProfessional.specialty,
        consultationType: document.getElementById('consultationType').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        reason: document.getElementById('appointmentReason').value,
        price: document.getElementById('consultationPrice').textContent,
        timestamp: new Date().toISOString()
    };
    
    console.log('Agendando cita:', appointmentData);
    
    if (confirmAppointment) {
        confirmAppointment.disabled = true;
        confirmAppointment.textContent = 'Procesando...';
    }
    
    setTimeout(() => {
        closeAppointmentModal();
        alert(`¡Cita agendada exitosamente con ${appointmentData.professional}!`);
        
        if (confirmAppointment) {
            confirmAppointment.disabled = false;
            confirmAppointment.textContent = 'Confirmar Cita';
        }
        
        // Aquí puedes agregar la lógica para enviar al backend
        // fetch('/api/appointments/', { method: 'POST', body: JSON.stringify(appointmentData) })
    }, 1500);
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // ESC para cerrar modal
    if (e.key === 'Escape' && appointmentModal && appointmentModal.classList.contains('show')) {
        closeAppointmentModal();
    }
    
    // Ctrl/Cmd + K para enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (mainSearch) mainSearch.focus();
    }
});

// ===================================
// SORTING FUNCTIONALITY
// ===================================

function sortProfessionals(criteria) {
    const cardsArray = Array.from(professionalCards);
    
    cardsArray.sort((a, b) => {
        switch(criteria) {
            case 'name':
                const nameA = a.querySelector('.professional-name')?.textContent || '';
                const nameB = b.querySelector('.professional-name')?.textContent || '';
                return nameA.localeCompare(nameB);
                
            case 'rating':
                const ratingA = parseInt(a.dataset.rating) || 0;
                const ratingB = parseInt(b.dataset.rating) || 0;
                return ratingB - ratingA;
                
            case 'specialty':
                const specialtyA = a.dataset.specialty || '';
                const specialtyB = b.dataset.specialty || '';
                return specialtyA.localeCompare(specialtyB);
                
            default:
                return 0;
        }
    });
    
    if (professionalsGrid) {
        cardsArray.forEach(card => professionalsGrid.appendChild(card));
    }
}

const sortButtons = document.querySelectorAll('[data-sort]');
sortButtons.forEach(button => {
    button.addEventListener('click', function() {
        const criteria = this.dataset.sort;
        sortProfessionals(criteria);
    });
});

// ===================================
// FAVORITOS FUNCTIONALITY
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
        console.log('Removido de favoritos:', professionalName);
    } else {
        favorites.push(professionalName);
        icon.classList.replace('bx-heart', 'bxs-heart');
        console.log('Agregado a favoritos:', professionalName);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ===================================
// VIEW PROFESSIONAL DETAILS
// ===================================

professionalCards.forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.closest('button')) return;
        
        const professionalName = this.querySelector('.professional-name')?.textContent || '';
        console.log(`Ver detalles de ${professionalName}`);
        
        // Aquí podrías redirigir a la página de detalles
        // window.location.href = `/cliente/profesionales/${professionalId}/`;
    });
    
    card.style.cursor = 'pointer';
});

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Sistema de profesionales inicializado');
    console.log('Modal encontrado:', !!appointmentModal);
    console.log('Botones de agendar encontrados:', bookButtons.length);
    console.log('Profesionales cargados:', professionalCards.length);
    
    if (!appointmentModal) {
        console.error('❌ CRÍTICO: El modal no fue encontrado. Verifica el HTML.');
    }
    
    initializeFavorites();
    
    console.log('Atajos de teclado disponibles:');
    console.log('- Ctrl/Cmd + K: Buscar');
    console.log('- ESC: Cerrar modal');
});

})(); // Fin del IIFE