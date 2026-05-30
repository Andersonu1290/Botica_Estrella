document.addEventListener("DOMContentLoaded", async function () {
    if (!sessionStorage.getItem("usuarioActivo")) {
        window.location.href = "Login";
        return;
    }
    await renderizarConfirmacionVenta();
});

async function renderizarConfirmacionVenta() {
    const posVoucherBody = document.getElementById("posVoucherBody");
    const receiptDocBody = document.getElementById("receiptDocBody");
    const documentoTitulo = document.getElementById("documentoTitulo");
    const comprobanteElectronico = document.getElementById("comprobanteElectronico");
    const panelAlertasStock = document.getElementById("panelAlertasStock");
    const contenedorAlertas = document.getElementById("contenedorAlertas");

    try {
        const raw = sessionStorage.getItem("ultimaVentaProcesada");

        if (!raw) {
            if (receiptDocBody) receiptDocBody.textContent = "Sin comprobante disponible.";
            return;
        }

        const transaccion = JSON.parse(raw);

        // =========================
        // 1. LOG DE PAGO
        // =========================
        if (posVoucherBody) {
            posVoucherBody.innerHTML = transaccion.msgPago || "Transacción aprobada.";
        }

        // =========================
        // 2. DOCUMENTO ELECTRÓNICO (ASCII POS PRINTER)
        // =========================
        if (receiptDocBody) {
            let htmlProductos = "";
            
            // Dibujamos cada producto con espaciado uniforme para simular una impresora térmica
            transaccion.productos.forEach(p => {
                const nombreStr = p.nombre.length > 20 ? p.nombre.substring(0, 17) + "..." : p.nombre.padEnd(20);
                const serieStr = p.nroSerie.length > 10 ? p.nroSerie.substring(0, 7) + "..." : p.nroSerie.padEnd(10);
                htmlProductos += `${nombreStr} | ${serieStr} | ${formatMoneda(p.precio)}\n`;
            });

            // Template literal respetando sangrías
            const textoRecibo = `================================================
  [SISTEMA BOTICA ESTRELLA] - ${transaccion.tipoComprobante.toUpperCase()}
================================================
TICKET : ${transaccion.comprobante}
CLIENTE: ${transaccion.cliente.toUpperCase()}
DOC.   : ${transaccion.documento}
PAGO   : ${transaccion.metodoPago.toUpperCase()}
------------------------------------------------
PRODUCTO             | S/N        | PRECIO 
------------------------------------------------
${htmlProductos}------------------------------------------------
TOTAL A PAGAR:                      ${formatMoneda(transaccion.total)}
================================================
    ¡Gracias por su compra en Botica Estrella!`;

            receiptDocBody.textContent = textoRecibo;
        }

        // =========================
        // 3. TIPO DE COMPROBANTE (Estilos visuales)
        // =========================
        const tipoComp = (transaccion.tipoComprobante || "BOLETA").toUpperCase();

        if (comprobanteElectronico) {
            comprobanteElectronico.classList.remove("style-BOLETA", "style-FACTURA");
            comprobanteElectronico.classList.add(`style-${tipoComp}`);
        }

        if (documentoTitulo) {
            documentoTitulo.className = `doc-title title-${tipoComp}`;
            documentoTitulo.textContent = tipoComp === "FACTURA"
                ? "FACTURA ELECTRÓNICA"
                : "BOLETA DE VENTA ELECTRÓNICA";
        }

        // =========================
        // 4. ALERTAS DE STOCK (Observer)
        // =========================
        const alertas = Array.isArray(transaccion.alertasStock) ? transaccion.alertasStock : [];

        if (contenedorAlertas && panelAlertasStock) {
            contenedorAlertas.innerHTML = "";
            if (alertas.length > 0) {
                alertas.forEach((alerta) => {
                    const div = document.createElement("div");
                    div.className = "user-badge font-mono text-xs mb-15";
                    div.style.borderLeft = "3px solid #ef4444";
                    div.style.paddingLeft = "8px";
                    div.textContent = alerta;
                    contenedorAlertas.appendChild(div);
                });
                panelAlertasStock.style.display = "block";
            } else {
                panelAlertasStock.style.display = "none";
            }
        }

    } catch (error) {
        console.error("Error en confirmación de venta:", error);
        if (receiptDocBody) receiptDocBody.textContent = "Error al generar comprobante.";
    }
}