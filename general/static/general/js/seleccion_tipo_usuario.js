// Botones de navegación
const backButton = document.querySelector('.back-button');
const loginButton = document.querySelector('.login-button');

backButton.addEventListener('click', function () {
    this.style.transform = 'translateY(2px) scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);

    console.log('Navegando hacia atrás...');
});

loginButton.addEventListener('click', function () {
    this.style.transform = 'translateY(2px) scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);

    console.log('Redirigiendo a login...');
});

const cards = document.querySelectorAll('.card');
let selectedCard = null;

cards.forEach(card => {
    card.addEventListener('click', function () {
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }

        this.classList.add('selected');
        selectedCard = this;

        createParticles(this);

        cards.forEach(otherCard => {
            if (otherCard !== this) {
                otherCard.style.transform = 'translateY(5px) scale(0.98)';
                setTimeout(() => {
                    otherCard.style.transform = '';
                }, 200);
            }
        });
    });

    // Efecto hover mejorado
    card.addEventListener('mouseenter', function () {
        if (this !== selectedCard) {
            this.style.transform = 'translateY(-15px) scale(1.05)';
        }
    });

    card.addEventListener('mouseleave', function () {
        if (this !== selectedCard) {
            this.style.transform = '';
        }
    });
});

// Crear partículas
function createParticles(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const angle = (Math.PI * 2 * i) / 8;
            const distance = 30 + Math.random() * 20;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;

            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.animationDelay = Math.random() * 0.5 + 's';

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 3000);
        }, i * 50);
    }
}

// Efecto de mouse trail sutil
let mouseTrail = [];
document.addEventListener('mousemove', function (e) {
    if (mouseTrail.length > 5) {
        mouseTrail.shift();
    }

    mouseTrail.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
    });
});

// Animación inicial mejorada
window.addEventListener('load', function () {
    // Crear elementos de fondo adicionales
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.style.position = 'absolute';
            bubble.style.width = Math.random() * 100 + 50 + 'px';
            bubble.style.height = bubble.style.width;
            bubble.style.borderRadius = '50%';
            bubble.style.background = 'rgba(61, 161, 198, 0.05)';
            bubble.style.left = Math.random() * window.innerWidth + 'px';
            bubble.style.top = Math.random() * window.innerHeight + 'px';
            bubble.style.animation = `float ${6 + Math.random() * 4}s ease-in-out infinite`;
            bubble.style.pointerEvents = 'none';
            bubble.style.zIndex = '0';

            document.body.appendChild(bubble);
        }, i * 1000);
    }
});