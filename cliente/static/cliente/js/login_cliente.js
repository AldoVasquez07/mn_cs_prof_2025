const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const backToLoginBtn = document.getElementById('backToLogin');
const successText = document.getElementById('successText');

// Form switching animation
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

// Event listeners for form switching
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForms(loginForm, registerForm);
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForms(registerForm, loginForm);
});

backToLoginBtn.addEventListener('click', () => {
    switchForms(successMessage, loginForm);
});

// Form submission handlers
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn');
        const btnText = btn.querySelector('.btn-text');
        const isLogin = form.closest('#loginForm') !== null;

        // Add loading state
        btnText.innerHTML = '<div class="loading"></div>Procesando...';
        btn.disabled = true;

        setTimeout(() => {
            // Reset button
            btnText.textContent = isLogin ? 'Iniciar Sesión' : 'Crear Cuenta';
            btn.disabled = false;

            // Show success message
            successText.textContent = isLogin
                ? 'Has iniciado sesión correctamente.'
                : 'Tu cuenta ha sido creada exitosamente.';

            switchForms(isLogin ? loginForm : registerForm, successMessage);

            // Reset form
            form.reset();
        }, 2000);
    });
});

// Input animations
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

// Add floating animation to card on mouse move
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

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!registerForm.classList.contains('hidden')) {
            switchForms(registerForm, loginForm);
        }
        if (!successMessage.classList.contains('hidden')) {
            switchForms(successMessage, loginForm);
        }
    }
});