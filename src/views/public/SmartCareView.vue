<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/services/apiClient';
import { authStore } from '@/store/auth';
import Icono from '@/components/smartcare/Icono.vue';
import TratamientosLista from '@/components/smartcare/TratamientosLista.vue';
import NuevoTratamiento from '@/components/smartcare/NuevoTratamiento.vue';
import EditarTratamiento from '@/components/smartcare/EditarTratamiento.vue';
import AlertaInventarioModal from '@/components/smartcare/AlertaInventarioModal.vue';
import MiBotiquin from '@/components/smartcare/MiBotiquin.vue';

const router = useRouter();

// Vistas: 'LISTA' (tratamientos activos) | 'NUEVO' (registrar) | 'EDITAR' (ajustar la pauta médica)
const vistaActual = ref('LISTA');
const historial = ref([]);
const cargandoHistorial = ref(true);
const tratamientoAlerta = ref(null);

// Tratamiento que se está editando (se pasa como prop a EditarTratamiento)
const tratamientoAEditar = ref(null);

// Menú lateral: riel delgado de iconos que se puede ocultar del todo.
const CLAVE_MENU = 'smartcare.menuOculto';
const menuOculto = ref(false);

try {
  menuOculto.value = localStorage.getItem(CLAVE_MENU) === '1';
} catch {
  /* sin almacenamiento disponible */
}

const alternarMenu = () => {
  menuOculto.value = !menuOculto.value;
  try {
    localStorage.setItem(CLAVE_MENU, menuOculto.value ? '1' : '0');
  } catch {
    /* ignorar */
  }
};

const menu = [
  { id: 'RESUMEN', nombre: 'Resumen', icono: 'resumen' },
  { id: 'LISTA', nombre: 'Mis tratamientos', icono: 'pastilla' },
  { id: 'BOTIQUIN', nombre: 'Mi botiquín', icono: 'caja' }, // EL NUEVO MENÚ
  { id: 'RECETAS', nombre: 'Recetas', icono: 'receta' },
  { id: 'PEDIDOS', nombre: 'Pedidos', icono: 'bolsa' },
  { id: 'CITAS', nombre: 'Citas', icono: 'calendario' },
];

const cargarHistorial = async () => {
  if (!authStore.estaLogueado) return;
  cargandoHistorial.value = true;
  try {
    historial.value = await apiClient.obtenerHistorialSmartCare(
      authStore.usuarioActual.idUsuario
    );
  } catch (error) {
    console.error('Error cargando el historial', error);
  } finally {
    cargandoHistorial.value = false;
  }
};

const volverALista = () => {
  vistaActual.value = 'LISTA';
  tratamientoAEditar.value = null;
};

const alGuardar = async () => {
  volverALista();
  await cargarHistorial();
};

const irAComprar = () => {
  tratamientoAlerta.value = null;
  router.push('/productos');
};

// ==========================================
// FUNCIONES DE LA FASE 2 Y CRUD
// ==========================================

const eliminarTratamiento = async (tratamiento) => {
  const confirmacion = confirm(`¿Estás seguro de eliminar el tratamiento de ${tratamiento.nombreMedicamento}?`);
  if (!confirmacion) return;

  try {
    await apiClient.eliminarTratamiento(tratamiento.idTratamiento, authStore.usuarioActual.idUsuario);
    await cargarHistorial();
  } catch (error) {
    alert(error.message || 'Error al eliminar el tratamiento.');
  }
};

const registrarTomaDosis = async (tratamiento) => {
  try {
    await apiClient.registrarTomaDosis(tratamiento.idTratamiento, authStore.usuarioActual.idUsuario);
    await cargarHistorial(); // Actualiza los datos en vivo
    
    // Si la matemática dictaba que esa era su última pastilla, le avisamos:
    if ((tratamiento.stockActual - tratamiento.cantidadPorToma) < tratamiento.cantidadPorToma) {
      alert("🎉 ¡Felicidades! Has completado este tratamiento. Ha sido movido a tu pestaña de Finalizados automáticamente.");
    }
  } catch (error) {
    alert(error.message || 'Error al registrar la toma.');
  }
};

// Abre la vista 'EDITAR' con el tratamiento seleccionado (ya no se reutiliza NuevoTratamiento)
const prepararEdicion = (tratamiento) => {
  tratamientoAEditar.value = tratamiento;
  vistaActual.value = 'EDITAR';
};

// Agrega esta función debajo de eliminarTratamiento
const finalizarTratamiento = async (tratamiento) => {
  const confirmacion = confirm(`¿Marcar el tratamiento de ${tratamiento.nombreMedicamento} como finalizado?`);
  if (!confirmacion) return;
  try {
    await apiClient.finalizarTratamiento(tratamiento.idTratamiento, authStore.usuarioActual.idUsuario);
    await cargarHistorial();
  } catch (error) {
    alert(error.message || 'Error al finalizar el tratamiento.');
  }
};

