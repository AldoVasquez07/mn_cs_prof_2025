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
// SEARCH AND FILTER FUNCTIONALITY
// ===================================

const mainSearch = document.getElementById('mainSearch');
const navSearch = document.getElementById('searchProfessional');
const specialtyFilter = document.getElementById('specialtyFilter');
const typeFilter = document.getElementById('typeFilter');
const ratingFilter = document.getElementById('ratingFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const professionalCards = document.querySelectorAll('.professional-card');
const emptyState = document.getElementById('emptyState');
const professionalsGrid = document.getElementById('professionalsGrid');

// Búsqueda principal
if (mainSearch) {
    mainSearch.addEventListener('input', function() {
        applyFilters();
    });
}

// Búsqueda en navbar
if (navSearch) {
    navSearch.addEventListener('input', function() {
        if (mainSearch) {
            mainSearch.value = this.value;
            applyFilters();
        }
    });
}

// Filtros
if (specialtyFilter) {
    specialtyFilter.addEventListener('change', applyFilters);
}

if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
}

if (ratingFilter) {
    ratingFilter.addEventListener('change', applyFilters);
}

// Limpiar filtros
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function() {
        mainSearch.value = '';
        navSearch.value = '';
        specialtyFilter.value = '';
        typeFilter.value = '';
        ratingFilter.value = '';
        applyFilters();
    });
}

function applyFilters() {
    const searchTerm = mainSearch.value.toLowerCase().trim();
    const specialty = specialtyFilter.value.toLowerCase();
    const type = typeFilter.value.toLowerCase();
    const rating = parseInt(ratingFilter.value) || 0;
    
    let visibleCount = 0;
    
    professionalCards.forEach(card => {
        const cardSpecialty = card.dataset.specialty.toLowerCase();
        const cardRating = parseInt(card.dataset.rating);
        const cardTypes = card.dataset.types.toLowerCase();
        
        // Obtener texto de búsqueda
        const professionalName = card.querySelector('.professional-name').textContent.toLowerCase();
        const professionalSpecialtyText = card.querySelector('.professional-specialty').textContent.toLowerCase();
        
        // Evaluar condiciones
        const matchesSearch = searchTerm === '' || 
                            professionalName.includes(searchTerm) || 
                            professionalSpecialtyText.includes(searchTerm);
        
        const matchesSpecialty = specialty === '' || cardSpecialty === specialty;
        
        const matchesType = type === '' || cardTypes.includes(type);
        
        const matchesRating = rating === 0 || cardRating >= rating;
        
        // Mostrar u ocultar card
        if (matchesSearch && matchesSpecialty && matchesType && matchesRating) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar estado vacío si no hay resultados
    if (visibleCount === 0) {
        professionalsGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        professionalsGrid.style.display = 'grid';
        emptyState.style.display = 'none';
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

// Abrir modal al hacer clic en "Agendar Cita"
bookButtons.forEach(button => {
    button.addEventListener('click', function() {
        const professionalName = this.dataset.professional;
        const card = this.closest('.professional-card');
        
        selectedProfessional = {
            name: professionalName,
            specialty: card.querySelector('.professional-specialty').textContent,
            avatar: card.querySelector('.professional-avatar-large img').src,
            types: card.dataset.types.split(',')
        };
        
        openAppointmentModal();
    });
});

function openAppointmentModal() {
    // Llenar información del profesional
    document.getElementById('modalProfessionalName').textContent = selectedProfessional.name;
    document.getElementById('modalProfessionalSpecialty').textContent = selectedProfessional.specialty;
    document.getElementById('modalProfessionalAvatar').src = selectedProfessional.avatar;
    document.getElementById('modalProfessionalAvatar').alt = selectedProfessional.name;
    
    // Configurar opciones de tipo de consulta
    const consultationType = document.getElementById('consultationType');
    consultationType.innerHTML = '<option value="">Selecciona el tipo</option>';
    
    if (selectedProfessional.types.includes('presencial')) {
        consultationType.innerHTML += '<option value="presencial">Presencial - S/ 200</option>';
    }
    if (selectedProfessional.types.includes('online')) {
        consultationType.innerHTML += '<option value="online">Online - S/ 200</option>';
    }
    
    // Resetear formulario
    document.getElementById('appointmentForm').reset();
    document.getElementById('consultationPrice').textContent = 'S/ 0.00';
    
    // Establecer fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    
    appointmentModal.classList.add('show');
}

function closeAppointmentModal() {
    appointmentModal.classList.remove('show');
    selectedProfessional = null;
}

if (closeAppointment) {
    closeAppointment.addEventListener('click', closeAppointmentModal);
}

if (cancelAppointment) {
    cancelAppointment.addEventListener('click', closeAppointmentModal);
}

// Actualizar precio cuando se selecciona tipo de consulta
const consultationType = document.getElementById('consultationType');
if (consultationType) {
    consultationType.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.text.match(/S\/\s*(\d+)/);
        
        if (price) {
            document.getElementById('consultationPrice').textContent = `S/ ${price[1]}.00`;
        } else {
            document.getElementById('consultationPrice').textContent = 'S/ 0.00';
        }
    });
}

// Confirmar cita
if (confirmAppointment) {
    confirmAppointment.addEventListener('click', function() {
        if (validateAppointmentForm()) {
            bookAppointment();
        }
    });
}

function validateAppointmentForm() {
    const consultationType = document.getElementById('consultationType').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    
    if (!consultationType) {
        showNotification('Por favor, selecciona el tipo de consulta', 'error');
        return false;
    }
    
    if (!appointmentDate) {
        showNotification('Por favor, selecciona una fecha', 'error');
        return false;
    }
    
    if (!appointmentTime) {
        showNotification('Por favor, selecciona una hora', 'error');
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
    
    // Simular proceso de agendado
    confirmAppointment.disabled = true;
    confirmAppointment.textContent = 'Procesando...';
    
    setTimeout(() => {
        closeAppointmentModal();
        showNotification(`¡Cita agendada exitosamente con ${appointmentData.professional}!`, 'success');
        
        // Resetear botón
        confirmAppointment.disabled = false;
        confirmAppointment.textContent = 'Confirmar Cita';
        
        // Aquí iría la lógica para enviar al backend
        // fetch('/api/appointments/create/', { method: 'POST', body: JSON.stringify(appointmentData) })
    }, 2000);
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class='bx ${getNotificationIcon(type)}'></i>
        <span>${message}</span>
    `;
    
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
    
    document.body.appendChild(notification);
    
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
// CLOSE MODAL ON CLICK OUTSIDE
// ===================================

if (appointmentModal) {
    appointmentModal.addEventListener('click', function(e) {
        if (e.target === appointmentModal) {
            closeAppointmentModal();
        }
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // ESC para cerrar modal
    if (e.key === 'Escape' && appointmentModal.classList.contains('show')) {
        closeAppointmentModal();
    }
    
    // Ctrl/Cmd + K para enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (mainSearch) {
            mainSearch.focus();
        }
    }
    
    // Ctrl/Cmd + F para enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (mainSearch) {
            mainSearch.focus();
        }
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
                const nameA = a.querySelector('.professional-name').textContent;
                const nameB = b.querySelector('.professional-name').textContent;
                return nameA.localeCompare(nameB);
                
            case 'rating':
                const ratingA = parseInt(a.dataset.rating);
                const ratingB = parseInt(b.dataset.rating);
                return ratingB - ratingA;
                
            case 'specialty':
                const specialtyA = a.dataset.specialty;
                const specialtyB = b.dataset.specialty;
                return specialtyA.localeCompare(specialtyB);
                
            default:
                return 0;
        }
    });
    
    // Reordenar en el DOM
    cardsArray.forEach(card => professionalsGrid.appendChild(card));
}

// Agregar botones de ordenamiento si es necesario
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
        // Agregar botón de favorito
        const cardHeader = card.querySelector('.card-header');
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
        `;
        
        cardHeader.style.position = 'relative';
        cardHeader.appendChild(favoriteBtn);
        
        // Cargar estado de favorito
        const professionalName = card.querySelector('.professional-name').textContent;
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.includes(professionalName)) {
            favoriteBtn.querySelector('i').classList.replace('bx-heart', 'bxs-heart');
        }
        
        // Toggle favorito
        favoriteBtn.addEventListener('click', function() {
            toggleFavorite(professionalName, this);
        });
    });
}

