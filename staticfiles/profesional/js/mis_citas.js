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
// FILTERS FUNCTIONALITY
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const appointmentRows = document.querySelectorAll('.appointment-row');
const emptyState = document.getElementById('emptyState');
const tableWrapper = document.querySelector('.table-wrapper');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value from URL
        const url = new URL(this.href);
        const filterValue = url.searchParams.get('filtro') || 'todas';
        
        // Filter appointments
        filterAppointments(filterValue);
    });
});

function filterAppointments(filter) {
    let visibleCount = 0;
    
    appointmentRows.forEach(row => {
        const status = row.dataset.status;
        
        if (filter === 'todas') {
            row.style.display = '';
            visibleCount++;
        } else if (filter === 'proximas' && (status === 'pendiente' || status === 'confirmada')) {
            row.style.display = '';
            visibleCount++;
        } else if (filter === 'completadas' && status === 'completada') {
            row.style.display = '';
            visibleCount++;
        } else if (filter === 'canceladas' && status === 'cancelada') {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        tableWrapper.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tableWrapper.style.display = 'block';
        emptyState.style.display = 'none';
    }
    
    // Reset pagination
    currentPage = 1;
    updatePagination();
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

const searchInput = document.querySelector('#content nav form input[type="search"]');

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCount = 0;
        
        appointmentRows.forEach(row => {
            const clientName = row.querySelector('.professional-info span').textContent.toLowerCase();
            const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';
            
            if (clientName.includes(searchTerm) || status.includes(searchTerm)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Show/hide empty state
        if (visibleCount === 0) {
            tableWrapper.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            tableWrapper.style.display = 'block';
            emptyState.style.display = 'none';
        }
        
        // Reset pagination
        currentPage = 1;
        updatePagination();
    });
}

// ===================================
// MODAL DETAILS
// ===================================

const detailsModal = document.getElementById('detailsModal');
const closeDetails = document.getElementById('closeDetails');
const viewButtons = document.querySelectorAll('.btn-view');
let currentAppointmentData = null;

viewButtons.forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        showAppointmentDetails(row);
    });
});

function showAppointmentDetails(row) {
    const cells = row.querySelectorAll('td');
    
    const clientName = cells[1].querySelector('.professional-info span').textContent;
    const typeElement = cells[2].querySelector('.appointment-type');
    const type = typeElement.textContent.trim();
    const address = cells[3].querySelector('.address-text').textContent;
    const date = cells[4].querySelector('.date').textContent;
    const time = cells[4].querySelector('.time').textContent;
    const statusElement = cells[5].querySelector('.status-badge');
    const status = statusElement.textContent.trim();
    const statusClass = statusElement.className.split(' ').pop();
    
    // Populate modal
    document.getElementById('detailClient').textContent = clientName;
    document.getElementById('detailType').textContent = type;
    document.getElementById('detailAddress').textContent = address;
    document.getElementById('detailDateTime').textContent = `${date} - ${time}`;
    document.getElementById('detailReason').textContent = 'Sin motivo especificado';
    
    const statusBadge = document.querySelector('#detailStatus .status-badge');
    statusBadge.className = `status-badge ${statusClass}`;
    statusBadge.innerHTML = statusElement.innerHTML;
    
    // Show join meeting button only for online appointments
    const joinMeetingBtn = document.getElementById('joinMeeting');
    if (type.includes('ONLINE')) {
        joinMeetingBtn.style.display = 'flex';
    } else {
        joinMeetingBtn.style.display = 'none';
    }
    
    currentAppointmentData = { clientName, type, address, date, time, status };
    
    detailsModal.classList.add('show');
}

if (closeDetails) {
    closeDetails.addEventListener('click', function() {
        detailsModal.classList.remove('show');
    });
}

// Join Meeting Button
const joinMeetingBtn = document.getElementById('joinMeeting');
if (joinMeetingBtn) {
    joinMeetingBtn.addEventListener('click', function() {
        showNotification('Abriendo sala de videoconsulta...', 'info');
        // Aquí iría la lógica para abrir la videollamada
        setTimeout(() => {
            window.open('#', '_blank'); // Simulación
        }, 1000);
    });
}

