<template>
  <div>
    <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Gestión de Personal (Módulo de Seguridad)
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

        <!-- FASE 4: Alerta de error latente administrada por JavaScript ante fallas del backend -->
        <div class="alert-error mb-15" id="msgError" style="display: none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span id="txtErrorSpan">Ocurrió un error.</span>
        </div>

        <div class="grid-container">
            
            <div class="form-side">
                <h3 class="subtitle-blue">Registrar Nuevo Operario</h3>
                
                <!-- FASE 2 y 4: Formulario controlado por JS (oculto por defecto para usuarios sin privilegios) -->
                <form id="frmUsuario" style="display: none;">
                    <label for="txtUsername" class="form-label">Nombre de Usuario (Login):</label>
                    <input type="text" id="txtUsername" name="username" class="input-tech" required autocomplete="off" placeholder="Ej. jperez">

                    <label for="txtPassword" class="form-label">Contraseña de acceso:</label>
                    <input type="password" id="txtPassword" name="password" class="input-tech" required placeholder="••••••••">

                    <label for="cboRol" class="form-label">Rol en el Sistema:</label>
                    <select id="cboRol" name="rol" class="input-tech" required>
                        <option value="ALMACEN">Operario de Almacén</option>
                        <option value="JEFE_ALMACEN">Jefe de Almacén (Admin)</option>
                    </select>

                    <button type="submit" class="btn-submit-tech mt-15">
                        Guardar Credenciales
                    </button>
                </form>

                <!-- FASE 2: Caja de aviso de bloqueo para operarios comunes (oculta por defecto) -->
                <div class="note-box mt-20" id="panelAccesoDenegado" style="display: none;">
                    <h4 class="text-warning d-flex align-center gap-10 mb-15 mt-0 text-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Acceso Denegado
                    </h4>
                    <p class="text-muted text-xs">Solo el perfil <strong>'JEFE_ALMACEN'</strong> puede registrar nuevos usuarios en el sistema.</p>
                </div>
            </div>

            <div class="table-side">
                <div class="d-flex justify-between align-center mb-15">
                    <h3 class="text-white font-bold m-0">Personal Autorizado</h3>
                </div>
                
                <div class="search-box-container mb-15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="buscadorUsuarios" placeholder="Buscar usuario o rol..." class="input-tech m-0" style="max-width: none;">
                </div>
                
                <div class="table-panel">
                    <table class="tech-table">
                        <thead>
                            <tr>
                                <th>ID SYS</th>
                                <th>Nombre de Usuario</th>
                                <th class="text-center">Rol de Seguridad</th>
                            </tr>
                        </thead>
                        <!-- FASE 4: tbody id="tbodyUsuarios" vacío listo para tu javascript nativo -->
                        <tbody id="tbodyUsuarios">
                            <tr>
                                <td colspan="3" class="text-center p-30 text-muted">
                                    Cargando personal autorizado...
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
  name: 'UsuariosView',
  mounted() {
    // 1. Inyectamos la variable de entorno global para resolver local vs nube en api.js
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y segura de scripts desde la carpeta public/admin/js/
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/usuarios.js'))
      .then(() => {
        // 3. Disparamos el chispazo de inicialización para tus scripts nativos
        // Esto despertará usuarios.js para validar roles en sessionStorage, pintar la tabla o bloquear el form
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar infraestructura de usuarios:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        // Evitamos duplicar la etiqueta en la SPA para prevenir colisiones de variables globales
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
/* Estilos específicos si el módulo de usuarios lo requiere */
</style>
