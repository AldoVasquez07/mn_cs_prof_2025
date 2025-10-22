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
        // Obtener datos de la fila
        const consultor = this.cells[0].textContent;
        const mensaje = this.cells[1].textContent;
        const fecha = this.cells[3].textContent;
        const isManaged = this.getAttribute('data-managed') === 'true';
        
        console.log('Mensaje seleccionado:', {
            consultor: consultor,
            mensaje: mensaje,
            fecha: fecha,
            gestionado: isManaged
        });
        
        // Aquí puedes abrir un modal o redirigir a la vista de detalle del mensaje
        openMessageDetail(consultor, mensaje, fecha, isManaged);
    });
});

// Función para abrir detalle del mensaje (ejemplo)
function openMessageDetail(consultor, mensaje, fecha, isManaged) {
    // Esta función puede abrir un modal o redirigir a otra página
    const action = isManaged ? 'Ver conversación' : 'Gestionar mensaje';
    
    alert(`${action}\n\nConsultor: ${consultor}\nMensaje: ${mensaje}\nFecha: ${fecha}`);
    
    // Si es no gestionado, podrías marcarlo como gestionado
    if (!isManaged) {
        // Aquí puedes agregar lógica para marcar como gestionado
        console.log('Mensaje marcado para gestión');
    }
}

// Función para mover mensaje de no gestionado a gestionado
function markAsManaged(messageRow) {
    messageRow.setAttribute('data-managed', 'true');
    messageRow.style.opacity = '0.8';
    
    // Mover la fila a la tabla de gestionados
    const gestionadosTable = document.querySelectorAll('.messages-table')[1];
    if (gestionadosTable) {
        const tbody = gestionadosTable.querySelector('tbody');
        tbody.insertBefore(messageRow, tbody.firstChild);
    }
}

// Contador de mensajes no gestionados
function updateUnmanagedCount() {
    const unmanagedRows = document.querySelectorAll('.message-row[data-managed="false"]');
    const count = unmanagedRows.length;
    
    // Actualizar título si existe un contador
    const noGestionadosTitle = document.querySelector('.messages-section:first-of-type .section-title');
    if (noGestionadosTitle) {
        const baseText = 'No Gestionados';
        noGestionadosTitle.textContent = count > 0 ? `${baseText} (${count})` : baseText;
    }
    
    return count;
}

// Inicializar contador
updateUnmanagedCount();

// Actualizar contador cada vez que cambia el DOM
const observer = new MutationObserver(function() {
    updateUnmanagedCount();
});

const tablesContainer = document.querySelector('.bandeja-container');
if (tablesContainer) {
    observer.observe(tablesContainer, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['data-managed']
    });
}

// Marcar mensaje como leído al hacer hover (opcional)
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