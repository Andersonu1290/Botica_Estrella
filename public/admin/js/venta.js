// Memoria local del carrito de compras para el Client-Side Rendering
let carrito = [];

/**
 * FASE 4: Carga inicial de productos desde la API filtrando por stock
 */
async function cargarProductosVenta() {
    const cboProducto = document.getElementById("cboProducto");
    if (!cboProducto) return;

    try {
        const productos = await API.get('/productos');

        cboProducto.innerHTML = '<option value="" disabled selected>-- Seleccione un Producto --</option>';

        productos.filter(p => p.stockActual > 0).forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.idProducto;
            opt.textContent = `${p.nombre} - ${formatMoneda(p.precio)}`;
            opt.setAttribute('data-precio', p.precio);
            cboProducto.appendChild(opt);
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        mostrarNotificacion("No se pudieron cargar los productos.", "error");
    }
}

/**
 * Cargar series por producto
 */
async function cargarSeriesPorProducto(productoId) {
    const cboSerie = document.getElementById("txtNroSerie");
    if (!cboSerie) return;

    cboSerie.innerHTML = '<option value="" disabled selected>Cargando series...</option>';

    try {
        const series = await API.get('/mermas/series?estado=DISPONIBLE');

        cboSerie.innerHTML = '<option value="" disabled selected>-- Seleccione el Número de Serie --</option>';

        const seriesDelProducto = series.filter(s => s.idProducto == productoId);

        if (seriesDelProducto.length > 0) {
            seriesDelProducto.forEach(serie => {
                const opt = document.createElement("option");
                opt.value = serie.numeroSerie;
                opt.textContent = serie.numeroSerie;
                cboSerie.appendChild(opt);
            });
        } else {
            cboSerie.innerHTML = '<option value="" disabled selected>-- Sin series disponibles --</option>';
        }

    } catch (error) {
        console.error("Error al cargar series:", error);
    }
}

/**
 * Agregar al carrito
 */
function agregarAlCarrito() {
    const cboProducto = document.getElementById("cboProducto");
    const cboSerie = document.getElementById("txtNroSerie");

    const productoId = cboProducto.value;
    const serie = cboSerie.value;

    if (!productoId || !serie) {
        mostrarNotificacion("Seleccione producto y serie", "warning");
        return;
    }

    if (carrito.some(i => i.nroSerie === serie)) {
        mostrarNotificacion("Serie ya agregada", "warning");
        return;
    }

    const opt = cboProducto.options[cboProducto.selectedIndex];

    carrito.push({
        productoId: parseInt(productoId),
        nombre: opt.textContent.split(" - ")[0],
        nroSerie: serie,
        precio: parseFloat(opt.getAttribute("data-precio"))
    });

    renderizarTablaCarrito();
    cargarSeriesPorProducto(productoId);
}

/**
 * Eliminar del carrito
 */
function eliminarDelCarrito(serie) {
    carrito = carrito.filter(i => i.nroSerie !== serie);
    renderizarTablaCarrito();
}

/**
 * Render carrito
 */
