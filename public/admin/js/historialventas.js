document.addEventListener("DOMContentLoaded", async function() {
    // FASE 2: Protección de Ruta (Solo personal autenticado)
    if (!sessionStorage.getItem('usuarioActivo')) {
        window.location.href = 'Login';
        return;
    }

    // Carga inicial de la auditoría de transacciones
    await cargarHistorialVentas();

    // Inicializar el filtro de búsqueda local en tiempo real (CSR)
    if (document.getElementById('buscadorVentas')) {
        inicializarBuscador('buscadorVentas', 'tablaVentas');
    }
});

/**
 * FASE 4: Recupera la colección de transacciones desde el backend e inyecta las filas en el DOM
 */
async function cargarHistorialVentas() {
    const tbody = document.getElementById("tbodyHistorialVentas");
    if (!tbody) return;

    try {
        // Consumir el endpoint de auditoría comercial de tu Spring Boot
        // (Ajusta la ruta '/ventas/historial' o '/ventas' según tu VentaController)
        const ventas = await API.get('/ventas/historial');

        tbody.innerHTML = ""; // Limpiar mensaje de carga provisional

        if (!ventas || ventas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center p-30 text-muted">No hay transacciones registradas en el sistema.</td></tr>';
            return;
        }

        // Iteración asíncrona sobre el arreglo JSON devuelto por el servidor
        ventas.forEach(v => {
            // El backend maneja estados como 'COMPLETADA' o 'ANULADA'
            const esAnulada = v.estado === "ANULADA";
            const filaClase = esAnulada ? "row-disabled" : "";
            
            // Construcción e inyección dinámica usando Template Literals
            tbody.innerHTML += `
                <tr class="${filaClase}">
                    <td class="text-muted text-sm">${formatFecha(v.fecha || v.fechaHora)}</td>
                    <td class="font-mono text-white">${v.nroComprobante || v.comprobante}</td>
                    <td class="font-bold">${v.nombreCliente || 'Cliente Varios'}</td>
                    <td>
                        <span class="text-blue">${v.nombreProducto || 'Producto'}</span><br>
                        <span class="text-xs text-muted">S/N: ${v.nroSerie || v.numeroSerie}</span>
                    </td>
                    <td class="font-mono font-bold text-success">
                        ${formatMoneda(v.total)}
                    </td>
                    <td class="text-center">
                        ${esAnulada 
                            ? '<span class="badge badge-alert">ANULADA</span>' 
                            : '<span class="badge badge-optimal">COMPLETADA</span>'
                        }
                    </td>
                    <td class="text-center">
                        ${esAnulada 
                            ? '<span class="text-muted text-sm">-- Reintegrado --</span>' 
                            : `<button type="button" 
                                       onclick="revertirVentaComercial(${v.id || v.idVenta}, '${v.nroComprobante || v.comprobante}')" 
                                       class="btn-action btn-revert">
                                   Revertir Venta
                               </button>`
                        }
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al renderizar el historial de ventas:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center p-30 text-danger">No se pudo cargar la auditoría: ${error.message}</td></tr>`;
        mostrarNotificacion("Error de red al consultar el historial comercial.", "error");
    }
}

/**
 * FASE 3: Intercepta la reversión, ejecuta un DELETE/PUT asíncrono y refresca la UI inmediatamente
 * @param {number} idVenta - ID único de la transacción
 * @param {string} comprobante - Nro de ticket visualizado
 */
async function revertirVentaComercial(idVenta, comprobante) {

    const confirmacion = confirm(
        `¡ADVERTENCIA!\n\n¿Desea anular la venta ${comprobante}?`
    );

    if (!confirmacion) return;

    try {

        const usuarioActivo = JSON.parse(
            sessionStorage.getItem('usuarioActivo')
        );

        await API.post(
            `/ventas/anular/${idVenta}?idUsuario=${usuarioActivo.idUsuario}`,
            {}
        );

        mostrarNotificacion(
            `Transacción ${comprobante} anulada correctamente.`,
            "success"
        );

        await cargarHistorialVentas();

    } catch (error) {

        console.error(
            "Error al revertir la transacción:",
            error
        );

        mostrarNotificacion(
            `No se pudo anular la venta: ${error.message}`,
            "error"
        );
    }
}
