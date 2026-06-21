<template>
  <div class="max-w-3xl mx-auto py-16 px-4 w-full">
    
    <div class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden">
      
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent"></div>

      <div class="relative z-10 w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>

      <h1 class="text-3xl md:text-4xl font-black text-slate-800 mb-4">¡Pedido Confirmado!</h1>
      <p class="text-slate-500 mb-8 leading-relaxed">
        Gracias por confiar en <strong>Botica Estrella</strong>. Tu compra ha sido procesada con éxito y nuestro equipo de logística ya está preparando tu pedido.
      </p>

      <div class="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 mb-8 text-left shadow-inner">
        <h3 class="text-lg font-black text-slate-800 border-b border-slate-200 pb-4 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Resumen de tu Orden
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Número de Pedido</p>
            <span class="text-lg font-mono font-black text-medical-blue tracking-tight select-all">
              {{ ticketGenerado || 'PROCESANDO...' }}
            </span>
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pagado</p>
            <span class="text-lg font-black text-slate-800">
              S/. {{ pedidoRelacionado ? Number(pedidoRelacionado.total).toFixed(2) : '...' }}
            </span>
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comprobante Solicitado</p>
            <span class="text-sm font-bold text-slate-700 uppercase">
              {{ tipoComprobante }}
            </span>
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Método de Pago</p>
            <span class="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
              <span v-if="pedidoRelacionado && pedidoRelacionado.tipoPago.includes('TARJETA')" class="w-8 h-5 bg-slate-800 rounded-sm inline-block"></span>
              {{ pedidoRelacionado ? pedidoRelacionado.tipoPago.replace('_', ' ') : '...' }}
            </span>
          </div>
          <div class="md:col-span-2 bg-white p-4 rounded-xl border border-slate-100 mt-2">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino del Envío</p>
            <span class="text-sm font-bold text-slate-700">
              {{ pedidoRelacionado ? `${pedidoRelacionado.direccionEnvio}, ${pedidoRelacionado.ciudad}` : 'Cargando dirección...' }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <router-link to="/" class="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-medical-blue transition-all active:scale-95 shadow-lg">
          Volver al Inicio
        </router-link>
        <router-link to="/perfil" class="flex-1 text-slate-600 border-2 border-slate-200 font-bold py-4 rounded-xl hover:text-medical-blue hover:border-medical-blue hover:bg-slate-50 transition-all">
          Ver historial de pedidos
        </router-link>
      </div>
    </div>

    <p class="text-center text-slate-400 text-sm mt-8">
      Te hemos enviado el detalle de tu compra y tu comprobante a tu correo electrónico.
    </p>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router'; 
import { authStore } from '@/store/auth';
import { apiClient } from '@/services/apiClient';

const route = useRoute();
const ticketGenerado = ref('');
const pedidoRelacionado = ref(null);

// Computamos si el cliente pidió Boleta o Factura (Lo guardamos en observaciones durante el checkout)
const tipoComprobante = computed(() => {
  if (pedidoRelacionado.value && pedidoRelacionado.value.observaciones) {
    if (pedidoRelacionado.value.observaciones.includes('FACTURA')) return 'Factura Electrónica';
    if (pedidoRelacionado.value.observaciones.includes('BOLETA')) return 'Boleta Electrónica';
  }
  return 'Comprobante Electrónico';
});

onMounted(async () => {
  // 🌟 DOBLE MAGIA PARA EL SCROLL: 
  // Aseguramos que el DOM se haya renderizado y obligamos al navegador a subir instantáneamente
  await nextTick();
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Fallback: A veces Vue Router restaura el scroll tarde, este timeout le gana a la animación
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 50);

  if (route.query.ticket) {
    ticketGenerado.value = route.query.ticket;
    
    // 🌟 HACEMOS LA VISTA REALISTA:
    // Traemos el pedido directo desde Spring Boot usando el cliente logueado
    if (authStore.estaLogueado) {
      try {
        const compras = await apiClient.obtenerMisCompras(authStore.usuarioActual.idUsuario);
        // Filtramos para agarrar el pedido exacto que acaba de pagar
        pedidoRelacionado.value = compras.find(c => c.nroPedido === ticketGenerado.value);
      } catch (error) {
        console.error("No se pudo obtener el detalle del pedido para la confirmación", error);
      }
    }
  }
});
</script>