<template>
  <article class="bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-200 flex flex-col group relative">
    
    <div class="p-6 flex justify-center items-center h-52 bg-slate-50/50 rounded-t-[1.5rem] contenedor-imagen-fija">
      <router-link :to="`/producto/${producto.idProducto}`" class="w-full h-full flex justify-center items-center">
        <img 
          :src="urlImagen" 
          :alt="producto.nombre" 
          class="img-medicamento group-hover:scale-105 transition-transform drop-shadow-md" 
        />
      </router-link>
    </div>

    <div class="p-5 flex flex-col flex-grow border-t border-slate-100">
      <span class="text-[11px] font-black text-slate-400 mb-1 uppercase tracking-widest">
        SKU: {{ producto.codigoSKU }}
      </span>
      
      <h3 class="text-base font-bold text-slate-800 leading-snug mb-4 line-clamp-2">
        <router-link :to="`/producto/${producto.idProducto}`" class="hover:text-medical-blue transition-colors">
          {{ producto.nombre }}
        </router-link>
      </h3>
      
      <div class="flex items-center justify-between mt-auto">
        <span class="text-2xl font-black text-slate-900">S/. {{ formatPrecio(producto.precio) }}</span>
        <!-- SOLO SE AGREGA EL @click -->
        <button 
          @click="agregarProducto" 
          class="bg-slate-100 text-medical-blue hover:bg-medical-blue hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
        >
          +
        </button>
      </div>
    </div>

  </article>
</template>

<script>
import { apiClient } from '@/services/apiClient';
import { carritoStore } from '@/store/carrito'; // SOLO SE AGREGA ESTA IMPORTACIÓN

export default {
  name: 'ProductCard',
  props: {
    // Vue exige que le digamos qué tipo de dato va a recibir
    producto: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Genera la URL dinámica en tiempo real
    urlImagen() {
      return apiClient.obtenerUrlImagen(this.producto.idProducto);
    }
  },
  methods: {
    // Helper para asegurar que el precio siempre tenga 2 decimales
    formatPrecio(precio) {
      return Number(precio).toFixed(2);
    },
    // SOLO SE AGREGA ESTE MÉTODO NUEVO
    agregarProducto() {
      const idUsuario = 1; 
      carritoStore.agregarBD(idUsuario, this.producto, 1);
    }
  }
}
</script>

<style scoped>
/* Contenedor de proporciones estrictas */
.contenedor-imagen-fija {
  position: relative;
  overflow: hidden;
}

/* Ajuste manual preciso para centrado de imágenes y manejo de aspect ratio horizontal */
.img-medicamento {
  max-width: 100%;
  max-height: 130px; /* Control estricto de altura máxima para evitar desbordes */
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>