function renderizarTablaCarrito() {
    const tbody = document.getElementById("tablaCarrito");
    if (!tbody) return;

    tbody.innerHTML = "";

    let subtotal = 0;

    if (carrito.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Carrito vacío</td></tr>';
        actualizarTotales(0);
        return;
    }

    carrito.forEach(item => {
        subtotal += item.precio;

        tbody.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.nroSerie}</td>
                <td>${formatMoneda(item.precio)}</td>
                <td><button onclick="eliminarDelCarrito('${item.nroSerie}')">Quitar</button></td>
            </tr>
        `;
    });

    actualizarTotales(subtotal);
}

/**
 * Totales
 */
function actualizarTotales(subtotal) {
    const igv = subtotal * 0.18;
    const total = subtotal;

    const lblTotal = document.getElementById("lblTotal");

    if (lblTotal) {
        lblTotal.textContent = formatMoneda(total);
    }
}

/**
 * PROCESAR VENTA
 */
async function procesarVenta(e) {
    if (e) e.preventDefault();

    if (carrito.length === 0) {
        mostrarNotificacion("Carrito vacío", "warning");
        return;
    }

    const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    const txtDocCliente = document.getElementById("txtDocCliente");
    const txtNombre = document.getElementById("txtNombreCliente");
    const txtCorreo = document.getElementById("txtCorreoCliente");
    const cboTipoComp = document.getElementById("cboTipoComprobante");
    const metodoPagoSeleccionado = document.querySelector('input[name="cboMetodoPago"]:checked');

    const mapaMetodoPago = {
        EFECTIVO: "pagoEfectivo",
        TARJETA: "pagoTarjeta",
        TRANSFERENCIA: "pagoTransferencia"
    };

    const metodoBackend = mapaMetodoPago[metodoPagoSeleccionado?.value];

    if (!metodoBackend) {
        mostrarNotificacion("Seleccione método de pago", "warning");
        return;
    }

    try {
        const btnSubmit = document.querySelector("#frmVenta button[type='submit']");
        btnSubmit.disabled = true;

        let ultimoComprobante = "";
        let ultimoMsgPago = "";
        let alertasGlobales = [];

        // 1. Procesamos cada producto en el backend (MySQL)
        for (let item of carrito) {
            const ventaRequestDTO = {
                idProducto: item.productoId,
                nroSerie: item.nroSerie,
                tipoComprobante: cboTipoComp?.value || "BOLETA",
                metodoPago: metodoBackend,
                idUsuario: usuarioActivo.idUsuario,
                docCliente: txtDocCliente?.value || "00000000",
                nombreCliente: txtNombre?.value || "Cliente",
                correoCliente: txtCorreo?.value || "",
                total: item.precio
            };

            const res = await API.post("/ventas", ventaRequestDTO);
            
            ultimoComprobante = res.comprobante;
            ultimoMsgPago = res.msgPago;
            if (res.alertasStock && res.alertasStock.length > 0) {
                alertasGlobales.push(...res.alertasStock);
            }
        }

        mostrarNotificacion("Venta procesada con éxito", "success");

        // 2. CRÍTICO: Consolidamos TODO el carrito en un solo ticket visual para el CSR
        const ticketConsolidado = {
            comprobante: ultimoComprobante,
            tipoComprobante: cboTipoComp?.value || "BOLETA",
            cliente: txtNombre?.value || "Cliente Varios",
            documento: txtDocCliente?.value || "00000000",
            metodoPago: metodoPagoSeleccionado?.value || "EFECTIVO",
            productos: [...carrito], // Clonamos el carrito completo
            total: carrito.reduce((sum, item) => sum + item.precio, 0), // Suma real de todos los items
            msgPago: ultimoMsgPago,
            alertasStock: [...new Set(alertasGlobales)] // Eliminamos notificaciones duplicadas
        };

        // Guardamos el objeto consolidado en la sesión
        sessionStorage.setItem("ultimaVentaProcesada", JSON.stringify(ticketConsolidado));

        setTimeout(() => {
            window.location.href = "/admin/confirmacion-venta";
        }, 800);

        carrito = [];
        renderizarTablaCarrito();

    } catch (error) {
        console.error(error);
        mostrarNotificacion("Error al procesar venta", "error");
        const btnSubmit = document.querySelector("#frmVenta button[type='submit']");
        if(btnSubmit) btnSubmit.disabled = false;
    }
}

/**
 * INIT
 */
document.addEventListener("DOMContentLoaded", async () => {

    if (!sessionStorage.getItem("usuarioActivo")) {
        window.location.href = "Login";
        return;
    }

    await cargarProductosVenta();

    document.getElementById("cboProducto")
        .addEventListener("change", e => cargarSeriesPorProducto(e.target.value));

    document.getElementById("btnAgregarCarrito")
        .addEventListener("click", agregarAlCarrito);

    document.getElementById("frmVenta")
        .addEventListener("submit", procesarVenta);
});