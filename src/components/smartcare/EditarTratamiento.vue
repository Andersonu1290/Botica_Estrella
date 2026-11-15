<script setup>
import { ref, computed } from 'vue';
import { apiClient } from '@/services/apiClient';
import { authStore } from '@/store/auth';
import Icono from '@/components/smartcare/Icono.vue';

const props = defineProps({
  tratamientoOriginal: { type: Object, required: true }
});

const emit = defineEmits(['cancelar', 'guardado']);

// Clonamos los datos originales para no mutar la lista principal hasta que se guarde
const formulario = ref({ ...props.tratamientoOriginal });
const guardando = ref(false);
const errorGuardar = ref('');

// Opciones dinámicas para la frecuencia
const opcionesFrecuencia = computed(() => {
  const base = [4, 6, 8, 12, 24];
  const actual = Number(formulario.value.frecuenciaHoras);
  if (actual > 0 && !base.includes(actual)) base.push(actual);
  return base.sort((a, b) => a - b);
});

const puedeGuardar = computed(() => {
  const f = formulario.value;
  return f.dosis.trim() && f.unidadMedida.trim() && Number(f.cantidadPorToma) > 0 && Number(f.frecuenciaHoras) > 0 && !guardando.value;
});

const guardarEdicion = async () => {
  if (!puedeGuardar.value) return;
  guardando.value = true;
  errorGuardar.value = '';
  try {
    await apiClient.actualizarTratamiento(
      formulario.value.idTratamiento, 
      formulario.value, 
      authStore.usuarioActual.idUsuario
    );
    emit('guardado');
  } catch (error) {
    errorGuardar.value = error.message || 'Error al actualizar el tratamiento.';
  } finally {
    guardando.value = false;
  }
};

const campo = 'block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30';
</script>

<template>
  <section class="pb-16 max-w-3xl mx-auto">
    <button @click="emit('cancelar')" class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600">
      <Icono nombre="flechaIzq" class="h-4 w-4" /> De vuelta a mis tratamientos
    </button>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-8 py-6 bg-slate-50/50 border-b border-slate-100">
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Icono nombre="pastilla" class="w-5 h-5" />
          </span>
          Editar pauta médica
        </h1>
        <p class="text-slate-500 mt-2 text-sm">Modificando: <strong class="text-slate-800">{{ formulario.nombreMedicamento }}</strong></p>
      </div>

      <div class="p-8 space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Dosis (Concentración)</label>
            <input v-model="formulario.dosis" type="text" :class="campo" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Unidad de medida</label>
            <select v-model="formulario.unidadMedida" :class="campo">
              <option value="tableta">Tabletas / Pastillas</option>
              <option value="cápsula">Cápsulas</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="cucharada">Cucharadas</option>
              <option value="unidad">Unidades genéricas</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Cantidad por toma</label>
            <input v-model.number="formulario.cantidadPorToma" type="number" min="1" :class="campo" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Frecuencia</label>
            <select v-model.number="formulario.frecuenciaHoras" :class="campo">
              <option v-for="h in opcionesFrecuencia" :key="h" :value="h">Cada {{ h }} horas</option>
            </select>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
          <Icono nombre="info" class="w-5 h-5 shrink-0 text-blue-600" />
          <p>Al guardar, el sistema recalculará matemáticamente tu fecha de agotamiento basándose en el inventario que te queda ({{ formulario.stockActual }} unidades).</p>
        </div>

        <p v-if="errorGuardar" class="text-red-600 text-sm font-bold bg-red-50 p-3 rounded-lg">{{ errorGuardar }}</p>

        <div class="flex gap-4 pt-4">
          <button @click="emit('cancelar')" class="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors">Cancelar</button>
          <button @click="guardarEdicion" :disabled="!puedeGuardar" class="flex-1 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
            <span v-if="guardando" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            Actualizar Tratamiento
          </button>
        </div>
      </div>
    </div>
  </section>
</template>