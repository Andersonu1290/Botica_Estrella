/**
 * Procesa la baja de un equipo (Merma) enviando los datos al backend
 * @param {string} serie - Número de serie del equipo/producto
 */
async function ejecutarMerma(serie) {
    let motivo = prompt("ESTÁ A PUNTO DE DAR DE BAJA EL EQUIPO S/N: " + serie + "\n\nPor favor, ingrese el motivo del defecto o daño:");

    if (motivo !== null && motivo.trim() !== "") {
        try {
            // CORRECCIÓN: Extracción de sesión local del usuario logueado
            const usuarioActivo = JSON.parse(sessionStorage.getItem('usuarioActivo'));

            // CORRECCIÓN: Estructura exacta del payload esperado por MermaController
            const payload = {
                numeroSerie: serie, // El backend espera 'numeroSerie'
                motivo: motivo.trim(),
                idUsuario: usuarioActivo.idUsuario // Requerido por el backend
            };

            // Enviamos la merma al endpoint definitivo
            await API.post('/mermas/procesar', payload);
            
            alert("Merma registrada con éxito en el Kardex.");
            
            // FASE 4: Recargar las tablas en pantalla inmediatamente sin recargar la página entera
            await cargarTablasMermas();

        } catch (error) {
            console.error("Error al registrar la merma:", error);
            alert("No se pudo registrar la merma: " + error.message);
        }
    } else if (motivo !== null) {
        alert("Operación cancelada: El motivo es obligatorio para registrar la merma en el Kardex.");
    }
}

            /**
             * FASE 4: Carga y renderiza los datos dinámicamente desde la API REST
             */
            async function cargarTablasMermas() {
                try {
                    // CORRECCIÓN: Consumo de endpoints unificados en Spring Boot filtrados por Query Params
                    const dispositivos = await API.get('/mermas/series?estado=DISPONIBLE');
                    const mermas = await API.get('/mermas/series?estado=MERMA');
                
                    // 2. Renderizar Tabla de Dispositivos Disponibles
                    const tbodyDisp = document.getElementById("tablaDisp");
                    if (tbodyDisp) {
                        tbodyDisp.innerHTML = ""; // Limpiamos filas viejas
                        dispositivos.forEach(disp => {
                tbodyDisp.innerHTML += `
                    <tr>
                        <td>
                            <span class="sku-box">
                                ${disp.codigoSKU || '-'}
                            </span>
                        </td>
                        
                        <td class="td-nombre">
                            ${disp.nombreProducto || disp.nombre || 'Producto'}
                        </td>
                        
                        <td class="font-mono text-blue">
                            ${disp.numeroSerie || '-'}
                        </td>
                        
                        <td class="text-center">
                            <button 
                                class="btn-action btn-delete"
                                onclick="ejecutarMerma('${disp.numeroSerie}')">
                                Dar de Baja
                            </button>
                        </td>
                    </tr>
                `;
            });
        }

        // 3. Renderizar Tabla de Historial de Mermas
        const tbodyMerma = document.getElementById("tablaMerma");
        if (tbodyMerma) {
            tbodyMerma.innerHTML = ""; // Limpiamos filas viejas
            mermas.forEach(m => {
                tbodyMerma.innerHTML += `
                    <tr>
                        <td>
                            <span class="sku-box">
                                ${m.codigoSKU || '-'}
                            </span>
                        </td>
                        
                        <td class="td-nombre">
                            ${m.nombreProducto || m.nombre || 'Producto'}
                        </td>
                        
                        <td class="font-mono text-red">
                            ${m.numeroSerie || '-'}
                        </td>
                        
                        <td class="text-center">
                            <span class="badge badge-alert">
                                MERMA
                            </span>
                        </td>
                    </tr>
                `;
            });
        }

    } catch (error) {
        console.error("Error al cargar los datos de mermas:", error);
    }
}

/**
 * Inicialización al cargar la página
 */
document.addEventListener("DOMContentLoaded", async function() {
    // FASE 2: Protección de ruta (Verifica que el usuario esté logueado)
    if (!sessionStorage.getItem('usuarioActivo')) {
        window.location.href = 'Login';
        return;
    }

    // Cargar los datos de las tablas desde el nuevo backend
    await cargarTablasMermas();

    // Inicializar tus buscadores existentes en el frontend
    if (document.getElementById('buscadorDisp')) {
        inicializarBuscador('buscadorDisp', 'tablaDisp');
        inicializarBuscador('buscadorMerma', 'tablaMerma');
    }
});
