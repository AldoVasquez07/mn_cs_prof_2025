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
// PLAN SELECTION
// ===================================

const planButtons = document.querySelectorAll('.btn-plan');
const planModal = document.getElementById('planModal');
const closeModal = document.getElementById('closeModal');
const cancelPlan = document.getElementById('cancelPlan');
const confirmPlan = document.getElementById('confirmPlan');

// Información de los planes
const plansData = {
    basico: {
        name: 'Plan Básico',
        price: '49.90',
        features: [
            'Perfil profesional completo',
            'Visibilidad en búsquedas',
            'Hasta 5 servicios publicados',
            'Gestión de agenda básica'
        ]
    },
    premium: {
        name: 'Plan Premium',
        price: '99.90',
        features: [
            'Todo lo del Plan Básico',
            'Servicios ilimitados',
            'Gestión avanzada de agenda',
            'Mensajería con clientes',
            'Videoconsultas integradas',
            'Reportes y estadísticas',
            'Soporte prioritario'
        ]
    }
};

let selectedPlan = null;

planButtons.forEach(button => {
    button.addEventListener('click', function() {
        selectedPlan = this.dataset.plan;
        openPlanModal(selectedPlan);
    });
});

function openPlanModal(planType) {
    const plan = plansData[planType];
    
    document.getElementById('selectedPlanName').textContent = plan.name;
    document.getElementById('selectedPlanPrice').textContent = plan.price;
    
    planModal.classList.add('show');
    
    // Resetear formulario
    document.getElementById('paymentMethod').value = '';
    document.getElementById('cardFields').style.display = 'none';
    document.getElementById('acceptTerms').checked = false;
}

function closePlanModal() {
    planModal.classList.remove('show');
    selectedPlan = null;
}

if (closeModal) {
    closeModal.addEventListener('click', closePlanModal);
}

if (cancelPlan) {
    cancelPlan.addEventListener('click', closePlanModal);
}

// Cerrar modal al hacer clic fuera
if (planModal) {
    planModal.addEventListener('click', function(e) {
        if (e.target === planModal) {
            closePlanModal();
        }
    });
}

// ===================================
// PAYMENT METHOD SELECTION
// ===================================

const paymentMethod = document.getElementById('paymentMethod');
const cardFields = document.getElementById('cardFields');

if (paymentMethod) {
    paymentMethod.addEventListener('change', function() {
        if (this.value === 'tarjeta') {
            cardFields.style.display = 'block';
        } else {
            cardFields.style.display = 'none';
        }
    });
}

// ===================================
// CONFIRM SUBSCRIPTION
// ===================================

if (confirmPlan) {
    confirmPlan.addEventListener('click', function() {
        if (validateSubscription()) {
            processSubscription();
        }
    });
}

function validateSubscription() {
    const paymentMethodValue = document.getElementById('paymentMethod').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    if (!paymentMethodValue) {
        showNotification('Por favor, selecciona un método de pago', 'error');
        return false;
    }
    
    if (paymentMethodValue === 'tarjeta') {
        const cardNumber = cardFields.querySelector('input[placeholder*="1234"]').value;
        const expiry = cardFields.querySelector('input[placeholder*="MM/AA"]').value;
        const cvv = cardFields.querySelector('input[placeholder*="123"]').value;
        
        if (!cardNumber || !expiry || !cvv) {
            showNotification('Por favor, completa los datos de la tarjeta', 'error');
            return false;
        }
    }
    
    if (!acceptTerms) {
        showNotification('Debes aceptar los términos y condiciones', 'warning');
        return false;
    }
    
    return true;
}

function processSubscription() {
    const plan = plansData[selectedPlan];
    
    // Deshabilitar botón
    confirmPlan.disabled = true;
    confirmPlan.textContent = 'Procesando...';
    
    // Simular proceso de pago
    setTimeout(() => {
        console.log('Suscripción procesada:', {
            plan: plan.name,
            price: plan.price,
            date: new Date().toISOString()
        });
        
        closePlanModal();
        showNotification(`¡Bienvenido al ${plan.name}! Tu suscripción está activa.`, 'success');
        
        // Resetear botón
        confirmPlan.disabled = false;
        confirmPlan.textContent = 'Confirmar Suscripción';
        
        // Actualizar UI para mostrar plan activo
        updateActivePlan(selectedPlan);
    }, 2000);
}

function updateActivePlan(planType) {
    // Aquí puedes actualizar la UI para mostrar el plan activo
    const planCard = document.querySelector(`[data-plan="${planType}"]`).closest('.plan-card');
    
    // Agregar badge de "Plan Actual"
    if (!planCard.querySelector('.current-plan-badge')) {
        const badge = document.createElement('div');
        badge.className = 'current-plan-badge';
        badge.innerHTML = '<i class="bx bx-check-circle"></i> Plan Actual';
        badge.style.cssText = `
            position: absolute;
            top: 12px;
            left: 12px;
            background: #28a745;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        planCard.appendChild(badge);
        
        // Cambiar texto del botón
        const button = planCard.querySelector('.btn-plan');
        button.textContent = 'Plan Actual';
        button.disabled = true;
        button.style.opacity = '0.7';
    }
}

// ===================================
// FAQ ACCORDION
// ===================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Cerrar todas las preguntas
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Abrir la pregunta clickeada si no estaba activa
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

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
// CARD NUMBER FORMATTING
// ===================================

const cardNumberInput = document.querySelector('input[placeholder*="1234"]');

if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g);
        e.target.value = formattedValue ? formattedValue.join(' ') : '';
    });
}

// Expiry date formatting
const expiryInput = document.querySelector('input[placeholder*="MM/AA"]');

if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // ESC para cerrar modal
    if (e.key === 'Escape' && planModal.classList.contains('show')) {
        closePlanModal();
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
// PLAN COMPARISON HIGHLIGHT
// ===================================

const comparisonRows = document.querySelectorAll('.comparison-row:not(.comparison-header)');

comparisonRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(60, 145, 230, 0.05)';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.background = '';
    });
});

// ===================================
// SCROLL TO SECTION
// ===================================

function scrollToSection(sectionClass) {
    const section = document.querySelector(`.${sectionClass}`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Agregar botones de navegación rápida si es necesario
const quickNavButtons = [
    { text: 'Ver Planes', target: 'plans-grid' },
    { text: 'Comparar', target: 'comparison-section' },
    { text: 'FAQ', target: 'faq-section' }
];

// ===================================
// ANALYTICS & TRACKING
// ===================================

function trackPlanSelection(planName) {
    console.log(`[Analytics] Usuario seleccionó: ${planName}`);
    // Aquí puedes agregar código para enviar a Google Analytics, Mixpanel, etc.
}

function trackPlanSubscription(planName, price) {
    console.log(`[Analytics] Suscripción completada:`, {
        plan: planName,
        price: price,
        timestamp: new Date().toISOString()
    });
    // Aquí puedes agregar código para tracking de conversiones
}

// ===================================
// LOAD CURRENT PLAN (if any)
// ===================================

function loadCurrentPlan() {
    const currentPlan = localStorage.getItem('currentPlan');
    
    if (currentPlan) {
        console.log('Plan actual del usuario:', currentPlan);
        updateActivePlan(currentPlan);
    }
}

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de planes inicializado correctamente');
    
    // Cargar plan actual si existe
    loadCurrentPlan();
    
    // Agregar smooth scroll a todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    console.log('Atajos de teclado disponibles:');
    console.log('- Ctrl/Cmd + K: Buscar');
    console.log('- ESC: Cerrar modal');
});