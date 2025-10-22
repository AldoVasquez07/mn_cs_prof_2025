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

// Funcionalidad de ordenamiento de tabla
const tableHeaders = document.querySelectorAll('.clientes-table th');
let currentSort = { column: null, ascending: true };

tableHeaders.forEach((header, index) => {
    header.addEventListener('click', function () {
        sortTable(index);
        updateSortIcons(index);
    });
});

function sortTable(columnIndex) {
    const table = document.querySelector('.clientes-table tbody');
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // Determinar dirección del sort
    const isAscending = currentSort.column === columnIndex ? !currentSort.ascending : true;
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Intentar comparar como números si es posible
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        // Comparar como strings
        return isAscending 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
    });
    
    // Actualizar la tabla
    rows.forEach(row => table.appendChild(row));
    
    // Actualizar estado del sort
    currentSort = { column: columnIndex, ascending: isAscending };
}

function updateSortIcons(activeColumn) {
    tableHeaders.forEach((header, index) => {
        const icon = header.querySelector('i');
        if (icon) {
            if (index === activeColumn) {
                icon.style.color = '#4AA3D1';
                if (currentSort.ascending) {
                    icon.classList.remove('bx-sort-alt-2', 'bx-sort-down');
                    icon.classList.add('bx-sort-up');
                } else {
                    icon.classList.remove('bx-sort-alt-2', 'bx-sort-up');
                    icon.classList.add('bx-sort-down');
                }
            } else {
                icon.style.color = '#999';
                icon.classList.remove('bx-sort-up', 'bx-sort-down');
                icon.classList.add('bx-sort-alt-2');
            }
        }
    });
}

// Funcionalidad del botón Importar Clientes
const btnImportar = document.querySelector('.btn-importar');
if (btnImportar) {
    btnImportar.addEventListener('click', function () {
        // Aquí puedes agregar la lógica para importar clientes
        console.log('Importar clientes clicked');
        alert('Funcionalidad de importar clientes');
    });
}

// Funcionalidad del botón Agregar Cliente
const btnAgregar = document.querySelector('.btn-agregar');
if (btnAgregar) {
    btnAgregar.addEventListener('click', function () {
        // Aquí puedes agregar la lógica para agregar un cliente
        console.log('Agregar cliente clicked');
        alert('Funcionalidad de agregar cliente');
    });
}

// Funcionalidad de búsqueda en la tabla
const searchInput = document.querySelector('#content nav form input[type="search"]');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('.clientes-table tbody tr');
        
        tableRows.forEach(row => {
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

// Enlaces de "Agregar email"
const emailLinks = document.querySelectorAll('.link-email');
emailLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const row = this.closest('tr');
        const clientName = row.cells[0].textContent;
        console.log('Agregar email para:', clientName);
        alert(`Agregar email para ${clientName}`);
    });
});

// Enlaces de "Crear cita"
const citaLinks = document.querySelectorAll('.link-cita');
citaLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const row = this.closest('tr');
        const clientName = row.cells[0].textContent;
        console.log('Crear cita para:', clientName);
        alert(`Crear cita para ${clientName}`);
    });
});