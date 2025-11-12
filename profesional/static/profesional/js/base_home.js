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


// Profile Menu Toggle - Click en todo el contenedor
const profileContainer = document.querySelector('.profile-container');
const profileMenu = document.querySelector('.profile-menu');

if (profileContainer && profileMenu) {
    profileContainer.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        profileMenu.classList.toggle('show');
    });
}

// Cerrar menú de perfil al hacer clic fuera
window.addEventListener('click', function (e) {
    if (!e.target.closest('.profile-container')) {
        if (profileMenu) {
            profileMenu.classList.remove('show');
        }
    }
});

// Dark Mode Switch (si lo usas)
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