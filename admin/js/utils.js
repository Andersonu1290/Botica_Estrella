/**
 * Filtra dinámicamente las filas de una tabla según el texto ingresado.
 * Ideal para el paradigma Client-Side Rendering (CSR).
 */
function inicializarBuscador(inputId, tableId) {
    const input = document.getElementById(inputId);
    const tabla = document.getElementById(tableId);

    if (!input || !tabla) return;

    input.addEventListener('keyup', function() {
        let filtro = this.value.toLowerCase();
        let filas = tabla.querySelectorAll('tbody tr');
        
        filas.forEach(function(fila) {
            // Verifica que la fila tenga celdas para no filtrar el encabezado o filas de carga
            if(fila.cells.length > 1) {
                let textoFila = fila.textContent.toLowerCase();
                fila.style.display = textoFila.includes(filtro) ? '' : 'none';
            }
        });
    });
}

/**
 * Formatea un número a la moneda oficial de la Botica (Soles Peruanos)
 * @param {number} cantidad - Monto numérico
 */
function formatMoneda(cantidad) {
    if (isNaN(cantidad) || cantidad === null) return "S/ 0.00";
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cantidad);
}

/**
 * Formatea una fecha ISO proveniente del backend de Spring Boot a formato legible
 * @param {string} fechaString - Fecha en formato texto (ej: 2026-05-26T10:43:00)
 */
function formatFecha(fechaString) {
    if (!fechaString) return "-";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Muestra alertas dinámicas elegantes en el DOM sin bloquear el hilo con alert() nativos.
 * Requiere un contenedor con id="alert-container" en tus HTML base.
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo - 'success', 'error', 'warning', 'info'
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    let contenedor = document.getElementById('alert-container');
    
    // Si no existe el contenedor en el HTML, lo crea dinámicamente en el body
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'alert-container';
        contenedor.style.position = 'fixed';
        contenedor.style.top = '20px';
        contenedor.style.right = '20px';
        contenedor.style.zIndex = '9999';
        document.body.appendChild(contenedor);
    }

    const alerta = document.createElement('div');
    alerta.className = `alert-box alert-${tipo}`;
    alerta.style.padding = '12px 20px';
    alerta.style.marginBottom = '10px';
    alerta.style.borderRadius = '6px';
    alerta.style.color = '#fff';
    alerta.style.fontWeight = '500';
    alerta.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    alerta.style.transition = 'all 0.3s ease';

    // Paleta de colores acorde al sistema
    const colores = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    alerta.style.backgroundColor = colores[tipo] || colores.info;
    alerta.textContent = mensaje;

    contenedor.appendChild(alerta);

    // Desvanecer y eliminar la alerta automáticamente a los 4 segundos
    setTimeout(() => {
        alerta.style.opacity = '0';
        setTimeout(() => alerta.remove(), 300);
    }, 4000);
}

/**
 * CORRECCIÓN: Cierre de sesión centralizado y asíncrono.
 * Llama al backend para destruir el token o registrar la salida antes de limpiar el navegador.
 */
async function cerrarSesion() {
    try {
        // Notifica la destrucción de la sesión al LoginController en el servidor
        await API.post('/auth/logout', {}); 
    } catch (e) {
        console.log("Logout backend advertencia:", e);
    } finally {
        // El bloque finally garantiza que la limpieza ocurra siempre, incluso sin red
        sessionStorage.removeItem('usuarioActivo');
        sessionStorage.removeItem('jwt_token');
        window.location.href = 'Login';
    }
}
