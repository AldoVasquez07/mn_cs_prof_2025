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

// Prevenir submit del formulario de búsqueda
if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });
}

// ===================================
// FUNCIONALIDAD DE BÚSQUEDA
// ===================================
const searchInput = document.querySelector('#content nav form input[type="search"]');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const messageCards = document.querySelectorAll('.message-card');
        
        messageCards.forEach(card => {
            const professionalName = card.querySelector('.professional-name').textContent.toLowerCase();
            const specialty = card.querySelector('.professional-specialty').textContent.toLowerCase();
            const message = card.querySelector('.message-preview').textContent.toLowerCase();
            
            const matchesSearch = professionalName.includes(searchTerm) || 
                                specialty.includes(searchTerm) || 
                                message.includes(searchTerm);
            
            if (matchesSearch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ===================================
// MODAL NUEVO MENSAJE
// ===================================
const btnNuevoMensaje = document.querySelector('.btn-nuevo-mensaje');
const modal = document.getElementById('nuevoMensajeModal');
const closeModalBtn = document.querySelector('.close-modal');
const btnCancel = document.querySelector('.btn-cancel');
const nuevoMensajeForm = document.getElementById('nuevoMensajeForm');

// Abrir modal
if (btnNuevoMensaje && modal) {
    btnNuevoMensaje.addEventListener('click', function () {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Evitar scroll del body
    });
}

// Cerrar modal
function closeModal() {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaurar scroll del body
        if (nuevoMensajeForm) {
            nuevoMensajeForm.reset();
        }
    }
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (btnCancel) {
    btnCancel.addEventListener('click', closeModal);
}

// Cerrar modal al hacer clic fuera
if (modal) {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
        closeModal();
    }
});

// Enviar nuevo mensaje
if (nuevoMensajeForm) {
    nuevoMensajeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const profesional = formData.get('profesional');
        const mensaje = formData.get('mensaje');
        
        if (!profesional || !mensaje.trim()) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        console.log('Enviando mensaje:', {
            profesional: profesional,
            mensaje: mensaje
        });
        
        // Aquí puedes agregar la lógica para enviar el mensaje al backend
        // Por ejemplo, usando fetch o AJAX
        
        alert('Mensaje enviado correctamente');
        closeModal();
    });
}

// ===================================
// FUNCIONALIDAD DE BOTONES
// ===================================

// Botones "Responder"
const btnReplyAll = document.querySelectorAll('.btn-reply');
btnReplyAll.forEach(btn => {
    btn.addEventListener('click', function () {
        const messageCard = this.closest('.message-card');
        const messageId = messageCard.getAttribute('data-id');
        const professionalName = messageCard.querySelector('.professional-name').textContent;
        
        console.log('Responder mensaje:', {
            messageId: messageId,
            professional: professionalName
        });
        
        // Abrir modal con el profesional pre-seleccionado
        if (modal && nuevoMensajeForm) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Pre-seleccionar el profesional (si existe en el select)
            const selectProfesional = nuevoMensajeForm.querySelector('select[name="profesional"]');
            if (selectProfesional) {
                // Buscar la opción que coincida con el nombre
                const options = selectProfesional.querySelectorAll('option');
                options.forEach(option => {
                    if (option.textContent.includes(professionalName)) {
                        option.selected = true;
                    }
                });
            }
        }
    });
});

// Botones "Ver conversación completa"
const btnViewMoreAll = document.querySelectorAll('.btn-view-more');
btnViewMoreAll.forEach(btn => {
    btn.addEventListener('click', function () {
        const messageCard = this.closest('.message-card');
        const messageId = messageCard.getAttribute('data-id');
        const professionalName = messageCard.querySelector('.professional-name').textContent;
        
        console.log('Ver conversación completa:', {
            messageId: messageId,
            professional: professionalName
        });
        
        // Marcar como leído
        if (messageCard.classList.contains('unread')) {
            markAsRead(messageCard);
        }
        
        // Aquí puedes redirigir a la vista de conversación completa
        // window.location.href = `/mensajes/${messageId}/`;
        alert(`Ver conversación completa con ${professionalName}`);
    });
});

// ===================================
// MARCAR MENSAJE COMO LEÍDO
// ===================================
function markAsRead(messageCard) {
    messageCard.classList.remove('unread');
    
    // Remover el badge de no leído
    const unreadBadge = messageCard.querySelector('.unread-badge');
    if (unreadBadge) {
        unreadBadge.style.display = 'none';
    }
    
    // Aquí puedes agregar lógica para actualizar el estado en el backend
    const messageId = messageCard.getAttribute('data-id');
    console.log('Mensaje marcado como leído:', messageId);
    
    // Actualizar contador de mensajes no leídos
    updateUnreadCount();
}

// Click en la tarjeta completa para marcar como leído
const messageCards = document.querySelectorAll('.message-card');
messageCards.forEach(card => {
    card.addEventListener('click', function (e) {
        // No marcar como leído si se hace click en un botón
        if (e.target.closest('button')) {
            return;
        }
        
        if (this.classList.contains('unread')) {
            markAsRead(this);
        }
    });
});

// ===================================
// CONTADOR DE MENSAJES NO LEÍDOS
// ===================================
function updateUnreadCount() {
    const unreadMessages = document.querySelectorAll('.message-card.unread');
    const count = unreadMessages.length;
    
    console.log('Mensajes no leídos:', count);
    
    // Actualizar badge en el sidebar (si existe)
    const sidebarBadge = document.querySelector('.sidebar-unread-badge');
    if (sidebarBadge) {
        if (count > 0) {
            sidebarBadge.textContent = count;
            sidebarBadge.style.display = 'flex';
        } else {
            sidebarBadge.style.display = 'none';
        }
    }
    
    return count;
}

// Inicializar contador
updateUnreadCount();

// ===================================
// ANIMACIONES Y EFECTOS
// ===================================

// Animación de entrada para las tarjetas
function animateMessageCards() {
    const cards = document.querySelectorAll('.message-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Ejecutar animación al cargar la página
document.addEventListener('DOMContentLoaded', animateMessageCards);

// ===================================
// FILTROS Y ORDENAMIENTO
// ===================================

// Función para filtrar por estado (leído/no leído)
function filterByStatus(status) {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
        if (status === 'all') {
            card.style.display = '';
        } else if (status === 'unread') {
            card.style.display = card.classList.contains('unread') ? '' : 'none';
        } else if (status === 'read') {
            card.style.display = card.classList.contains('unread') ? 'none' : '';
        }
    });
}

// Función para ordenar mensajes por fecha
function sortByDate(order = 'desc') {
    const container = document.querySelector('.messages-container');
    const cards = Array.from(document.querySelectorAll('.message-card'));
    
    cards.sort((a, b) => {
        // Aquí deberías usar la fecha real del mensaje
        // Por ahora usamos el data-id como referencia
        const idA = parseInt(a.getAttribute('data-id'));
        const idB = parseInt(b.getAttribute('data-id'));
        
        return order === 'desc' ? idB - idA : idA - idB;
    });
    
    cards.forEach(card => container.appendChild(card));
}

// Exponer funciones para uso externo
window.mensajesApp = {
    filterByStatus: filterByStatus,
    sortByDate: sortByDate,
    updateUnreadCount: updateUnreadCount,
    markAsRead: markAsRead
};