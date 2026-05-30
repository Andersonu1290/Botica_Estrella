<template>
  <div>
    <div class="dashboard-container-narrow">
        
        <div class="header-tech">
            <div class="header-title">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    <!-- FASE 4: Título dinámico controlado por JavaScript -->
                    <span id="formTitulo">Registrar Nuevo Producto</span>
                </h2>
            </div>
            <!-- CORRECCIÓN DE RUTA: Apunta al path '/admin/inventario' de tu Router de Vue -->
            <a href="/admin/inventario" class="btn-tech">Cancelar y Volver</a>
        </div>

        <div class="form-panel">
            <!-- FASE 1 y 5: Formulario ciego sin action. JS interceptará el submit para armar el FormData -->
            <form id="frmProducto">
                
                <!-- ID oculto para gestionar actualizaciones mediante PUT en la Fase 5 -->
                <input type="hidden" id="txtId" name="idProducto">

                <label class="form-label">Código SKU único:</label>
                <input type="text" id="txtSku" name="codigoSKU" class="input-tech input-mono" required placeholder="Ej. CER01" autocomplete="off">

                <label class="form-label">Nombre / Especificación del Producto:</label>
                <input type="text" id="txtNombre" name="nombre" class="input-tech" required placeholder="Ej. Monitor Gamer 24&quot;" autocomplete="off">
                
                <label class="form-label">Familia / Categoría del Componente:</label>
                <div class="d-flex align-center gap-15 mb-25">
                    <!-- FASE 4: Selector vacío para la inyección de categorías desde la API -->
                    <select id="cboCategoria" name="idCategoria" class="input-tech flex-col" style="margin-bottom: 0;" required>
                        <option value="" disabled selected>Cargando familias...</option>
                    </select>
                    <!-- CORRECCIÓN DE RUTA: Apunta al path '/categorias' de tu Router de Vue -->
                    <a href="/admin/categorias" class="btn-action btn-edit" style="padding: 14px 20px; font-size: 14px;">Gestionar Categorías</a>
                </div>

                <div class="flex-row gap-15">
                    <div class="flex-col">
                        <label class="form-label">Stock Inicial/Actual:</label>
                        <input type="number" id="txtStock" name="stockActual" class="input-tech input-mono" required min="0" value="0">
                    </div>
                    <div class="flex-col">
                        <label class="form-label">Umbral de Alerta Mínimo:</label>
                        <input type="number" id="txtMinimo" name="stockMinimo" class="input-tech input-mono" required min="0" value="5">
                    </div>
                </div>

                <label class="form-label">Precio Unitario (S/):</label>
                <input type="number" id="txtPrecio" name="precio" class="input-tech input-mono" step="0.01" required placeholder="Ej. 1500.50">

                <label class="form-label mt-15">Fotografía del Componente (Opcional):</label>
                <!-- FASE 5: Control nativo binario para Multipart/Form-Data -->
                <input type="file" id="txtImagen" name="imagenFile" class="input-tech" accept="image/png, image/jpeg, image/webp">
                
                <!-- FASE 4: Contenedor de previsualización latente, administrado dinámicamente por CSR en edición -->
                <div class="info-box mt-15" id="previewContainer" style="display: none; flex-direction: column; align-items: flex-start; padding: 15px;">
                    <img src="" id="imgProductoPreview" class="product-img" style="width: auto; height: 100px; padding: 0;">
                    <p class="text-muted text-xs font-bold" style="margin: 10px 0 0 0;">Imagen Actual (Suba otra si desea reemplazarla)</p>
                </div>
                
                <!-- FASE 4: Texto del botón mutable administrado desde JS -->
                <button type="submit" class="btn-submit-tech mt-20" id="btnGuardar">
                    Guardar Nuevo Producto
                </button>
            </form>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductoFormView',
  mounted() {
    // 1. Inyectamos la variable de entorno global para resolver local vs nube en api.js
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y segura de scripts desde la carpeta public/admin/js/
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/productoform.js'))
      .then(() => {
        // 3. Disparamos el chispazo de inicialización para tus scripts nativos
        // Esto despertará a productoform.js para capturar si viene un ?id= en la URL y poblar los campos
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar infraestructura del formulario de producto:", err));
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
/* Estilos específicos si el módulo del formulario lo requiere */
</style>