onMounted(cargarHistorial);
</script>

<template>
  <div
    class="my-4 flex min-h-[85vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm lg:flex-row"
  >
    <!-- Riel de iconos -->
    <div
      v-if="!menuOculto"
      class="hidden flex-col items-center gap-1 bg-[#12294f] py-3 text-white lg:flex"
      style="width: 56px; min-width: 56px; max-width: 56px; flex: 0 0 56px"
    >
      <button
        type="button"
        class="mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        title="Ocultar menú"
        aria-label="Ocultar menú"
        @click="alternarMenu"
      >
        <Icono nombre="flechaIzq" class="h-5 w-5" />
      </button>

      <nav class="flex flex-col items-center gap-1" aria-label="Mi salud">
        <template v-for="item in menu" :key="item.id">
          <button
            v-if="['LISTA', 'BOTIQUIN'].includes(item.id)" 
            @click="vistaActual = item.id"
            class="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
            :class="vistaActual === item.id || (vistaActual === 'NUEVO' && item.id === 'LISTA') || (vistaActual === 'EDITAR' && item.id === 'LISTA') ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'"
            :title="item.nombre"
          >
            <Icono :nombre="item.icono" class="h-5 w-5" />
          </button>
          <span
            v-else
            class="flex h-10 w-10 cursor-default items-center justify-center rounded-xl text-slate-500 opacity-50"
            :title="`${item.nombre} (próximamente)`"
          >
            <Icono :nombre="item.icono" class="h-5 w-5" />
          </span>
        </template>
      </nav>
    </div>

    <main class="min-w-0 flex-1 overflow-y-auto p-5 md:p-8">

      <nav aria-label="Ruta" class="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <button
          v-if="menuOculto"
          type="button"
          class="mr-1 hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 lg:inline-flex"
          title="Mostrar menú"
          aria-label="Mostrar menú"
          @click="alternarMenu"
        >
          <Icono nombre="menu" class="h-4 w-4" />
        </button>

        <Icono nombre="casa" class="h-4 w-4" />
        <span>Mi salud</span>
        <Icono nombre="chevronDer" class="h-3.5 w-3.5 text-slate-300" />

        <button
          v-if="vistaActual !== 'LISTA'"
          type="button"
          class="hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          @click="volverALista"
        >
          Mis tratamientos
        </button>
        <span v-else class="font-semibold text-slate-900">Mis tratamientos</span>

        <template v-if="vistaActual !== 'LISTA'">
          <Icono nombre="chevronDer" class="h-3.5 w-3.5 text-slate-300" />
          <span class="font-semibold text-slate-900">
            <!-- Arreglamos la lógica para que muestre el título correcto -->
            {{ 
              vistaActual === 'EDITAR' ? 'Editar tratamiento' : 
              (vistaActual === 'BOTIQUIN' ? 'Mi Botiquín Virtual' : 'Nuevo tratamiento') 
            }}
          </span>
        </template>
      </nav>

      <!-- VISTA 1: LISTADO Y TARJETAS -->
      <TratamientosLista
        v-if="vistaActual === 'LISTA'"
        :historial="historial"
        :cargando="cargandoHistorial"
        @nuevo="vistaActual = 'NUEVO'"
        @alerta="tratamientoAlerta = $event"
        @editar="prepararEdicion"
        @eliminar="eliminarTratamiento"
        @tomar-dosis="registrarTomaDosis"
        @finalizar="finalizarTratamiento" 
      />

      <!-- VISTA 2: REGISTRAR NUEVO TRATAMIENTO -->
      <NuevoTratamiento
        v-else-if="vistaActual === 'NUEVO'"
        @cancelar="volverALista"
        @guardado="alGuardar"
      />

      <!-- VISTA 3: EDITAR PAUTA MÉDICA -->
      <EditarTratamiento
        v-else-if="vistaActual === 'EDITAR' && tratamientoAEditar"
        :key="tratamientoAEditar.idTratamiento"
        :tratamiento-original="tratamientoAEditar"
        @cancelar="volverALista"
        @guardado="alGuardar"
      />

      <!-- VISTA 4: MI BOTIQUÍN (Inventario Libre) -->
      <MiBotiquin 
        v-else-if="vistaActual === 'BOTIQUIN'" 
      />
    </main>

    <AlertaInventarioModal
      :tratamiento="tratamientoAlerta"
      @cerrar="tratamientoAlerta = null"
      @comprar="irAComprar"
    />
  </div>
</template>