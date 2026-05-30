<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <SidebarFiltros />
    
    <div class="flex-1">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <p class="text-sm text-slate-500 font-medium">
          Mostrando {{ productosFiltrados.length }} productos disponibles del inventario
        </p>
      </div>

      <div v-if="cargando" class="flex justify-center items-center py-20">
        <p class="text-xl font-bold text-medical-blue animate-pulse">Consultando base de datos...</p>
      </div>

      <section v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="item in productosFiltrados" 
          :key="item.idProducto" 
          :producto="item" 
        />
      </section>

      <div v-if="!cargando && productosFiltrados.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <h3 class="text-2xl font-black text-slate-800 mb-2">No hay resultados</h3>
        <p class="text-slate-500">Prueba cambiando el nombre o subiendo el precio máximo.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { apiClient } from '@/services/apiClient';
import SidebarFiltros from '@/components/public/SidebarFiltros.vue';
// 🌟 Asegúrate de que esta ruta y mayúsculas coincidan EXACTAMENTE con tu archivo
import ProductCard from '@/components/public/ProductCard.vue'; 
import { filtrosStore } from '@/store/filtros';

const productos = ref([]);
const cargando = ref(true);

// 🌟 LA MAGIA REACTIVA COMPLETA (Corregida)
const productosFiltrados = computed(() => {
  // 1. Primero filtramos
  let resultado = productos.value.filter(p => {
    const nombreSeguro = p.nombre || ''; 
    const busquedaSegura = filtrosStore.busqueda || '';
    const coincideTexto = nombreSeguro.toLowerCase().includes(busquedaSegura.toLowerCase());
    
    const precioSeguro = p.precio || 0;
    const coincidePrecio = precioSeguro <= filtrosStore.precioMaximo;
    
    const coincideCategoria = filtrosStore.categoria === 'todos' || String(p.idCategoria) === String(filtrosStore.categoria);

    // 🌟 EL ARREGLO DEL STOCK: 
    // Si tu backend no manda "p.stock", intentará leer "p.stockActual" o "p.cantidad".
    // Usamos Number() por si MySQL o Java lo mandan como texto (ej. "174" en vez de 174).
    const cantidadStock = p.stock ?? p.stockActual ?? p.cantidad ?? 0;
    const coincideStock = filtrosStore.soloStock ? Number(cantidadStock) > 0 : true;

    return coincideTexto && coincidePrecio && coincideCategoria && coincideStock;
  });

  // 2. Luego ordenamos
  if (filtrosStore.orden === 'menor-precio') {
    resultado.sort((a, b) => (a.precio || 0) - (b.precio || 0));
  } else if (filtrosStore.orden === 'mayor-precio') {
    resultado.sort((a, b) => (b.precio || 0) - (a.precio || 0));
  } else if (filtrosStore.orden === 'a-z') {
    resultado.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
  }

  return resultado;
});

onMounted(async () => {
  try {
    const data = await apiClient.obtenerProductos();
    productos.value = data;
  } catch (error) {
    console.error("Error BD:", error);
  } finally {
    cargando.value = false;
  }
});
</script>