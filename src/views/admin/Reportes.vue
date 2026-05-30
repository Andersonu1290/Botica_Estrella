<template>
  <div>
    <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <!-- CORRECCIÓN DE IMAGEN: Ruta estática ajustada para leer de public../../../public/admin/img/ -->
                <img src="../../../public/admin/img/logo_boticaestrella.png" alt="boticaestrella" class="logo-img" onerror="this.src='https://via.placeholder.com/150x45/111827/E63946?text=boticaestrella'">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" style="vertical-align: bottom;">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Business Intelligence (BI) Dashboard
                </h2>
            </div>
            <div class="nav-links">
                <div class="user-badge" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981;">
                    Ingresos Netos: <strong class="font-mono" id="kpiIngresos">Cargando...</strong>
                </div>
                <!-- CORRECCIÓN DE RUTA: Apunta al path '/admin/inventario' de tu Router de Vue -->
                <a href="/admin/inventario" class="btn-tech">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Volver al Menú Principal
                </a>
            </div>
        </div>

        <div class="report-grid">
            <div class="report-card card-blue">
                <div class="report-label">Producto en Stock Total</div>
                <div class="report-value" id="kpiTotalStock">0</div>
                <span class="text-blue text-xs font-bold">↑ Unidades Físicas Activas</span>
            </div>
            <div class="report-card card-green">
                <div class="report-label">Ventas Concretadas</div>
                <div class="report-value" id="kpiTotalVentas">0</div>
                <span class="text-success text-xs font-bold">✔ Salidas Procesadas</span>
            </div>
            <div class="report-card card-red">
                <div class="report-label">Productos en Merma</div>
                <div class="report-value" id="kpiTotalMermas">0</div>
                <span class="text-danger text-xs font-bold">⚠ Equipos Defectuosos</span>
            </div>
            <div class="report-card card-yellow">
                <div class="report-label">Alertas Críticas</div>
                <div class="report-value" id="kpiStockCritico">0</div>
                <span class="text-warning text-xs font-bold">↓ SKUs por debajo del mínimo</span>
            </div>
        </div>

        <div class="charts-container">
            <div class="chart-box" style="flex: 1.5;">
                <div class="chart-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    Top 5 Producto Más Vendido (Unidades Reales)
                </div>
                <div style="position: relative; height: 250px; width: 100%;">
                    <!-- El lienzo de tu barChart intacto -->
                    <canvas id="barChart"></canvas>
                </div>
            </div>

            <div class="chart-box" style="flex: 1;">
                <div class="chart-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                    Distribución de Stock por Categoría
                </div>
                <div style="position: relative; height: 250px; width: 100%; display: flex; justify-content: center;">
                    <!-- El lienzo de tu doughnutChart intacto -->
                    <canvas id="doughnutChart"></canvas>
                </div>
            </div>
        </div>

        <h3 class="subtitle-blue mt-20 mb-15 d-flex align-center gap-10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            Auditoría de Ventas en Vivo (Últimas 5 transacciones)
        </h3>
        
        <div class="table-panel mb-25">
            <table class="tech-table">
                <thead>
                    <tr>
                        <th>FECHA / HORA</th>
                        <th>COMPROBANTE</th>
                        <th>CLIENTE</th>
                        <th>PRODUCTO</th>
                        <th>TOTAL</th>
                        <th class="text-center">ESTADO</th>
                    </tr>
                </thead>
                <!-- FASE 4: Contenedor listo para inyección en vivo desde reportes.js -->
                <tbody id="tbodyAuditoriaVentas">
                </tbody>
            </table>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportesView',
  mounted() {
    // 1. Inyectamos la variable de entorno global para resolver local vs nube en api.js
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga del CDN de Chart.js y secuencialmente tus capas lógicas de public/admin/js/
    this.cargarScriptExterno('https://cdn.jsdelivr.net/npm/chart.js')
      .then(() => this.cargarScriptInterno('/admin/js/api.js'))
      .then(() => this.cargarScriptInterno('/admin/js/utils.js'))
      .then(() => this.cargarScriptInterno('/admin/js/reportes.js'))
      .then(() => {
        // 3. Disparamos el chispazo de inicialización para tus scripts nativos
        // Esto despertará reportes.js, poblará los KPIs e inicializará las gráficas en los canvas
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar infraestructura del BI Dashboard:", err));
  },
  methods: {
    cargarScriptExterno(url) {
      return new Promise((resolve, reject) => {
        // Validación para CDN para que Chart.js no se cargue múltiples veces en la memoria SPA
        const existente = document.querySelector(`script[src="${url}"]`);
        if (existente) { resolve(); return; }
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    },
    cargarScriptInterno(ruta) {
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
/* Estilos específicos si el módulo BI lo requiere */
</style>
