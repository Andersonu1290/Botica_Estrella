<template>
  <div>
    <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <h2 class="page-title text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Categorías de Producto
                </h2>
            </div>
            <!-- CORRECCIÓN DE RUTA: Apunta al path '/admin/producto-form' de tu Router de Vue -->
            <a href="/admin/producto-form" class="btn-tech">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Volver a Registro de Producto
            </a>
        </div>

        <div class="grid-container mt-20">
            
            <div class="form-side">
                <h3 class="subtitle-blue">Crear Nueva Familia</h3>
                
                <!-- FASE 1: Formulario ciego sin 'action' ni 'method' tradicionales -->
                <form id="frmCategoria">
                    <label class="form-label">Nombre de la Categoría:</label>
                    <input type="text" id="txtNombreCat" class="input-tech" required placeholder="Ej. Monitores, Fuentes de Poder..." autocomplete="off">
                    
                    <button type="submit" class="btn-submit-tech">
                        Guardar Categoría
                    </button>
                </form>
                
                <div class="note-box mt-20">
                    <p>
                        <strong>Nota:</strong> Las categorías creadas aquí aparecerán automáticamente en el menú desplegable al registrar un nuevo componente en el inventario.
                    </p>
                </div>
            </div>

            <div class="table-side">
                <div class="d-flex justify-between align-center mb-15">
                    <h3 class="text-white font-bold">Familias Registradas</h3>
                </div>

                <div class="search-box-container">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="buscadorCat" class="input-tech" placeholder="Buscar familia...">
                </div>

                <div class="table-panel">
                    <table class="tech-table" id="tablaCat">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NOMBRE DE FAMILIA / CATEGORÍA</th>
                                <th class="text-center">ACCIONES</th>
                            </tr>
                        </thead>
                        <!-- FASE 4: Contenedor <tbody> vacío listo para tu javascript nativo -->
                        <tbody id="tbodyCategorias">
                            <tr>
                                <td colspan="3" class="text-center p-30">
                                    <p class="text-muted text-sm">Cargando categorías...</p>
                                </td>
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
  name: 'CategoriasView',
  mounted() {
    // 1. Inyectamos la variable de entorno para la resolución dinámica de la API
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y segura de scripts desde la carpeta public/admin/js/
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/categoria.js'))
      .then(() => {
        // 3. Disparamos el chispazo de inicialización para tus scripts nativos
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar infraestructura de categorías:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        // Validación en el DOM para no duplicar scripts en la SPA
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
/* Estilos locales del módulo si fuesen requeridos */
</style>
