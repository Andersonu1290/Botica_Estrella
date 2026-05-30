document.addEventListener("DOMContentLoaded", async () => {
    // Protección de ruta local
    if (!sessionStorage.getItem('usuarioActivo')) {
        window.location.href = 'Login';
        return;
    }

    await cargarHistorialKardex();
    // Reutilizamos tu utilidad de búsqueda en memoria
    inicializarBuscador('buscadorKardex', 'tablaKardex');
});

async function cargarHistorialKardex() {
    const tbody = document.getElementById("tbodyKardex");
    if (!tbody) return;

    try {
        // Consumimos el endpoint REST
        const historial = await API.get('/kardex/historial');

        // Renderizado para estado vacío
        if (!historial || historial.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center p-30">
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--border-tech)" stroke-width="1" width="60" height="60" class="mb-15">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                        <h4 class="text-muted m-0">Kardex Vacío</h4>
                        <p class="text-muted text-sm mt-0">Aún no hay operaciones registradas en la base de datos.</p>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = "";

        // Iteramos los datos construyendo las filas
        historial.forEach(k => {
            // Valores por defecto (INGRESO)
            let claseBadge = "badge-in";
            let claseSN = "";
            let icono = "<line x1='12' y1='19' x2='12' y2='5'></line><polyline points='5 12 12 5 19 12'></polyline>";
            let signo = "+";
            let classColorCant = "text-success"; 

            // Lógica condicional portada desde Java
            if (k.tipoMovimiento === "SALIDA") { 
                claseBadge = "badge-out"; 
                icono = "<line x1='5' y1='12' x2='19' y2='12'></line><polyline points='12 5 19 12 12 19'></polyline>";
                signo = "-";
                classColorCant = "text-blue";
            } else if (k.tipoMovimiento === "MERMA") { 
                claseBadge = "badge-merma"; 
                claseSN = "sn-red";
                icono = "<path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path><line x1='12' y1='9' x2='12' y2='13'></line><line x1='12' y1='17' x2='12.01' y2='17'></line>";
                signo = "-";
                classColorCant = "text-danger";
            }

            // Manejo de la fecha proveniente del JSON (ej: "2026-05-26T10:43:00")
            let fecha = "-";
            let hora = "-";
            if(k.fecha) {
                fecha = k.fecha.substring(0, 10);
                hora = k.fecha.substring(11, 19);
            }

            // Inyección del SVG de S/N
            const tieneSN = (k.motivo && k.motivo.includes("S/N")) ? `
                <div class="sn-box ${claseSN}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12" style="display: inline-block; vertical-align: middle; margin-right: 3px;">
                        <path d="M4 5h16v14H4z"/>
                        <line x1="8" y1="5" x2="8" y2="19"/>
                        <line x1="16" y1="5" x2="16" y2="19"/>
                    </svg>
                    Trazabilidad S/N Activa
                </div>
            ` : '';

            // Armado final de la fila
            tbody.innerHTML += `
                <tr>
                    <td class="text-muted text-sm">
                        ${fecha}<br>
                        <strong class="text-white">${hora}</strong>
                    </td>
                    <td>
                        <span class="badge ${claseBadge}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">${icono}</svg>
                            ${k.tipoMovimiento}
                        </span>
                    </td>
                    <td>
                        <div class="font-bold text-white">${k.nombreProducto}</div>
                        ${tieneSN}
                    </td>
                    <td class="font-bold ${classColorCant}" style="font-size: 15px;">
                        ${signo}${k.cantidad}
                    </td>
                    <td class="text-muted text-sm" style="max-width: 250px; line-height: 1.5;">
                        ${k.motivo}
                    </td>
                    <td>
                        <div class="user-badge m-0" style="display: inline-flex;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" class="text-muted">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <strong>${k.nombreUsuario}</strong>
                        </div>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al renderizar el kardex:", error);
        mostrarNotificacion("Error de conexión al cargar el Kardex.", "error");
    }
}