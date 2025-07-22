const registerForm = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');
const showLoginLink = document.getElementById('showLogin'); // botón "¿Ya tienes cuenta?"
const backToLoginBtn = document.getElementById('backToLogin');
const successText = document.getElementById('successText');

// Función para cambiar de formulario con animación
function switchForms(hideForm, showForm) {
    hideForm.classList.add('slide-out');

    setTimeout(() => {
        hideForm.classList.add('hidden');
        hideForm.classList.remove('slide-out');

        showForm.classList.remove('hidden');
        showForm.classList.add('slide-in');

        setTimeout(() => {
            showForm.classList.remove('slide-in');
        }, 600);
    }, 300);
}

// Evento para "¿Ya tienes cuenta?" (opcional, recarga el formulario)
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchForms(registerForm, registerForm); // No hay login, solo recarga animación
    });
}

// Botón de volver desde mensaje de éxito
backToLoginBtn.addEventListener('click', () => {
    switchForms(successMessage, registerForm);
});

// Envío del formulario de registro
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn');
        const btnText = btn.querySelector('.btn-text');

        // Estado cargando
        btnText.innerHTML = '<div class="loading"></div>Procesando...';
        btn.disabled = true;

        setTimeout(() => {
            // Restaurar botón
            btnText.textContent = 'Crear Cuenta';
            btn.disabled = false;

            // Mostrar mensaje de éxito
            successText.textContent = 'Tu cuenta ha sido creada exitosamente.';
            switchForms(registerForm, successMessage);

            // Limpiar formulario
            form.reset();
        }, 2000);
    });
});

// Animaciones de inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

// Efecto flotante en la tarjeta
document.addEventListener('mousemove', (e) => {
    const card = document.querySelector('.card');
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `translateY(-10px) rotateX(${y / 20}deg) rotateY(${x / 20}deg)`;
});

document.addEventListener('mouseleave', () => {
    const card = document.querySelector('.card');
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
});

// Tecla ESC para volver desde el mensaje de éxito
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!successMessage.classList.contains('hidden')) {
            switchForms(successMessage, registerForm);
        }
    }
});
