<template>
  <!-- Usamos tu clase login-body en este contenedor para envolver todo el diseño -->
  <div class="login-body">
    
    <div class="login-wrapper">
        <div class="login-container" style="box-shadow: 0 20px 60px rgba(0,0,0,0.8); border-top: 4px solid var(--brand-blue);">
            
            <div class="logo-wrapper">
                <!-- Ruta ajustada para leer directo desde public../../../public/admin/img/ -->
                <img src="../../../public/admin/img/logo_boticaestrella.png" alt="boticaestrella" class="logo-login" onerror="this.src='https://via.placeholder.com/250x80/1E1E1E/E63946?text=boticaestrella'">
            </div>
            
            <div class="login-header">
                <h2>Control de Inventarios</h2>
                <p>Plataforma de Trazabilidad Logística</p>
            </div>

            <!-- FASE 4: Contenedor de error ciego estructurado, controlado al 100% por JavaScript -->
            <div class="alert-error" id="msgError" style="display: none;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span id="txtErrorSpan">Credenciales incorrectas.</span>
            </div>

            <!-- FASE 4: Contenedor de éxito ciego estructurado para notificaciones del cliente -->
            <div class="alert-error" id="msgSuccess" style="display: none; background: rgba(16, 185, 129, 0.1); border-color: #10B981; color: #10B981;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span id="txtSuccessSpan">Operación exitosa.</span>
            </div>

            <!-- FASE 1: Formulario completamente ciego sin atributos de acción de Servlet ni método -->
            <form class="login-form" id="frmLogin">
                
                <div class="input-group">
                    <label for="txtUsuario">Usuario de Red</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" id="txtUsuario" required placeholder="Ej. admin" autocomplete="off">
                    </div>
                </div>
                
                <div class="input-group">
                    <label for="txtClave">Contraseña</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input type="password" id="txtClave" required placeholder="••••••••">
                    </div>
                </div>

                <div class="form-options" style="margin-top: 15px; display: flex; justify-content: center;">
                    <label class="checkbox-container">
                        <input type="checkbox" id="chkRecordar" value="SI">
                        <span class="checkmark"></span>
                        Recordar mi usuario en este equipo
                    </label>
                </div>

                <button type="submit" class="btn-submit" id="btnIngresar" style="margin-top: 20px;">
                    <span id="btnText">Ingresar al Sistema</span>
                    <svg id="btnIcon" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                        <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </form>
            
        </div>

        <div class="rsu-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                <path d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z"></path>
            </svg>
            <span>Interfaz RSU: Alto contraste activado.</span>
        </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      intervaloVerificacion: null
    }
  },
mounted() {
    // 🌟 ESTA ES LA LÍNEA MÁGICA QUE FALTABA
    window.VITE_API_URL = import.meta.env.VITE_API_URL;
    
    // 1. Iniciamos un vigilante silencioso para ver cuándo el login es exitoso
    this.vigilarExitoLogin();

    // 2. Cargamos los scripts secuencialmente
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/login.js'))
      .then(() => {
        // Despertamos tu login.js lanzando el evento DOMContentLoaded
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error cargando scripts del login:", err));
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
    },
    vigilarExitoLogin() {
      // Tu login.js hace: sessionStorage.setItem('usuarioActivo', ...) al tener éxito.
      // Este bucle revisa la memoria cada 200 milisegundos de forma ultra rápida.
      this.intervaloVerificacion = setInterval(() => {
        if (sessionStorage.getItem('usuarioActivo')) {
          // ¡Éxito detectado! Frenamos el vigilante para que no consuma recursos
          clearInterval(this.intervaloVerificacion);
          
          // El Router de Vue te mueve de pantalla sin recargar ni romper nada
          this.$router.push('/admin/inventario');
        }
      }, 200);
    }
  },
  unmounted() {
    // Seguridad: Si salimos de la pantalla por otra razón, limpiamos el proceso
    if (this.intervaloVerificacion) {
      clearInterval(this.intervaloVerificacion);
    }
  }
}
</script>




<style scoped>
/* Asegura que el contenedor ocupe toda la pantalla simulando el body */
.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}
</style>
