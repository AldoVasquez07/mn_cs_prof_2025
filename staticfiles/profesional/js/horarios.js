// ===================================
// CONFIGURACIÓN INICIAL
// ===================================

let disponibilidades = [];
let aspectosNegocio = null;

// ===================================
// UTILIDADES
// ===================================

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function showNotification(message, type = 'info') {
    // Sistema simple de notificaciones
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación solo si no existen
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// API CALLS
// ===================================

async function cargarDisponibilidades() {
    try {
        const response = await fetch('/profesional/api/disponibilidades/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            disponibilidades = data.disponibilidades;
            aspectosNegocio = data.aspectos_negocio;
            renderDisponibilidades();
            cargarAspectosNegocio();
        } else {
            console.log('Mensaje:', data.message);
            mostrarEstadoVacio();
        }
    } catch (error) {
        console.error('Error al cargar disponibilidades:', error);
        showNotification('Error al cargar los horarios', 'error');
    }
}

async function guardarDisponibilidad(dia, horaInicio, horaFin) {
    try {
        const response = await fetch('/profesional/api/disponibilidades/guardar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                dia: dia,
                hora_inicio: horaInicio,
                hora_fin: horaFin
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            await cargarDisponibilidades();
            limpiarFormularioDisponibilidad();
            return true;
        } else {
            showNotification(data.message, 'error');
            return false;
        }
    } catch (error) {
        console.error('Error al guardar disponibilidad:', error);
        showNotification('Error al guardar el horario', 'error');
        return false;
    }
}

async function eliminarDisponibilidad(id) {
    if (!confirm('¿Estás seguro de eliminar este horario?')) {
        return;
    }
    
    try {
        const response = await fetch(`/profesional/api/disponibilidades/${id}/eliminar/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            await cargarDisponibilidades();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar disponibilidad:', error);
        showNotification('Error al eliminar el horario', 'error');
    }
}

async function guardarAspectosNegocio() {
    const direccion = document.getElementById('direccion').value;
    const horaApertura = document.getElementById('hora_apertura').value;
    const horaCierre = document.getElementById('hora_cierre').value;
    const permitePresencial = document.getElementById('permite_presencial').checked;
    const permiteVirtual = document.getElementById('permite_virtual').checked;
    const precioPresencial = document.getElementById('precio_presencial').value;
    const precioOnline = document.getElementById('precio_online').value;
    
    const data = {
        direccion: direccion,
        permite_presencial: permitePresencial,
        permite_virtual: permiteVirtual
    };
    
    if (horaApertura) data.hora_apertura = horaApertura;
    if (horaCierre) data.hora_cierre = horaCierre;
    if (permitePresencial && precioPresencial) data.precio_presencial = parseFloat(precioPresencial);
    if (permiteVirtual && precioOnline) data.precio_online = parseFloat(precioOnline);
    
    try {
        const response = await fetch('/profesional/api/aspectos-negocio/actualizar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            aspectosNegocio = result.aspectos_negocio;
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al guardar aspectos de negocio:', error);
        showNotification('Error al guardar la configuración', 'error');
    }
}

// ===================================
// RENDERIZADO
// ===================================

function renderDisponibilidades() {
    const grid = document.getElementById('disponibilidadesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    if (disponibilidades.length === 0) {
        mostrarEstadoVacio();
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';
    
    // Ordenar por día de la semana
    const diasOrden = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const dispOrdenadas = [...disponibilidades].sort((a, b) => {
        return diasOrden.indexOf(a.dia) - diasOrden.indexOf(b.dia);
    });
    
    grid.innerHTML = dispOrdenadas.map(disp => `
        <div class="disponibilidad-card">
            <div class="card-header">
                <h3 class="dia-nombre">${capitalizarPrimeraLetra(disp.dia)}</h3>
                <button class="btn-delete" onclick="eliminarDisponibilidad(${disp.id})" title="Eliminar">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
            <div class="card-body">
                <div class="horario-info">
                    <i class='bx bx-time'></i>
                    <span>${disp.hora_inicio} - ${disp.hora_fin}</span>
                </div>
                <div class="duracion-info">
                    <i class='bx bx-calendar'></i>
                    <span>${calcularDuracion(disp.hora_inicio, disp.hora_fin)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function mostrarEstadoVacio() {
    const grid = document.getElementById('disponibilidadesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
}

function cargarAspectosNegocio() {
    if (!aspectosNegocio) return;
    
    if (aspectosNegocio.direccion) {
        document.getElementById('direccion').value = aspectosNegocio.direccion;
    }
    
    if (aspectosNegocio.hora_apertura) {
        document.getElementById('hora_apertura').value = aspectosNegocio.hora_apertura;
    }
    
    if (aspectosNegocio.hora_cierre) {
        document.getElementById('hora_cierre').value = aspectosNegocio.hora_cierre;
    }
    
    document.getElementById('permite_presencial').checked = aspectosNegocio.permite_presencial;
    document.getElementById('permite_virtual').checked = aspectosNegocio.permite_virtual;
    
    if (aspectosNegocio.precio_presencial) {
        document.getElementById('precio_presencial').value = aspectosNegocio.precio_presencial;
    }
    
    if (aspectosNegocio.precio_online) {
        document.getElementById('precio_online').value = aspectosNegocio.precio_online;
    }
    
    togglePrecioInputs();
}

// ===================================
// FUNCIONES AUXILIARES
// ===================================

function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function calcularDuracion(inicio, fin) {
    const [horaI, minI] = inicio.split(':').map(Number);
    const [horaF, minF] = fin.split(':').map(Number);
    
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    const duracion = minutosFin - minutosInicio;
    
    const horas = Math.floor(duracion / 60);
    const minutos = duracion % 60;
    
    if (horas > 0 && minutos > 0) {
        return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
        return `${horas} horas`;
    } else {
        return `${minutos} minutos`;
    }
}

function limpiarFormularioDisponibilidad() {
    document.getElementById('dia_semana').value = '';
    document.getElementById('hora_inicio').value = '';
    document.getElementById('hora_fin').value = '';
}

function togglePrecioInputs() {
    const permitePresencial = document.getElementById('permite_presencial').checked;
    const permiteVirtual = document.getElementById('permite_virtual').checked;
    
    document.getElementById('precio_presencial_group').style.display = 
        permitePresencial ? 'block' : 'none';
    document.getElementById('precio_online_group').style.display = 
        permiteVirtual ? 'block' : 'none';
}

// ===================================
// EVENT LISTENERS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos iniciales
    cargarDisponibilidades();
    
    // Botón guardar aspectos
    const btnGuardarAspectos = document.getElementById('guardarAspectos');
    if (btnGuardarAspectos) {
        btnGuardarAspectos.addEventListener('click', guardarAspectosNegocio);
    }
    
    // Botón agregar disponibilidad
    const btnAgregarDisp = document.getElementById('agregarDisponibilidad');
    if (btnAgregarDisp) {
        btnAgregarDisp.addEventListener('click', async function() {
            const dia = document.getElementById('dia_semana').value;
            const horaInicio = document.getElementById('hora_inicio').value;
            const horaFin = document.getElementById('hora_fin').value;
            
            if (!dia || !horaInicio || !horaFin) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            
            await guardarDisponibilidad(dia, horaInicio, horaFin);
        });
    }
    
    // Toggle de inputs de precio
    const checkPresencial = document.getElementById('permite_presencial');
    const checkVirtual = document.getElementById('permite_virtual');
    
    if (checkPresencial) {
        checkPresencial.addEventListener('change', togglePrecioInputs);
    }
    
    if (checkVirtual) {
        checkVirtual.addEventListener('change', togglePrecioInputs);
    }
    
    console.log('Sistema de horarios inicializado');
});