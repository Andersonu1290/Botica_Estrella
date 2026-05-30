<template>
  <aside class="w-full lg:w-72 flex-shrink-0">
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 sticky top-28">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-black text-slate-800 flex items-center gap-2">
          <svg class="w-5 h-5 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          Filtros
        </h2>
        <button @click="limpiarFiltros" class="text-xs font-bold text-slate-400 hover:text-medical-blue uppercase tracking-wide cursor-pointer">Limpiar Todo</button>
      </div>

      <div class="mb-8">
        <h3 class="text-sm font-bold text-slate-800 mb-3">Categoría Principal</h3>
        <div class="relative">
          <select v-model="filtrosStore.categoria" class="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl py-3 px-4 appearance-none outline-none focus:ring-2 focus:ring-medical-blue cursor-pointer transition-colors">
            <option value="todos">Todos los Productos</option>
            <option v-for="cat in listaCategorias" :key="cat.idCategoria" :value="cat.idCategoria">
              {{ cat.nombre }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <hr class="border-slate-100 mb-6">

      <div class="mb-8">
        <h3 class="text-sm font-bold text-slate-800 mb-3">Ordenar por</h3>
        <div class="relative">
          <select v-model="filtrosStore.orden" class="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl py-3 px-4 appearance-none outline-none focus:ring-2 focus:ring-medical-blue cursor-pointer transition-colors">
            <option value="defecto">Recomendados</option>
            <option value="menor-precio">Menor Precio</option>
            <option value="mayor-precio">Mayor Precio</option>
            <option value="a-z">Alfabético (A-Z)</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <hr class="border-slate-100 mb-6">

      <div class="mb-8">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex justify-between">
          Precio Máx <span class="text-medical-blue font-black">S/. {{ filtrosStore.precioMaximo }}</span>
        </h3>
        <input type="range" min="0" max="200" step="5" v-model="filtrosStore.precioMaximo" class="w-full outline-none accent-medical-blue">
        <div class="flex justify-between text-xs text-slate-400 font-bold mt-2">
          <span>S/. 0</span>
          <span>S/. 200+</span>
        </div>
      </div>

      <div class="mt-4">
        <label class="flex items-center gap-3 cursor-pointer group">
          <div class="relative flex items-center justify-center w-6 h-6 rounded-md border-2 border-slate-300 group-hover:border-medical-blue transition-colors" :class="{'bg-medical-blue border-medical-blue': filtrosStore.soloStock}">
            <input type="checkbox" v-model="filtrosStore.soloStock" class="absolute opacity-0 w-full h-full cursor-pointer">
            <svg v-if="filtrosStore.soloStock" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <span class="text-sm font-bold text-slate-700 group-hover:text-medical-blue transition-colors">Solo productos en stock</span>
        </label>
      </div>

    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { filtrosStore } from '@/store/filtros';
import { apiClient } from '@/services/apiClient';

// 🌟 Variable reactiva para almacenar la lista de categorías de BD
const listaCategorias = ref([]);

// 🌟 Cuando el componente se carga en pantalla, pedimos la info al backend
onMounted(async () => {
  listaCategorias.value = await apiClient.obtenerCategorias();
});

const limpiarFiltros = () => {
  filtrosStore.busqueda = '';
  filtrosStore.categoria = 'todos';
  filtrosStore.precioMaximo = 200;
  filtrosStore.orden = 'defecto';
  filtrosStore.soloStock = false;
};
</script>