function toggleFavorite(professionalName, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const icon = button.querySelector('i');
    
    if (favorites.includes(professionalName)) {
        // Remover de favoritos
        favorites = favorites.filter(name => name !== professionalName);
        icon.classList.replace('bxs-heart', 'bx-heart');
        showNotification('Removido de favoritos', 'info');
    } else {
        // Agregar a favoritos
        favorites.push(professionalName);
        icon.classList.replace('bx-heart', 'bxs-heart');
        showNotification('Agregado a favoritos', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ===================================
// LOADING SIMULATION
// ===================================

function simulateLoading() {
    const loadingState = document.getElementById('loadingState');
    
    if (loadingState) {
        professionalsGrid.style.display = 'none';
        loadingState.style.display = 'block';
        
        setTimeout(() => {
            loadingState.style.display = 'none';
            professionalsGrid.style.display = 'grid';
        }, 1000);
    }
}

// ===================================
// VIEW PROFESSIONAL DETAILS
// ===================================

professionalCards.forEach(card => {
    // Hacer que la card sea clickeable (excepto los botones)
    card.addEventListener('click', function(e) {
        // Ignorar clicks en botones
        if (e.target.closest('button')) return;
        
        const professionalName = this.querySelector('.professional-name').textContent;
        console.log(`Ver detalles de ${professionalName}`);
        
        // Aquí podrías abrir un modal con más detalles o redirigir
        // window.location.href = `/cliente/profesionales/${professionalId}/`;
    });
    
    // Agregar cursor pointer
    card.style.cursor = 'pointer';
});

// ===================================
// ANALYTICS & TRACKING
// ===================================

function trackProfessionalView(professionalName) {
    console.log(`[Analytics] Usuario vio perfil de: ${professionalName}`);
}

function trackAppointmentBooked(appointmentData) {
    console.log(`[Analytics] Cita agendada:`, appointmentData);
}

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de profesionales inicializado correctamente');
    
    // Inicializar favoritos
    initializeFavorites();
    
    // Simular carga inicial
    // simulateLoading();
    
    console.log(`${professionalCards.length} profesionales cargados`);
    console.log('Atajos de teclado disponibles:');
    console.log('- Ctrl/Cmd + K o F: Buscar');
    console.log('- ESC: Cerrar modal');
});