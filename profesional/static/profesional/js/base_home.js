// Activar/desactivar items del menú lateral
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function (e) {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});

// Ajustar sidebar según el tamaño de pantalla
function adjustSidebar() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hide');
    } else {
        sidebar.classList.remove('hide');
    }
}

window.addEventListener('load', adjustSidebar);
window.addEventListener('resize', adjustSidebar);

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

// Funcionalidad de selección de clientes
const clientButtons = document.querySelectorAll('.btn-select-client');

clientButtons.forEach(button => {
    button.addEventListener('click', function () {
        this.classList.toggle('selected');
        
        // Cambiar el icono
        const icon = this.querySelector('i');
        if (this.classList.contains('selected')) {
            icon.classList.remove('bx-plus');
            icon.classList.add('bx-check');
        } else {
            icon.classList.remove('bx-check');
            icon.classList.add('bx-plus');
        }
    });
});

// Funcionalidad del botón "Enviar mensaje"
const btnSendMessage = document.querySelector('.btn-send-message');
const messageInput = document.querySelector('.message-input');

if (btnSendMessage && messageInput) {
    btnSendMessage.addEventListener('click', function () {
        const message = messageInput.value.trim();
        const selectedClients = document.querySelectorAll('.btn-select-client.selected');
        
        if (message === '') {
            alert('Por favor, escribe un mensaje.');
            return;
        }
        
        if (selectedClients.length === 0) {
            alert('Por favor, selecciona al menos un cliente.');
            return;
        }
        
        // Aquí puedes agregar la lógica para enviar el mensaje
        console.log('Mensaje:', message);
        console.log('Clientes seleccionados:', selectedClients.length);
        
        // Ejemplo de confirmación
        alert(`Mensaje enviado a ${selectedClients.length} cliente(s)`);
        
        // Limpiar el textarea después de enviar
        messageInput.value = '';
    });
}