<template>
  <div class="dashboard-container-narrow">
        
        <div class="header-tech">
            <div class="header-title">
                <img src="../../../public/admin/img/logo_boticaestrella.png" alt="boticaestrella" class="logo-img" onerror="this.src='https://via.placeholder.com/150x45/111827/E63946?text=boticaestrella'">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" class="text-blue">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Terminal de Salida / Venta
                </h2>
            </div>
            <div class="nav-links">
                <a href="/admin/historial-ventas" class="btn-tech btn-primary-tech">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Historial y Anulaciones
                </a>
                <a href="/admin/inventario" class="btn-tech">
                    Volver al Inventario
                </a>
            </div>
        </div>

        <div class="info-box mb-25">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p class="text-muted text-sm m-0">Proceso Transaccional: El stock será descontado inmediatamente en MySQL y reportado al Kardex. Podrás agregar múltiples S/N al carrito antes de confirmar la salida.</p>
        </div>

        <div class="form-panel mb-25" style="border-left: 4px solid var(--brand-blue);">
            <h3 class="mb-15 mt-0 text-white">1. Selección de Producto</h3>
            <div class="d-flex gap-15" style="align-items: flex-end; flex-wrap: wrap;">
                <div class="flex-col" style="flex: 2;">
                    <label for="cboProducto" class="form-label">Componente a despachar (SKU):</label>
                    <select id="cboProducto" class="input-tech" required>
                        <option value="" disabled selected>Cargando catálogo...</option>
                    </select>
                </div>
                <div class="flex-col" style="flex: 1.5;">
                    <label for="txtNroSerie" class="form-label">Número de Serie (S/N):</label>
                    <select id="txtNroSerie" class="input-tech input-mono" required>
                        <option value="" disabled selected>-- Primero seleccione componente --</option>
                    </select>
                </div>
                <div class="flex-col-0-8">
                    <button type="button" id="btnAgregarCarrito" class="btn-tech btn-success-tech" style="height: 42px; width: 100%; justify-content: center;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Agregar
                    </button>
                </div>
            </div>
        </div>

        <div class="table-panel mb-25">
            <table class="tech-table">
                <thead>
                    <tr>
                        <th>PRODUCTO</th>
                        <th>NRO. DE SERIE (S/N)</th>
                        <th>PRECIO</th>
                        <th class="text-center">ACCIÓN</th>
                    </tr>
                </thead>
                <tbody id="tablaCarrito">
                    <tr><td colspan="4" class="text-center p-20 text-muted">El carrito está vacío</td></tr>
                </tbody>
            </table>
            <div class="p-15" style="text-align: right; background: rgba(0,0,0,0.2); border-top: 1px solid var(--border-tech);">
                <h3 class="m-0 text-white">Total a Cobrar: <span id="lblTotal" class="text-success font-mono" style="font-size: 24px; margin-left: 10px;">S/ 0.00</span></h3>
            </div>
        </div>

        <div class="form-panel">
            <h3 class="mb-15 mt-0 text-white">2. Detalles de Facturación</h3>
            
            <form id="frmVenta">
                <div class="d-flex gap-15 mb-25" style="flex-wrap: wrap;">
                    
                    <div class="flex-col-1-5">
                        <label for="cboTipoComprobante" class="form-label">Tipo de Doc:</label>
                        <select id="cboTipoComprobante" class="input-tech m-0" required>
                            <option value="BOLETA">Boleta</option>
                            <option value="FACTURA">Factura</option>
                        </select>
                    </div>

                    <div class="flex-col-1-5">
                        <label for="txtComprobante" class="form-label">Nro. de Ticket (Opcional):</label>
                        <input type="text" id="txtComprobante" class="input-tech input-mono m-0" placeholder="Autogenerado por el sistema" disabled>
                    </div>

                    <div class="flex-col-2">
                        <label class="form-label">Método de Pago:</label>
                        <div class="payment-selector-container">
                            <label class="payment-option">
                                <input type="radio" name="cboMetodoPago" value="EFECTIVO" checked>
                                <div class="payment-content">
                                    <img src="../../../public/admin/img/icono-efectivo.png" alt="Efectivo" onerror="this.style.display='none'">
                                    <span>Efectivo</span>
                                </div>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="cboMetodoPago" value="TARJETA">
                                <div class="payment-content">
                                    <img src="../../../public/admin/img/icono-tarjeta.png" alt="Tarjeta" onerror="this.style.display='none'">
                                    <span>Tarjeta</span>
                                </div>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="cboMetodoPago" value="TRANSFERENCIA">
                                <div class="payment-content">
                                    <img src="../../../public/admin/img/icono-transfer.png" alt="Transferencia" onerror="this.style.display='none'">
                                    <span>Transfer.</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="info-box mt-20 p-20" style="display: block; border-left-color: var(--brand-blue);">
                    <h4 class="text-blue text-sm mb-15 mt-0 font-bold">Datos del Cliente</h4>
                    
                    <div class="d-flex gap-15" style="flex-wrap: wrap;">
                        <div class="flex-col">
                            <label class="form-label">DNI / RUC:</label>
                            <input type="text" id="txtDocCliente" class="input-tech input-mono m-0" required placeholder="Ej. 70123456">
                        </div>
                        <div class="flex-col-1-5">
                            <label class="form-label">Nombre o Razón Social:</label>
                            <input type="text" id="txtNombreCliente" class="input-tech m-0" required placeholder="Ej. Juan Pérez">
                        </div>
                        <div class="flex-col-1-5">
                            <label class="form-label">Correo Electrónico:</label>
                            <input type="email" id="txtCorreoCliente" class="input-tech m-0" placeholder="correo@empresa.com">
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="btn-submit-tech mt-20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                        <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    Procesar Venta y Generar Ticket
                </button>
            </form>
        </div>

    </div>

    <div id="alert-container"></div>
</template>

<script>
export default {
  name: 'VentaView',
  mounted() {
    // 1. Pasamos la variable de entorno global para api.js (Local vs Nube)
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y ordenada de la lógica de tu punto de venta
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/venta.js')) // Inyecta tu script nativo de ventas
      .then(() => {
        // 3. Despertamos los escuchadores del script nativo dándole un respiro a Vue 
        // para que termine de pintar el HTML en pantalla
        setTimeout(() => {
          window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
          }));
        }, 50);
      })
      .catch(err => console.error("Error al inyectar infraestructura de Ventas:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        const scriptExistente = document.querySelector(`script[src="${ruta}"]`);
        
        if (scriptExistente) {
          resolve(); 
          return;
        }

        const script = document.createElement('script');
        script.src = ruta;
        // Le ponemos una clase para poder identificarlo y destruirlo al salir
        script.className = 'script-venta-modulo';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  },
  // 🔥 LA SOLUCIÓN HIGIÉNICA: Se ejecuta de forma automática cuando sales de Ventas
  unmounted() {
    // Buscamos el script de ventas específico y lo destruimos del documento
    // para que cuando vuelvas al inventario la memoria esté limpia y no te bote
    const scriptsCargados = document.querySelectorAll('.script-venta-modulo');
    scriptsCargados.forEach(script => {
      if (script.src.includes('venta.js')) {
        script.remove();
      }
    });
  }
}
</script>


<style scoped>
/* Espacio reservado para estilos específicos del componente si fuera necesario */
</style>