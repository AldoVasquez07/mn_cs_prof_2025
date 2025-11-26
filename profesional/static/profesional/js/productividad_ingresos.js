(function() {
'use strict';

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
// CHART.JS CONFIGURATION
// ===================================

// Obtener datos del script JSON desde Django
let chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    eficiencia: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ingresos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

// Cargar datos desde Django
const chartDataElement = document.getElementById('chart-data');
if (chartDataElement) {
    try {
        const djangoData = JSON.parse(chartDataElement.textContent);
        if (djangoData && djangoData.labels && djangoData.eficiencia && djangoData.ingresos) {
            chartData = djangoData;
        }
    } catch (e) {
        console.log('Error al cargar datos de la gráfica');
    }
}

// Configuración de la gráfica
const ctx = document.getElementById('eficienciaChart');

if (ctx) {
    const eficienciaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Eficiencia',
                    data: chartData.eficiencia,
                    borderColor: '#2C3E50',
                    backgroundColor: 'rgba(44, 62, 80, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#2C3E50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#2C3E50',
                    pointHoverBorderColor: '#fff'
                },
                {
                    label: 'Ingresos',
                    data: chartData.ingresos,
                    borderColor: '#FDB913',
                    backgroundColor: 'rgba(253, 185, 19, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#FDB913',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#FDB913',
                    pointHoverBorderColor: '#fff'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2,
                        font: {
                            size: 12
                        },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#666',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Actualizar gráfica cuando cambia el tamaño de ventana
    window.addEventListener('resize', function() {
        eficienciaChart.resize();
    });
}

// ===================================
// ANIMACIÓN DE NÚMEROS
// ===================================

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        if (element.textContent.includes('%')) {
            element.textContent = Math.floor(progress * (end - start) + start) + '%';
        } else {
            element.textContent = Math.floor(progress * (end - start) + start);
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animar números cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number-large, .stat-value-item .stat-number');
    
    statNumbers.forEach(element => {
        const finalValue = parseInt(element.textContent);
        if (!isNaN(finalValue)) {
            element.textContent = '0';
            setTimeout(() => {
                animateValue(element, 0, finalValue, 1500);
            }, 200);
        }
    });
});

})();