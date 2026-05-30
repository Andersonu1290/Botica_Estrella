<template>
  <div class="dashboard-container">
        
        <div class="success-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Operación Comercial Procesada Exitosamente
        </div>
        
        <div class="grid-container">
            
            <div class="form-side">
                <h3 class="text-white d-flex align-center gap-10 mb-15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="20" height="20">
                        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    Respuesta de Pasarela Bancaria
                </h3>
                
                <div class="pos-voucher">
                    <div class="pos-header">Log de Transacción (Adapter API)</div>
                    <div class="pos-body" id="posVoucherBody">Cargando log de transacción...</div>
                </div>

                <div class="info-box">
                    <p class="text-muted text-sm m-0">El componente fue cambiado a estado 'ASIGNADO' y registrado en el Kardex.</p>
                </div>
                
                <div class="note-box" id="panelAlertasStock" style="display: none;">
                    <h4 class="text-warning d-flex align-center gap-10 mb-15 mt-0 text-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        EJECUCIÓN PATRÓN OBSERVER (Notificaciones)
                    </h4>
                    <div id="contenedorAlertas"></div>
                </div>

                <a href="/admin/inventario" class="btn-submit-tech mt-20" style="text-decoration: none; box-sizing: border-box; display: block; text-align: center;">
                    Finalizar y Volver al Inventario
                </a>
            </div>

            <div class="flex-col-1-5 d-flex justify-center">
                
                <div class="electronic-receipt" id="comprobanteElectronico">
                    <div class="watermark">PAGADO</div>
                    
                    <div class="receipt-header">
                        <img src="../../../public/admin/img/logo_boticaestrella.png" alt="boticaestrella" class="receipt-logo" onerror="this.src='https://via.placeholder.com/200x60/ffffff/000000?text=boticaestrella'">
                        
                        <div class="company-info">
                            <strong>boticaestrella S.A.C. - Producto & TECH</strong><br>
                            RUC: 20546987123 | Av. Garcilaso de la Vega 1348, Lima<br>
                            Teléfono: (01) 555-1234 | soporte@boticaestrella.com.pe
                        </div>
                        
                        <div id="documentoTitulo" class="doc-title">COMPROBANTE ELECTRÓNICO</div>
                    </div>

                    <div class="receipt-body">
                        <pre id="receiptDocBody">Generando representación del documento...</pre>
                    </div>

                    <div class="receipt-footer">
                        <div class="legal-text">Representación impresa de Documento Electrónico<br>Consulte su validez en www.sunat.gob.pe</div>
                        <div class="barcode">Facturacion-boticaestrella</div>
                    </div>
                </div>
                
            </div>

        </div>
    </div>
</template>

<script>
export default {
  name: 'ConfirmacionVentaView',
  mounted() {
    // 1. Inyectamos la variable de entorno en memoria global para api.js
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y segura de scripts sin duplicados
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/confirmacionventa.js'))
      .then(() => {
        // 3. Lanzamos el chispazo para inicializar la lógica nativa de tus scripts
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar la capa lógica:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        const scriptExistente = document.querySelector(`script[src="${ruta}"]`);
        if (scriptExistente) { resolve(); return; }

        const script = document.createElement('script');
        script.src = ruta;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  }
}
</script>

<style scoped>
/* Espacio reservado para estilos específicos del componente si fuera necesario */
</style>