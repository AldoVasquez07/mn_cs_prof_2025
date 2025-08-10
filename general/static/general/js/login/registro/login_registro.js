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

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchForms(registerForm, registerForm);
    });
}

backToLoginBtn.addEventListener('click', () => {
    switchForms(successMessage, registerForm);
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

