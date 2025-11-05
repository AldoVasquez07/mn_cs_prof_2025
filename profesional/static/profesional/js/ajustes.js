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
// SETTINGS CARDS FUNCTIONALITY
// ===================================

const settingCards = document.querySelectorAll('.setting-card');

settingCards.forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const settingType = this.dataset.setting;
        
        // Agregar efecto de click
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Navegación según el tipo de ajuste
        handleSettingNavigation(settingType);
    });
});

function handleSettingNavigation(settingType) {
    console.log(`Navegando a: ${settingType}`);
    
    switch(settingType) {
        case 'agendas':
            // Redirigir a la página de agendas
            console.log('Abriendo configuración de Agendas');
            // window.location.href = '/profesional/agendas/';
            showNotification('Abriendo configuración de Agendas...', 'info');
            break;
            
        case 'servicios':
            // Redirigir a la página de servicios
            console.log('Abriendo configuración de Servicios');
            // window.location.href = '/profesional/servicios/';
            showNotification('Abriendo configuración de Servicios...', 'info');
            break;
            
        case 'mensajes':
            // Redirigir a la página de mensajes
            console.log('Abriendo Mensajes');
            // window.location.href = '/profesional/mensajes/';
            showNotification('Abriendo Mensajes...', 'info');
            break;
            
        case 'notas':
            // Redirigir a la página de notas
            console.log('Abriendo Notas para clientes');
            // window.location.href = '/profesional/notas/';
            showNotification('Abriendo Notas para clientes...', 'info');
            break;
            
        default:
            console.log('Opción no implementada');
            showNotification('Funcionalidad en desarrollo', 'warning');
    }
}

// ===================================
// ACCOUNT CARDS FUNCTIONALITY
// ===================================

const accountCards = document.querySelectorAll('.account-card');

accountCards.forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Agregar efecto de click
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        const settingName = this.querySelector('h4').textContent;
        handleAccountSetting(settingName);
    });
});

function handleAccountSetting(settingName) {
    console.log(`Configurando: ${settingName}`);
    
    switch(settingName) {
        case 'Perfil profesional':
            // window.location.href = '/profesional/perfil/';
            showNotification('Abriendo Perfil Profesional...', 'info');
            break;
            
        case 'Notificaciones':
            // window.location.href = '/profesional/notificaciones/';
            showNotification('Abriendo Notificaciones...', 'info');
            break;
            
        case 'Seguridad':
            // window.location.href = '/profesional/seguridad/';
            showNotification('Abriendo Seguridad...', 'info');
            break;
            
        case 'Facturación':
            // window.location.href = '/profesional/facturacion/';
            showNotification('Abriendo Facturación...', 'info');
            break;
            
        default:
            showNotification('Funcionalidad en desarrollo', 'warning');
    }
}

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
                z-index: 10000;
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
// SEARCH FUNCTIONALITY
// ===================================

const searchInput = document.querySelector('#content nav form input[type="search"]');

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Mostrar todas las cards
            showAllCards();
            return;
        }
        
        filterCards(searchTerm);
    });
}

function filterCards(searchTerm) {
    const allCards = document.querySelectorAll('.setting-card, .account-card');
    let foundCount = 0;
    
    allCards.forEach(card => {
        const title = card.querySelector('.card-title, h4');
        const description = card.querySelector('.card-description, p');
        
        const titleText = title ? title.textContent.toLowerCase() : '';
        const descText = description ? description.textContent.toLowerCase() : '';
        
        if (titleText.includes(searchTerm) || descText.includes(searchTerm)) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.3s ease';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no hay resultados
    if (foundCount === 0) {
        showNoResultsMessage();
    } else {
        removeNoResultsMessage();
    }
}

function showAllCards() {
    const allCards = document.querySelectorAll('.setting-card, .account-card');
    allCards.forEach(card => {
        card.style.display = '';
    });
    removeNoResultsMessage();
}

function showNoResultsMessage() {
    removeNoResultsMessage();
    
    const message = document.createElement('div');
    message.id = 'no-results-message';
    message.className = 'no-results';
    message.innerHTML = `
        <i class='bx bx-search-alt-2'></i>
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otros términos de búsqueda</p>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .no-results {
            text-align: center;
            padding: 60px 20px;
            background: var(--light);
            border-radius: 20px;
            margin: 20px 0;
        }
        .no-results i {
            font-size: 64px;
            color: var(--dark-grey);
            margin-bottom: 16px;
        }
        .no-results h3 {
            font-size: 20px;
            color: var(--dark);
            margin: 0 0 8px 0;
        }
        .no-results p {
            font-size: 14px;
            color: var(--dark-grey);
            margin: 0;
        }
    `;
    
    if (!document.getElementById('no-results-style')) {
        style.id = 'no-results-style';
        document.head.appendChild(style);
    }
    
    const container = document.querySelector('.settings-container');
    if (container) {
        container.appendChild(message);
    }
}

function removeNoResultsMessage() {
    const message = document.getElementById('no-results-message');
    if (message) {
        message.remove();
    }
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K para enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // ESC para limpiar búsqueda
    if (e.key === 'Escape' && searchInput === document.activeElement) {
        searchInput.value = '';
        searchInput.blur();
        showAllCards();
    }
});

// ===================================
// ANALYTICS & TRACKING (Opcional)
// ===================================

function trackSettingClick(settingName) {
    console.log(`[Analytics] Usuario accedió a: ${settingName}`);
    // Aquí puedes agregar código para enviar a Google Analytics, Mixpanel, etc.
    // Ejemplo: gtag('event', 'setting_click', { setting_name: settingName });
}

// Agregar tracking a todas las cards
document.querySelectorAll('.setting-card, .account-card').forEach(card => {
    card.addEventListener('click', function() {
        const settingName = this.querySelector('.card-title, h4').textContent;
        trackSettingClick(settingName);
    });
});

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de ajustes inicializado correctamente');
    
    // Agregar efecto de entrada a las secciones
    const sections = document.querySelectorAll('.settings-section, .account-section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Mostrar tip de búsqueda si está disponible
    if (searchInput) {
        searchInput.placeholder = 'Buscar ajustes... (Ctrl+K)';
    }
});