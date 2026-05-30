<template>
  <div class="max-w-[70rem] mx-auto">
    
    <router-link to="/productos" class="inline-flex items-center gap-2 text-slate-500 hover:text-medical-blue font-bold mb-8 transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Volver al catálogo
    </router-link>

    <div v-if="cargando" class="flex justify-center items-center py-32">
      <p class="text-xl font-bold text-medical-blue animate-pulse">Cargando información del producto...</p>
    </div>

    <div v-else-if="!producto" class="text-center py-32">
      <h2 class="text-3xl font-black text-slate-800 mb-4">Producto no encontrado</h2>
      <p class="text-slate-500 mb-8">El artículo que buscas no existe o ha sido retirado del inventario.</p>
      <router-link to="/productos" class="bg-medical-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-medical-dark transition-colors shadow-lg">Ver otros productos</router-link>
    </div>

    <div v-else class="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
      
      <div class="w-full md:w-1/2 p-8 lg:p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
        <div class="contenedor-imagen-detalle flex-grow">
          <img 
            :src="urlImagen" 
            :alt="producto.nombre" 
            class="img-detalle-manual drop-shadow-xl"
          >
        </div>
      </div>

      <div class="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        
        <span class="inline-block bg-medical-light text-medical-blue text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest w-max mb-4">
          SKU: {{ producto.codigoSKU }}
        </span>
        
        <h1 class="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-4">
          {{ producto.nombre }}
        </h1>
        
        <div class="text-4xl font-black text-slate-900 mb-6 flex items-end gap-2">
          S/. {{ formatPrecio(producto.precio) }}
        </div>

        <p class="text-slate-500 leading-relaxed mb-8">
          Medicamento / Producto disponible en los almacenes de Botica Estrella. 
          Garantizamos la correcta conservación y trazabilidad del lote.
        </p>

        <hr class="border-slate-100 mb-8">

        <div class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <span class="font-bold text-slate-700">Cantidad</span>
            <span class="text-sm font-bold" :class="stockDisponible > 0 ? 'text-emerald-500' : 'text-red-500'">
              {{ stockDisponible > 0 ? `${stockDisponible} unidades disponibles` : 'Agotado' }}
            </span>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-14 w-40">
              <button @click="decrementar" :disabled="cantidad <= 1 || stockDisponible === 0" class="w-12 h-full flex justify-center items-center text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"></path></svg>
              </button>
              
              <div class="flex-1 text-center font-black text-lg text-slate-800 select-none">
                {{ stockDisponible === 0 ? 0 : cantidad }}
              </div>
              
              <button @click="incrementar" :disabled="cantidad >= stockDisponible || stockDisponible === 0" class="w-12 h-full flex justify-center items-center text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <button 
          @click="agregarAlCarrito"
          :disabled="stockDisponible === 0"
          class="w-full h-14 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="stockDisponible > 0 ? 'bg-medical-blue text-white hover:bg-medical-dark hover:shadow-medical-blue/30' : 'bg-slate-200 text-slate-400'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          {{ stockDisponible > 0 ? 'Agregar al Carrito' : 'Sin Stock' }}
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '@/services/apiClient';
import { carritoStore } from '@/store/carrito';

const route = useRoute();
const producto = ref(null);
const cargando = ref(true);
const cantidad = ref(1);

onMounted(async () => {
  // Capturamos el ID de la URL
  const id = route.params.id;
  try {
    const data = await apiClient.obtenerProductoPorId(id);
    producto.value = data;
  } catch (error) {
    console.error("Error al cargar el producto:", error);
  } finally {
    cargando.value = false;
  }
});

// Construir URL de la imagen
const urlImagen = computed(() => {
  if (!producto.value) return '';
  return apiClient.obtenerUrlImagen(producto.value.idProducto);
});

// Leemos la variable exacta que mapea de tu backend (stockActual)
const stockDisponible = computed(() => {
  return producto.value?.stockActual ?? producto.value?.stock ?? 0;
});

// Lógica de los botones + y -
const incrementar = () => {
  if (cantidad.value < stockDisponible.value) cantidad.value++;
};

const decrementar = () => {
  if (cantidad.value > 1) cantidad.value--;
};

// Dispara la acción de guardar en el store global
const agregarAlCarrito = () => {
  carritoStore.agregar(producto.value, cantidad.value);
  
  // Pequeña alerta nativa para que el cliente sepa que funcionó
  alert(`Se agregaron ${cantidad.value} unidades de ${producto.value.nombre} al carrito.`);
  
  // Reseteamos el selector a 1 por comodidad
  cantidad.value = 1;
};

// Helper de precio
const formatPrecio = (precio) => {
  return Number(precio).toFixed(2);
};
</script>

<style scoped>
/* Contenedor principal con fondo para resaltar el producto */
.contenedor-imagen-detalle {
  position: relative;
  width: 100%;
  min-height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc;
  border-radius: 1.5rem;
}

/* Control absoluto del escalado para mantener proporciones exactas */
.img-detalle-manual {
  max-width: 90%;
  max-height: 280px; 
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>