<script setup>
import { ref, onMounted } from 'vue';
import { apiClient } from '@/services/apiClient';
import { authStore } from '@/store/auth';
import Icono from '@/components/smartcare/Icono.vue';

const botiquin = ref([]);
const cargando = ref(true);

onMounted(async () => {
  try {
    botiquin.value = await apiClient.obtenerBotiquin(authStore.usuarioActual.idUsuario);
  } catch (error) {
    console.error("Error al cargar botiquín", error);
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <section>
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Mi Botiquín Virtual</h1>
        <p class="mt-1 text-slate-500">
          Historial completo de los medicamentos que has adquirido y su estado actual.
        </p>
      </div>
    </div>

    <div v-if="cargando" class="py-20 text-center">
      <span class="inline-block h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>

    <div v-else-if="!botiquin.length" class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icono nombre="caja" class="h-6 w-6" />
      </span>
      <p class="font-semibold text-slate-800">Aún no has comprado medicamentos</p>
      <p class="text-slate-500 text-sm mt-1">Los productos que compres en la botica aparecerán aquí automáticamente.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article v-for="item in botiquin" :key="item.idProducto" class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <Icono nombre="caja" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 line-clamp-2 leading-tight">{{ item.nombre }}</h3>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">SKU: {{ item.codigoSKU }}</span>
          </div>
        </div>
        
        <!-- Desglose Inteligente -->
        <div class="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 border border-slate-100 mt-auto">
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Total comprado:</span>
            <span class="font-bold text-slate-700">{{ item.totalComprado }} unds</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Consumido / En uso:</span>
            <span class="font-bold text-slate-700">{{ item.totalAsignado }} unds</span>
          </div>
          
          <div class="flex justify-between items-center pt-3 border-t border-slate-200 mt-1">
            <span class="text-sm font-bold text-slate-800">Stock libre:</span>
            <span class="text-2xl font-black" :class="item.stockLibre > 0 ? 'text-emerald-600' : 'text-red-500'">
              {{ item.stockLibre }} <span class="text-xs font-bold opacity-70">unds</span>
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>