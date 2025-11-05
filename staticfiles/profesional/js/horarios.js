// ===================================
// CONFIGURACIÓN INICIAL
// ===================================
let currentDate = new Date();
let selectedDate = new Date();
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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
// CALENDARIO FUNCIONES
// ===================================

function renderMiniCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Actualizar título del mes
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${months[month]} ${year}`;
    }

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    // Ajustar para que Lunes sea el primer día (0)
    const firstDayIndex = (firstDay.getDay() + 6) % 7;
    const lastDayDate = lastDay.getDate();
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - ((firstDayIndex + lastDayDate) % 7);

    let days = '';

    // Días del mes anterior
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="calendar-day other-month">${prevLastDayDate - x + 1}</div>`;
    }

    // Días del mes actual
    const today = new Date();
    for (let i = 1; i <= lastDayDate; i++) {
        const isToday = i === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
        
        const isSelected = i === selectedDate.getDate() && 
                          month === selectedDate.getMonth() && 
                          year === selectedDate.getFullYear();
        
        const hasEvent = Math.random() > 0.7; // Simulación de eventos
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';
        if (hasEvent) classes += ' has-event';
        
        days += `<div class="${classes}" data-date="${year}-${month + 1}-${i}">${i}</div>`;
    }

    // Días del siguiente mes
    for (let j = 1; j <= nextDays && nextDays < 7; j++) {
        days += `<div class="calendar-day other-month">${j}</div>`;
    }

    calendarDays.innerHTML = days;
    
    // Agregar event listeners a los días
    document.querySelectorAll('.calendar-day:not(.other-month)').forEach(day => {
        day.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            if (dateStr) {
                const [year, month, date] = dateStr.split('-');
                selectedDate = new Date(year, month - 1, date);
                renderMiniCalendar();
                updateWeekView();
            }
        });
    });
}

function updateWeekView() {
    // Calcular el rango de la semana
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5); // Mostrar hasta sábado
    
    const weekRangeElement = document.getElementById('weekRange');
    if (weekRangeElement) {
        const startDay = startOfWeek.getDate();
        const endDay = endOfWeek.getDate();
        const monthName = months[startOfWeek.getMonth()].toLowerCase();
        const year = startOfWeek.getFullYear();
        
        weekRangeElement.textContent = `${String(startDay).padStart(2, '0')} - ${String(endDay).padStart(2, '0')} ${monthName}, ${year}`;
    }
    
    // Actualizar los encabezados de los días
    const dayColumns = document.querySelectorAll('.day-column');
    const dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    
    dayColumns.forEach((column, index) => {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + index);
        
        const dayNumber = column.querySelector('.day-number');
        const dayName = column.querySelector('.day-name');
        
        if (dayNumber) dayNumber.textContent = currentDay.getDate();
        if (dayName) dayName.textContent = dayNames[index];
        
        // Marcar día actual
        const today = new Date();
        if (currentDay.toDateString() === today.toDateString()) {
            column.classList.add('active');
        } else {
            column.classList.remove('active');
        }
    });
    
    renderTimeSlots();
}

function renderTimeSlots() {
    const slotsContainer = document.querySelector('.slots-container');
    if (!slotsContainer) return;
    
    const daySlots = slotsContainer.querySelectorAll('.day-slots');
    
    daySlots.forEach((daySlot, dayIndex) => {
        daySlot.innerHTML = '';
        
        // Crear 12 slots de 30 minutos (desde 09:00 hasta 15:00)
        for (let i = 0; i < 12; i++) {
            const slotCell = document.createElement('div');
            slotCell.className = 'slot-cell';
            slotCell.dataset.day = dayIndex;
            slotCell.dataset.slot = i;
            
            // Simular algunas citas aleatoriamente
            if (Math.random() > 0.85 && dayIndex < 5) {
                const appointment = document.createElement('div');
                appointment.className = 'appointment';
                
                const hour = 9 + Math.floor(i / 2);
                const minute = i % 2 === 0 ? '00' : '30';
                const nextMinute = i % 2 === 0 ? '30' : '00';
                const nextHour = i % 2 === 0 ? hour : hour + 1;
                
                appointment.innerHTML = `
                    <div class="appointment-time">${hour}:${minute} - ${nextHour}:${nextMinute}</div>
                    <div class="appointment-client">Cliente ${dayIndex + 1}</div>
                `;
                
                appointment.style.top = '2px';
                appointment.style.height = 'calc(100% - 4px)';
                
                slotCell.appendChild(appointment);
            }
            
            daySlot.appendChild(slotCell);
        }
    });
    
    // Agregar event listeners a las celdas vacías
    document.querySelectorAll('.slot-cell:not(:has(.appointment))').forEach(cell => {
        cell.addEventListener('click', function() {
            openAppointmentModal(this.dataset.day, this.dataset.slot);
        });
    });
}

// ===================================
// NAVEGACIÓN DE CALENDARIO
// ===================================

const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');

if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderMiniCalendar();
    });
}

if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderMiniCalendar();
    });
}

if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', function() {
        selectedDate.setDate(selectedDate.getDate() - 7);
        currentDate = new Date(selectedDate);
        renderMiniCalendar();
        updateWeekView();
    });
}

if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', function() {
        selectedDate.setDate(selectedDate.getDate() + 7);
        currentDate = new Date(selectedDate);
        renderMiniCalendar();
        updateWeekView();
    });
}

// ===================================
// MODAL FUNCTIONALITY
// ===================================

const appointmentModal = document.getElementById('appointmentModal');
const closeModal = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');

function openAppointmentModal(day, slot) {
    if (appointmentModal) {
        appointmentModal.classList.add('show');
        
        // Calcular fecha y hora
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7));
        
        const appointmentDate = new Date(startOfWeek);
        appointmentDate.setDate(startOfWeek.getDate() + parseInt(day));
        
        const hour = 9 + Math.floor(slot / 2);
        const minute = slot % 2 === 0 ? '00' : '30';
        
        appointmentDate.setHours(hour, minute);
        
        // Formatear fecha para input datetime-local
        const dateTimeInput = appointmentModal.querySelector('input[type="datetime-local"]');
        if (dateTimeInput) {
            const formattedDate = appointmentDate.toISOString().slice(0, 16);
            dateTimeInput.value = formattedDate;
        }
    }
}

function closeAppointmentModal() {
    if (appointmentModal) {
        appointmentModal.classList.remove('show');
        
        // Limpiar formulario
        const inputs = appointmentModal.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'datetime-local') {
                input.value = '';
            }
        });
    }
}

if (closeModal) {
    closeModal.addEventListener('click', closeAppointmentModal);
}

if (cancelModal) {
    cancelModal.addEventListener('click', closeAppointmentModal);
}

// Cerrar modal al hacer clic fuera
if (appointmentModal) {
    appointmentModal.addEventListener('click', function(e) {
        if (e.target === appointmentModal) {
            closeAppointmentModal();
        }
    });
}

// ===================================
// BOTONES DE ACCIÓN SIDEBAR
// ===================================

const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.querySelector('span').textContent;
        console.log(`Acción seleccionada: ${buttonText}`);
        
        // Aquí puedes agregar la lógica específica para cada botón
        if (buttonText.includes('Bloquear')) {
            alert('Funcionalidad de bloqueo de fechas');
        } else if (buttonText.includes('presenciales')) {
            alert('Filtrar citas presenciales');
        } else if (buttonText.includes('virtuales')) {
            alert('Filtrar citas virtuales');
        }
    });
});

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    renderMiniCalendar();
    updateWeekView();
    
    console.log('Sistema de horarios inicializado correctamente');
});