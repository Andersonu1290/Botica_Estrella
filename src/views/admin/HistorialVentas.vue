<template>
  <div>
    <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <h2 class="text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Auditoría e Historial de Ventas
                </h2>
            </div>
            <!-- CORRECCIÓN DE RUTA: Apunta al path '/admin/venta' definido en tu router de Vue -->
            <a href="/admin/venta" class="btn-tech">Volver al Punto de Venta</a>
        </div>

        <div class="search-box-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" width="20" height="20">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="buscadorVentas" placeholder="Buscar por Cliente, S/N, Comprobante..." class="input-tech">
        </div>

        <div class="table-panel">
            <table class="tech-table" id="tablaVentas">
                <thead>
                    <tr>
                        <th>FECHA / HORA</th>
                        <th>N° COMPROBANTE</th>
                        <th>CLIENTE</th>
                        <th>Producto (S/N)</th>
                        <th>TOTAL</th>
                        <th class="text-center">ESTADO</th>
                        <th class="text-center">ACCIÓN</th>
                    </tr>
                </thead>
                <!-- FASE 4: Contenedor de datos vacío para tu javascript nativo -->
                <tbody id="tbodyHistorialVentas">
                    <tr>
                        <td colspan="7" class="text-center p-30 text-muted">
                            Cargando auditoría de transacciones...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistorialVentasView',
  mounted() {
    // 1. Inyectamos la variable de entorno para que api.js resuelva local vs nube
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y ordenada de la lógica nativa guardada en public/admin/js/
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/historialventas.js'))
      .then(() => {
        // 3. 🔥 EL TRUCO DEL RETRASO: Le damos un respiro de 50ms a Vue para pintar el HTML
        // antes de despertar la lógica de inicialización del buscador y tablas
        setTimeout(() => {
          window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
          }));
        }, 50);
      })
      .catch(err => console.error("Error al inyectar infraestructura del historial de ventas:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        // Verificamos si el script ya existe en el DOM para que no colisione
        const scriptExistente = document.querySelector(`script[src="${ruta}"]`);
        if (scriptExistente) { resolve(); return; }

        const script = document.createElement('script');
        script.src = ruta;
        // Asignamos una clase de control para identificarlo en la limpieza masiva
        script.className = 'script-historial-modulo';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  },
  // 🔥 LIMPIEZA HIGIÉNICA AL SALIR: Evita que interfiera con tus otros JS
  unmounted() {
    const scriptsCargados = document.querySelectorAll('.script-historial-modulo');
    scriptsCargados.forEach(script => {
      if (script.src.includes('historialventas.js')) {
        script.remove();
      }
    });
  }
}
</script>


<style scoped>
/* Espacio para estilos específicos si el módulo lo requiere */
</style>