// ===================================
// MODAL CANCEL
// ===================================

const cancelModal = document.getElementById('cancelModal');
const closeCancel = document.getElementById('closeCancel');
const cancelCancelBtn = document.getElementById('cancelCancelBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const cancelButtons = document.querySelectorAll('.btn-cancel');
let currentRowToCancel = null;

cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
        currentRowToCancel = this.closest('tr');
        cancelModal.classList.add('show');
    });
});

if (closeCancel) {
    closeCancel.addEventListener('click', closeCancelModal);
}

if (cancelCancelBtn) {
    cancelCancelBtn.addEventListener('click', closeCancelModal);
}

function closeCancelModal() {
    cancelModal.classList.remove('show');
    document.getElementById('cancelReason').value = '';
    currentRowToCancel = null;
}

if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', function() {
        if (currentRowToCancel) {
            const reason = document.getElementById('cancelReason').value;
            cancelAppointment(currentRowToCancel, reason);
        }
    });
}

function cancelAppointment(row, reason) {
    const appointmentId = row.querySelector('.btn-cancel').dataset.id;
    
    // Simular cancelación
    console.log('Cancelando cita...', {
        id: appointmentId,
        client: row.querySelector('.professional-info span').textContent,
        reason: reason,
        timestamp: new Date().toISOString()
    });
    
    // Cambiar estado de la fila
    row.dataset.status = 'cancelada';
    
    // Actualizar badge de estado
    const statusCell = row.querySelectorAll('td')[5];
    statusCell.innerHTML = `
        <span class="status-badge cancelada">
            <i class='bx bx-x-circle'></i> Cancelada
        </span>
    `;
    
    // Agregar clase visual de cancelada
    row.style.opacity = '0.6';
    
    // Deshabilitar botones de acción
    const actionButtons = row.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        if (btn.classList.contains('btn-cancel')) {
            btn.remove();
        }
    });
    
    closeCancelModal();
    showNotification('Cita cancelada exitosamente', 'success');
}

// ===================================
// PAGINATION
// ===================================

let currentPage = 1;
const rowsPerPage = 10;
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

function updatePagination() {
    const visibleRows = Array.from(appointmentRows).filter(row => row.style.display !== 'none');
    const totalPages = Math.ceil(visibleRows.length / rowsPerPage);
    
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages || 1;
    
    // Enable/disable buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Show/hide rows based on current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    visibleRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', function() {
        const visibleRows = Array.from(appointmentRows).filter(row => row.style.display !== 'none');
        const totalPages = Math.ceil(visibleRows.length / rowsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });
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
// CLOSE MODALS ON CLICK OUTSIDE
// ===================================

if (detailsModal) {
    detailsModal.addEventListener('click', function(e) {
        if (e.target === detailsModal) {
            detailsModal.classList.remove('show');
        }
    });
}

if (cancelModal) {
    cancelModal.addEventListener('click', function(e) {
        if (e.target === cancelModal) {
            closeCancelModal();
        }
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // ESC para cerrar modales
    if (e.key === 'Escape') {
        if (detailsModal.classList.contains('show')) {
            detailsModal.classList.remove('show');
        }
        if (cancelModal.classList.contains('show')) {
            closeCancelModal();
        }
    }
    
    // Ctrl/Cmd + K para enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// ===================================
// SORTING FUNCTIONALITY
// ===================================

const tableHeaders = document.querySelectorAll('.appointments-table thead th');

tableHeaders.forEach((header, index) => {
    if (index > 0 && index < 6) { // Skip No. and Actions columns
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            sortTable(index);
        });
    }
});

function sortTable(columnIndex) {
    const tbody = document.querySelector('.appointments-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        return aValue.localeCompare(bValue);
    });
    
    // Reappend sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de citas del profesional inicializado correctamente');
    
    // Inicializar paginación
    updatePagination();
    
    console.log('Atajos de teclado disponibles:');
    console.log('- Ctrl/Cmd + K: Buscar');
    console.log('- ESC: Cerrar modales');
});