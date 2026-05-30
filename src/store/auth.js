import { reactive, watch } from 'vue';

// Recuperamos la sesión si existe al recargar la página
const sesionGuardada = localStorage.getItem('clienteEstrella');
const clienteInicial = sesionGuardada ? JSON.parse(sesionGuardada) : null;

export const authStore = reactive({
  usuarioActual: clienteInicial,

  get estaLogueado() {
    return this.usuarioActual !== null;
  },

  iniciarSesion(datosUsuario) {
    this.usuarioActual = datosUsuario;
  },

  cerrarSesion() {
    this.usuarioActual = null;
  }
});

// Observador: Guarda o borra automáticamente en localStorage si cambia el usuario
watch(
  () => authStore.usuarioActual,
  (nuevoUsuario) => {
    if (nuevoUsuario) {
      localStorage.setItem('clienteEstrella', JSON.stringify(nuevoUsuario));
    } else {
      localStorage.removeItem('clienteEstrella');
    }
  },
  { deep: true }
);