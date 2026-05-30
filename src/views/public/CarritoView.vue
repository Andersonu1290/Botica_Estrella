<template>
  <div class="max-w-[90rem] mx-auto">
    <h1 class="text-3xl font-black text-slate-800 mb-8">Mi Carrito de Compras</h1>

    <div v-if="carritoStore.items.length === 0" class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-16 text-center">
      <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
      </div>
      <h2 class="text-2xl font-black text-slate-800 mb-2">Tu carrito está vacío</h2>
      <p class="text-slate-500 mb-8">Parece que aún no has agregado ningún medicamento o herramienta.</p>
      <router-link to="/productos" class="inline-flex bg-medical-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-medical-dark transition-colors shadow-lg">
        Explorar el Catálogo
      </router-link>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-8">
      
      <div class="flex-1">
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          
          <div class="p-6 border-b border-slate-100 hidden sm:grid grid-cols-12 gap-4 items-center">
            <div class="col-span-6 text-xs font-black text-slate-400 uppercase tracking-widest">Producto</div>
            <div class="col-span-3 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Cantidad</div>
            <div class="col-span-2 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</div>
            <div class="col-span-1"></div>
          </div>

          <div class="divide-y divide-slate-100 relative">
            <div v-if="carritoStore.cargando" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
               <span class="animate-spin w-8 h-8 border-4 border-medical-blue border-t-transparent rounded-full"></span>
            </div>

            <div v-for="item in carritoStore.items" :key="item.idItem" class="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-6 items-center group" :class="{'opacity-50': procesandoId === item.idItem}">
              
              <div class="col-span-12 sm:col-span-6 flex items-center gap-4 w-full">
                <div class="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 p-2 contenedor-imagen-fija">
                  <img :src="apiClient.obtenerUrlImagen(item.producto.idProducto)" :alt="item.producto.nombre" class="img-carrito-manual">
                </div>
                <div>
                  <span class="text-[10px] font-black text-medical-blue uppercase tracking-widest block mb-1">SKU: {{ item.producto.codigoSKU }}</span>
                  <router-link :to="`/producto/${item.producto.idProducto}`" class="text-base font-bold text-slate-800 hover:text-medical-blue transition-colors line-clamp-2">
                    {{ item.producto.nombre }}
                  </router-link>
                  <p class="text-sm font-bold text-slate-500 mt-1">S/. {{ formatPrecio(item.producto.precio) }} c/u</p>
                </div>
              </div>

              <div class="col-span-12 sm:col-span-3 flex justify-center w-full mt-4 sm:mt-0">
                <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden h-10 w-32">
                  <button @click="disminuir(item)" :disabled="item.cantidad <= 1 || procesandoId === item.idItem" class="w-10 h-full flex justify-center items-center text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"></path></svg>
                  </button>
                  <div class="flex-1 text-center font-black text-sm text-slate-800 select-none">
                    {{ item.cantidad }}
                  </div>
                  <button @click="aumentar(item)" :disabled="item.cantidad >= (item.producto.stockActual ?? item.producto.stock ?? 0) || procesandoId === item.idItem" class="w-10 h-full flex justify-center items-center text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                </div>
              </div>

              <div class="col-span-12 sm:col-span-2 text-right w-full mt-2 sm:mt-0">
                <span class="text-lg font-black text-slate-900">S/. {{ formatPrecio(item.producto.precio * item.cantidad) }}</span>
              </div>

              <div class="col-span-12 sm:col-span-1 flex justify-end w-full mt-2 sm:mt-0">
                <button @click="eliminar(item)" :disabled="procesandoId === item.idItem" class="text-slate-300 hover:text-red-500 disabled:opacity-50 transition-colors p-2" title="Eliminar producto">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <aside class="w-full lg:w-96 flex-shrink-0">
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8 sticky top-28">
          <h2 class="text-xl font-black text-slate-800 mb-6">Resumen del Pedido</h2>
          
          <div class="space-y-4 mb-6">
            <div class="flex justify-between items-center text-slate-500">
              <span class="font-bold">Subtotal</span>
              <span class="font-bold text-slate-800">S/. {{ formatPrecio(subtotalSinIgv) }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-500">
              <span class="font-bold">IGV (18%)</span>
              <span class="font-bold text-slate-800">S/. {{ formatPrecio(igvCalculado) }}</span>
            </div>
          </div>

          <hr class="border-slate-100 mb-6">

          <div class="flex justify-between items-center mb-8">
            <span class="text-lg font-black text-slate-800">Total a Pagar</span>
            <span class="text-3xl font-black text-medical-blue">S/. {{ formatPrecio(carritoStore.subtotalPrecio) }}</span>
          </div>

          <button @click="irAPagar" class="w-full bg-slate-900 text-white h-14 rounded-xl font-black text-lg hover:bg-medical-blue transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2 mb-4">
            Ir a Pagar
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
          
          <router-link to="/productos" class="block w-full text-center text-sm font-bold text-slate-500 hover:text-medical-blue transition-colors py-2">
            Seguir comprando
          </router-link>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { carritoStore } from '@/store/carrito';
import { authStore } from '@/store/auth';
import { apiClient } from '@/services/apiClient';

const router = useRouter();
const procesandoId = ref(null); // Variable para bloquear botones de una fila mientras se actualiza en BD

const formatPrecio = (precio) => Number(precio).toFixed(2);
const subtotalSinIgv = computed(() => carritoStore.subtotalPrecio / 1.18);
const igvCalculado = computed(() => carritoStore.subtotalPrecio - subtotalSinIgv.value);

// Actualizamos en BD agregando +1 a la cantidad existente
const aumentar = async (item) => {
  const stock = item.producto.stockActual ?? item.producto.stock ?? 0;
  if (item.cantidad < stock && authStore.estaLogueado) {
    procesandoId.value = item.idItem;
    await carritoStore.agregarBD(authStore.usuarioActual.idUsuario, item.producto, 1);
    procesandoId.value = null;
  }
};

// Actualizamos en BD restando -1 a la cantidad existente
const disminuir = async (item) => {
  if (item.cantidad > 1 && authStore.estaLogueado) {
    procesandoId.value = item.idItem;
    // Mandamos un -1 para que el backend reste de la cantidad actual
    await carritoStore.agregarBD(authStore.usuarioActual.idUsuario, item.producto, -1);
    procesandoId.value = null;
  }
};

// Eliminamos físicamente la fila de la BD usando el id_item
const eliminar = async (item) => {
  if (authStore.estaLogueado) {
    procesandoId.value = item.idItem;
    await carritoStore.eliminarProductoBD(authStore.usuarioActual.idUsuario, item.idItem);
    procesandoId.value = null;
  }
};

// Verificamos sesión antes de mandarlo al checkout
const irAPagar = () => {
  if (!authStore.estaLogueado) {
    router.push('/login?redirect=/checkout');
  } else {
    router.push('/checkout');
  }
};
</script>

<style scoped>
.contenedor-imagen-fija {
  position: relative;
  overflow: hidden;
}

.img-carrito-manual {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>