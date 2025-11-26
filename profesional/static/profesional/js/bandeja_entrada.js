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

// Funcionalidad de búsqueda en las tablas
const searchInput = document.querySelector('#content nav form input[type="search"]');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const allRows = document.querySelectorAll('.messages-table tbody tr');
        
        allRows.forEach(row => {
            // Evitar aplicar búsqueda en filas vacías (mensajes de "sin datos")
            if (row.cells.length === 1) return;
            
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Prevenir submit del formulario de búsqueda
if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });
}

// Click en filas de mensajes
const messageRows = document.querySelectorAll('.message-row');

messageRows.forEach(row => {
    row.addEventListener('click', function () {
        const relacionId = this.getAttribute('data-relacion-id');
        const isManaged = this.getAttribute('data-managed') === 'true';
        
        if (relacionId) {
            // Redirigir a la vista de chat/conversación con el cliente
            // Ajusta esta URL según tu configuración de URLs
            window.location.href = `/profesional/chat/${relacionId}/`;
        }
    });
});

// Marcar mensaje como leído al hacer hover
messageRows.forEach(row => {
    row.addEventListener('mouseenter', function () {
        if (this.getAttribute('data-managed') === 'false') {
            this.style.borderLeft = '4px solid #4AA3D1';
        }
    });
    
    row.addEventListener('mouseleave', function () {
        this.style.borderLeft = '';
    });
});

// Keyboard navigation
let currentRowIndex = -1;
const allMessageRows = Array.from(messageRows);

document.addEventListener('keydown', function (e) {
    // Solo si no hay elementos de formulario en foco
    if (document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA') {
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentRowIndex = Math.min(currentRowIndex + 1, allMessageRows.length - 1);
            highlightRow(currentRowIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentRowIndex = Math.max(currentRowIndex - 1, 0);
            highlightRow(currentRowIndex);
        } else if (e.key === 'Enter' && currentRowIndex >= 0) {
            e.preventDefault();
            allMessageRows[currentRowIndex].click();
        }
    }
});

function highlightRow(index) {
    // Remover highlight previo
    allMessageRows.forEach(row => row.style.outline = '');
    
    // Agregar highlight a la fila actual
    if (allMessageRows[index]) {
        allMessageRows[index].style.outline = '2px solid #4AA3D1';
        allMessageRows[index].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// Actualizar contador de mensajes no gestionados en el título
function updateUnmanagedCount() {
    const unmanagedRows = document.querySelectorAll('.message-row[data-managed="false"]');
    const count = unmanagedRows.length;
    
    // Actualizar título si existe un contador
    const noGestionadosTitle = document.querySelector('.messages-section:first-of-type .section-title');
    if (noGestionadosTitle && !noGestionadosTitle.querySelector('.badge-count')) {
        const baseText = noGestionadosTitle.textContent.trim();
        if (count > 0) {
            noGestionadosTitle.innerHTML = `${baseText} <span class="badge-count">(${count})</span>`;
        }
    }
    
    return count;
}

// Inicializar contador al cargar
document.addEventListener('DOMContentLoaded', function() {
    updateUnmanagedCount();
});