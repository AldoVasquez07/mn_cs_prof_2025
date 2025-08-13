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

// Input animations
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
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