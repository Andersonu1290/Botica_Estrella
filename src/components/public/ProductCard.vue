<template>
  <article class="bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-200 flex flex-col group relative overflow-hidden">
    
    <div v-if="stockDisponible <= 0" class="absolute top-4 -right-10 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-10 rotate-45 z-10 shadow-md">
      Agotado
    </div>

    <div class="p-6 flex justify-center items-center h-52 bg-slate-50/50 rounded-t-[1.5rem] contenedor-imagen-fija" :class="{'opacity-60 grayscale': stockDisponible <= 0}">
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
        <div class="flex flex-col">
          <span class="text-2xl font-black text-slate-900" :class="{'text-slate-400': stockDisponible <= 0}">S/. {{ formatPrecio(producto.precio) }}</span>
          <span v-if="stockDisponible <= 0" class="text-[10px] font-black text-red-500 uppercase tracking-wider">Sin Stock</span>
          <span v-else-if="stockDisponible < 5" class="text-[10px] font-black text-amber-500 uppercase tracking-wider">¡Quedan {{ stockDisponible }}!</span>
        </div>
        
        <button 
          @click.stop="agregarProducto" 
          :disabled="stockDisponible <= 0"
          :class="stockDisponible <= 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-medical-blue hover:bg-medical-blue hover:text-white cursor-pointer active:scale-95 shadow-sm'"
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all font-bold text-lg select-none duration-100"
        >
          +
        </button>
      </div>
    </div>

  </article>
</template>

<script>
import { apiClient } from '@/services/apiClient';
import { carritoStore } from '@/store/carrito';
import { authStore } from '@/store/auth'; 

export default {
  name: 'ProductCard',
  props: {
    producto: {
      type: Object,
      required: true
    }
  },
  computed: {
    urlImagen() {
      return apiClient.obtenerUrlImagen(this.producto.idProducto);
    },
    // 🔥 Calculamos el stock real que le pasamos al template
    stockDisponible() {
      return this.producto.stockActual ?? this.producto.stock ?? 0;
    }
  },
  methods: {
    formatPrecio(precio) {
      return Number(precio).toFixed(2);
    },
    agregarProducto() {
      if (this.stockDisponible <= 0) {
        alert("Lo sentimos, este producto se encuentra agotado.");
        return;
      }

      if (!authStore.estaLogueado) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        this.$router.push('/login');
        return;
      }
      
      const idUsuario = authStore.usuarioActual.idUsuario; 
      carritoStore.agregarBD(idUsuario, this.producto, 1);
    }
  }
}
</script>

<style scoped>
.contenedor-imagen-fija {
  position: relative;
  overflow: hidden;
}

.img-medicamento {
  max-width: 100%;
  max-height: 130px; 
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>