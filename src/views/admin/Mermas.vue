<template>
  <div>
    <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Gestión de Mermas (Bajas de Producto)
                </h2>
            </div>
            <!-- CORRECCIÓN DE RUTA: Apunta al path '/admin/inventario' de tu Router de Vue -->
            <a href="/admin/inventario" class="btn-tech">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Volver al Inventario
            </a>
        </div>

        <div class="grid-container">
            
            <div class="form-side">
                <h3 class="subtitle-blue">1. Componentes Activos (Seleccione para dar de baja)</h3>
                
                <div class="search-box-container mb-15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="buscadorDisp" placeholder="Buscar por Nro Serie o SKU..." class="input-tech m-0">
                </div>
                
                <div class="table-panel">
                    <table class="tech-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO SKU</th>
                                <th>PRODUCTO</th>
                                <th>NÚMERO SERIE (S/N)</th>
                                <th class="text-center">ACCIÓN</th>
                            </tr>
                        </thead>
                        <!-- FASE 4: Contenedor id="tablaDisp" vacío listo para la inyección de componentes activos -->
                        <tbody id="tablaDisp">
                            <tr>
                                <td colspan="4" class="text-center p-20 text-muted">Cargando componentes activos...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-side">
                <h3 class="subtitle-red">2. Historial de Equipos Defectuosos</h3>
                
                <div class="search-box-container mb-15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="buscadorMerma" placeholder="Buscar en bajas..." class="input-tech m-0">
                </div>
                
                <div class="table-panel">
                    <table class="tech-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO SKU</th>
                                <th>PRODUCTO</th>
                                <th>NÚMERO SERIE (S/N)</th>
                                <th class="text-center">ESTADO</th>
                            </tr>
                        </thead>
                        <!-- FASE 4: Contenedor id="tablaMerma" vacío listo para la inyección de historial de bajas -->
                        <tbody id="tablaMerma">
                            <tr>
                                <td colspan="4" class="text-center p-20 text-muted">Cargando historial de mermas...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MermasView',
  mounted() {
    // 1. Inyectamos la variable de entorno global para resolver local vs nube en api.js
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y segura de scripts desde la carpeta public/admin/js/
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/mermas.js'))
      .then(() => {
        // 3. Disparamos el chispazo de inicialización para tus scripts nativos
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar infraestructura de mermas:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        // Evitamos duplicar la etiqueta del script en la SPA para prevenir colisiones de variables
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
/* Estilos específicos si el módulo de mermas lo requiere */
</style>
