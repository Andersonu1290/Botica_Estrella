<template>
  <div>
    <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <!-- CORRECCIÓN DE IMAGEN: Ruta estática ajustada para leer de public../../../public/admin/img/ -->
                <img src="../../../public/admin/img/logo_boticaestrella.png" alt="boticaestrella" class="logo-img" onerror="this.src='https://via.placeholder.com/150x45/111827/E63946?text=boticaestrella'">
                <h2 class="text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" class="text-blue">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Trazabilidad de Activos
                </h2>
            </div>
            
            <!-- CORRECCIÓN DE RUTA: Apunta al path '/admin/inventario' de tu Router de Vue -->
            <a href="/admin/inventario" class="btn-tech">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Volver al Almacén
            </a>
        </div>

        <div class="search-box-container mt-15 mb-15">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="buscadorKardex" placeholder="Buscar por Operación, S/N, Producto o Responsable..." class="input-tech">
        </div>

        <div class="table-panel">
            <table class="tech-table" id="tablaKardex">
                <thead>
                    <tr>
                        <th>FECHA / HORA</th>
                        <th>OPERACIÓN</th>
                        <th>Producto AFECTADO</th>
                        <th>CANT.</th>
                        <th>JUSTIFICACIÓN / S/N</th>
                        <th>RESPONSABLE</th>
                    </tr>
                </thead>
                <!-- FASE 4: Contenedor listo para la inyección dinámica desde kardex.js -->
                <tbody id="tbodyKardex">
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KardexView',
  mounted() {
    // 1. Inyectamos la variable de entorno para resolver local vs nube en api.js
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y controlada de scripts desde la carpeta public/admin/js/
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/kardex.js'))
      .then(() => {
        // 3. Disparamos el chispazo de inicialización para tus scripts nativos
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar infraestructura del Kardex:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        // Evitamos duplicar la etiqueta del script en la SPA para prevenir colisiones
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
/* Estilos específicos si el módulo de auditoría lo requiere */
</style>
