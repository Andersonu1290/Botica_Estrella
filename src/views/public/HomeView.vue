<template>
  <div class="space-y-12 w-full">
    
    <section class="relative w-full h-[300px] md:h-[450px] rounded-[2rem] overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
      <img src="/img/delivery.png" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="Delivery" />

      <div class="absolute inset-0 bg-gradient-to-r from-medical-dark/90 via-medical-dark/50 to-transparent z-20 flex items-center p-8 md:p-16">
        <div class="text-white max-w-xl">
          <span class="inline-block py-1 px-3 rounded-full bg-medical-blue text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">Novedad</span>
          <h1 class="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg leading-tight">
            Cuida tu salud <br />
            sin salir de casa
          </h1>
          <p class="text-blue-100 mb-8 text-lg md:text-xl drop-shadow-md">Medicamentos y productos de cuidado personal al alcance de un clic. Envío rápido y seguro.</p>
          <router-link to="/productos" class="inline-flex items-center gap-2 bg-medical-accent hover:bg-green-500 text-white font-black py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-green-500/30">
            Comprar ahora
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </router-link>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-black text-slate-800 flex items-center gap-2 mb-6">
        <svg class="w-6 h-6 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        Categorías Principales
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link to="/productos" class="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl hover:border-medical-blue transition-all flex items-center gap-4 group">
          <div class="w-16 h-16 bg-blue-50 text-medical-blue rounded-[1rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💊</div>
          <div>
            <h3 class="font-black text-slate-800 text-lg group-hover:text-medical-blue transition-colors">Medicamentos</h3>
            <p class="text-sm text-slate-500 font-medium">Pastillas, jarabes, inyectables</p>
          </div>
        </router-link>
        <router-link to="/productos" class="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl hover:border-medical-blue transition-all flex items-center gap-4 group">
          <div class="w-16 h-16 bg-blue-50 text-medical-blue rounded-[1rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🧴</div>
          <div>
            <h3 class="font-black text-slate-800 text-lg group-hover:text-medical-blue transition-colors">Cuidado Personal</h3>
            <p class="text-sm text-slate-500 font-medium">Higiene, cremas, dermocosmética</p>
          </div>
        </router-link>
        <router-link to="/productos" class="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl hover:border-medical-blue transition-all flex items-center gap-4 group">
          <div class="w-16 h-16 bg-blue-50 text-medical-blue rounded-[1rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🍼</div>
          <div>
            <h3 class="font-black text-slate-800 text-lg group-hover:text-medical-blue transition-colors">Mamá y Bebé</h3>
            <p class="text-sm text-slate-500 font-medium">Pañales, leches, accesorios</p>
          </div>
        </router-link>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-black text-slate-800 flex items-center gap-2">
          <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          Destacados del Mes
        </h2>
        <router-link to="/productos" class="text-medical-blue font-bold hover:underline text-sm hidden sm:block">Ver todo el catálogo →</router-link>
      </div>

      <div v-if="cargando" class="text-slate-400 font-bold">Cargando productos...</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="item in destacados" 
          :key="item.idProducto" 
          :producto="item" 
        />
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiClient } from '@/services/apiClient';
import ProductCard from '@/components/public/ProductCard.vue';
import { filtrosStore } from '@/store/filtros';

const destacados = ref([]);
const cargando = ref(true);

onMounted(async () => {
  // Limpieza de filtros
  filtrosStore.busqueda = '';
  filtrosStore.precioMaximo = 200;
  filtrosStore.categoria = 'todos';
  filtrosStore.soloStock = false;

  try {
    const data = await apiClient.obtenerProductos();
    // Asignamos a 'destacados' y no a 'productos'
    destacados.value = Array.isArray(data) ? data.slice(0, 4) : [];
  } catch (error) {
    console.error("Error al cargar:", error);
  } finally {
    cargando.value = false;
  }
});
</script>