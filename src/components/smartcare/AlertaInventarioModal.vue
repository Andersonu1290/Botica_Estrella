<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import Icono from '@/components/smartcare/Icono.vue';

const props = defineProps({
  tratamiento: { type: Object, default: null },
});
const emit = defineEmits(['cerrar', 'comprar']);

const dias = computed(() => props.tratamiento?.diasRestantes ?? 0);
const titulo = computed(() => {
  if (dias.value <= 0) return 'Ya no te queda medicamento';
  return dias.value === 1 ? 'Solo queda 1 día' : `Solo quedan ${dias.value} días`;
});

const alPulsarTecla = (e) => {
  if (e.key === 'Escape' && props.tratamiento) emit('cerrar');
};
onMounted(() => window.addEventListener('keydown', alPulsarTecla));
onUnmounted(() => window.removeEventListener('keydown', alPulsarTecla));
</script>

<template>
  <div
    v-if="tratamiento"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
    @click.self="emit('cerrar')"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-alerta"
      class="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
    >
      <button
        type="button"
        class="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        aria-label="Cerrar"
        @click="emit('cerrar')"
      >
        <Icono nombre="cerrar" class="h-6 w-6" />
      </button>

      <span class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Icono nombre="alerta" class="h-8 w-8" />
      </span>

      <h2 id="titulo-alerta" class="text-2xl font-bold text-slate-900">Inventario crítico</h2>
      <p class="mb-4 mt-1 font-semibold text-red-600">{{ titulo }}</p>
      <p class="mb-6 text-sm leading-relaxed text-slate-500">
        Repón tu medicamento a tiempo para no interrumpir el tratamiento.
      </p>

      <div class="mb-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
          <Icono nombre="pastilla" class="h-5 w-5" />
        </span>
        <div class="min-w-0">
          <p class="truncate font-semibold text-slate-900">{{ tratamiento.nombreMedicamento }}</p>
          <p class="text-sm text-slate-500">
            {{ tratamiento.stockActual }} unidades disponibles, una dosis cada
            {{ tratamiento.frecuenciaHoras }} horas
          </p>
        </div>
      </div>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        @click="emit('comprar')"
      >
        <Icono nombre="bolsa" class="h-5 w-5" />
        Comprar nuevamente
      </button>
      <button
        type="button"
        class="mt-2 w-full rounded-xl py-3 font-medium text-slate-500 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        @click="emit('cerrar')"
      >
        Ahora no
      </button>
    </div>
  </div>
</template>
