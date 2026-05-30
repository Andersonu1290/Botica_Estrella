document.addEventListener("DOMContentLoaded", async () => {
    // 1. Validar sesión (Fase 2: Gestión de Estado)
    const usuarioActivoString = sessionStorage.getItem('usuarioActivo');
    if (!usuarioActivoString) {
        window.location.href = 'login';
        return;
    }

    // 2. Colocar datos del operador en la cabecera dinámicamente
    const usuarioActivo = JSON.parse(usuarioActivoString);
    const lblNombre = document.getElementById('lblNombreUsuario');
    const lblRol = document.getElementById('lblRolUsuario');
    
    if (lblNombre) lblNombre.textContent = usuarioActivo.username || "Operador";
    if (lblRol) lblRol.textContent = usuarioActivo.rol || "Personal";

    // Vincular evento al botón de cerrar sesión superior si existe
    const btnDesconectar = document.getElementById('btnDesconectar') || document.querySelector('.btn-tech[href*="Desconectar"]');
    if (btnDesconectar) {
        btnDesconectar.addEventListener('click', async (e) => {
            e.preventDefault();
            if (typeof cerrarSesion === 'function') {
                await cerrarSesion();
            } else {
                sessionStorage.clear();
                window.location.href = '/';
            }
        });
    }

    // 3. Iniciar carga de datos de la API REST (Fase 4)
    await cargarInventario();

    // 4. Activar el buscador dinámico en tiempo real (CSR)
    if (document.getElementById('buscadorInventario')) {
        inicializarBuscador('buscadorInventario', 'tablaInventario');
    }
});

async function cargarInventario() {
    const tbody = document.getElementById("tbodyInventario");
    if (!tbody) return;

    try {
        // Pedimos los productos a la API unificada
        const productos = await API.get('/productos');

        let totalStock = 0;
        let alertasStock = 0;
        let valorInventario = 0.0;

        if (!productos || productos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center p-30">
                        <h4 class="text-muted m-0">No hay datos para mostrar en el inventario.</h4>
                    </td>
                </tr>`;
            actualizarKPIs(0, 0, 0);
            return;
        }

        tbody.innerHTML = "";
        
        // 🔥 LA SOLUCIÓN DEFINITIVA: Armamos la ruta exactamente como en Vue
        // Si no existe la variable, usamos la ruta absoluta directa al puerto de Java.
        const URL_BASE = window.VITE_API_URL || 'http://localhost:8089/api';
        const RUTA_API = URL_BASE.endsWith('/v1') ? URL_BASE : URL_BASE + '/v1';

        // Procesar y dibujar filas dinámicamente
        productos.forEach(p => {
            // ID del producto unificado para evitar nulos
            const idProd = p.idProducto || p.id;
            
            // Cálculos para los bloques de KPIs superiores
            totalStock += p.stockActual;
            valorInventario += (p.stockActual * p.precio);
            
            const enAlerta = p.stockActual <= p.stockMinimo;
            if (enAlerta) alertasStock++;

            // Estilos CSS reactivos
            const claseStock = enAlerta ? "stock-low" : "stock-good";
            const badgeEstado = enAlerta 
                ? '<span class="badge badge-alert">ALERTA</span>' 
                : '<span class="badge badge-optimal">ÓPTIMO</span>';

            // 🔥 Inyectamos RUTA_API para asegurar el /v1
            const imgHtml = `
                <img 
                    src="${RUTA_API}/productos/${idProd}/imagen"
                    alt="${p.nombre}"
                    class="product-img"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >
                <div class="no-photo" style="display:none;">
                    Sin Foto
                </div>
            `;

            // ID formateado corporativo (ej. #022)
            const idFormateado = '#' + String(idProd).padStart(3, '0');

            // Renderizado de la fila inyectada en el DOM
            tbody.innerHTML += `
                <tr>
                    <td class="td-id">${idFormateado}</td>
                    <td><span class="sku-box">${p.codigoSKU || p.sku}</span></td>
                    <td class="text-center">${imgHtml}</td>
                    <td class="td-nombre">${p.nombre}</td>
                    <td class="text-center">
                        <span class="stock-number ${claseStock}">${p.stockActual}</span>
                    </td>
                    <td class="text-center text-muted font-mono">
                        ${p.stockMinimo}
                    </td>
                    <td class="td-precio">${formatMoneda(p.precio)}</td>
                    <td>${badgeEstado}</td>
                    <td>
                        <div class="actions-container">
                            <a href="producto-form?id=${idProd}" class="btn-action btn-edit">
                                Editar
                            </a>
                                
                            <button 
                                class="btn-action btn-delete"
                                onclick="eliminarProducto(${idProd}, '${p.codigoSKU || p.sku}')">
                                Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Actualizar los 3 paneles de KPIs superiores
        actualizarKPIs(totalStock, alertasStock, valorInventario);

    } catch (error) {
        console.error("Error cargando inventario:", error);
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion("Ocurrió un error al cargar el inventario de la base de datos.", "error");
        }
    }
}

function actualizarKPIs(stock, alertas, valor) {
    const kpiStock = document.getElementById("kpiTotalStock");
    const kpiAlertas = document.getElementById("kpiAlertas");
    const kpiValor = document.getElementById("kpiValorizacion");

    if (kpiStock) kpiStock.textContent = stock;
    if (kpiAlertas) kpiAlertas.textContent = alertas;
    if (kpiValor) kpiValor.textContent = formatMoneda(valor);
}

/**
 * FASE 3: Eliminar producto e invocar recarga dinámica
 */
async function eliminarProducto(idProducto, sku) {
    const confirmacion = confirm(`¿Está seguro de eliminar el SKU: ${sku}? Esta acción eliminará registros en cascada.`);
    
    if (confirmacion) {
        try {
            await API.delete(`/productos/${idProducto}`);
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion("Producto eliminado correctamente.", "success");
            } else {
                alert("Producto eliminado correctamente.");
            }
            // Recargar la tabla asíncronamente (CSR) sin parpadeo de pantalla
            await cargarInventario();
        } catch (error) {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion(error.message || "Error al intentar eliminar el producto.", "error");
            } else {
                alert(error.message || "Error al intentar eliminar el producto.");
            }
        }
    }
}