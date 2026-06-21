<template>
  <div class="max-w-4xl mx-auto py-12 px-4 w-full">
    
    <div class="text-center mb-10">
      <div class="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight">¡Pago Procesado con Éxito!</h1>
      <p class="text-slate-500 text-lg">Tu pedido ya entró a nuestra cola de logística.</p>
    </div>

    <div class="bg-white max-w-2xl mx-auto shadow-2xl overflow-hidden border border-slate-200 relative">
      
      <div class="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZjhmYWZjIi8+PC9zdmc+')]"></div>

      <div class="text-center p-8 pt-12 border-b-2 border-dashed border-slate-300 bg-slate-50">
        <h2 class="text-2xl font-black text-slate-800 uppercase tracking-widest">Botica Estrella S.A.C.</h2>
        <p class="text-sm text-slate-500 font-mono mt-2">RUC: 20546987123</p>
        <p class="text-sm text-slate-500 font-mono">Av. Garcilaso de la Vega 1348, Lima</p>

        <div class="mt-8 border-4 border-slate-800 p-4 md:p-6 inline-block bg-white shadow-sm">
          <p class="text-lg md:text-xl font-black text-slate-800 uppercase tracking-widest">COMPROBANTE DE PEDIDO WEB</p>
          <p class="text-2xl font-mono font-bold text-medical-blue mt-2">{{ ticketGenerado || 'CARGANDO...' }}</p>
        </div>
      </div>

      <div class="p-16 text-center" v-if="cargando">
        <span class="animate-spin inline-block w-10 h-10 border-4 border-medical-blue border-t-transparent rounded-full mb-4"></span>
        <p class="text-slate-500 font-mono text-sm uppercase tracking-widest">Recuperando detalles de la orden...</p>
      </div>

      <div class="p-6 md:p-10" v-else-if="pedido">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div>
            <span class="font-bold text-slate-400">FECHA DE EMISIÓN:</span><br> 
            <span class="text-slate-800 font-bold">{{ formatearFecha(pedido.fechaPedido) }}</span>
          </div>
          <div>
            <span class="font-bold text-slate-400">MÉTODO DE PAGO:</span><br> 
            <span class="text-slate-800 font-bold uppercase">{{ pedido.tipoPago.replace('_', ' ') }}</span>
          </div>
          <div class="md:col-span-2">
            <span class="font-bold text-slate-400">CLIENTE RECEPTOR:</span><br> 
            <span class="text-slate-800 font-bold uppercase">{{ pedido.nombreCliente }} {{ pedido.apellidoCliente || '' }}</span>
          </div>
          <div class="md:col-span-2">
            <span class="font-bold text-slate-400">DIRECCIÓN DE DESTINO:</span><br> 
            <span class="text-slate-800 font-bold uppercase">{{ pedido.direccionEnvio }} {{ pedido.numeroCalle || '' }}, {{ pedido.ciudad }}</span>
          </div>
        </div>

        <table class="w-full text-sm font-mono mb-8">
          <thead>
            <tr class="border-y-2 border-dashed border-slate-300 text-slate-500">
              <th class="py-3 text-left w-12">CANT</th>
              <th class="py-3 text-left">DESCRIPCIÓN</th>
              <th class="py-3 text-right w-28">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pedido.detalles" :key="item.idDetalle" class="border-b border-slate-100">
              <td class="py-4 align-top font-bold">{{ item.cantidad }}</td>
              <td class="py-4 pr-4 uppercase text-slate-700">{{ item.nombreProducto }}</td>
              <td class="py-4 text-right align-top font-bold">S/ {{ formatPrecio(item.subtotal) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="w-full md:w-2/3 ml-auto text-sm font-mono space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div class="flex justify-between text-slate-500">
            <span>SUBTOTAL:</span>
            <span>S/ {{ formatPrecio(pedido.subtotal / 1.18) }}</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>IGV (18%):</span>
            <span>S/ {{ formatPrecio(pedido.subtotal - (pedido.subtotal / 1.18)) }}</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>FLETE ({{ pedido.tipoEnvio }}):</span>
            <span>S/ {{ formatPrecio(pedido.costoEnvio) }}</span>
          </div>
          <div class="flex justify-between text-xl font-black text-slate-800 border-t-2 border-dashed border-slate-300 pt-4 mt-2">
            <span>TOTAL PAGADO:</span>
            <span>S/ {{ formatPrecio(pedido.total) }}</span>
          </div>
        </div>

      </div>

      <div class="p-6 bg-slate-50 text-center border-t border-slate-200">
        <p class="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-relaxed">
          Documento interno de control e-commerce.<br>
          Se ha enviado el comprobante oficial (Boleta/Factura) a su correo electrónico.<br>
          Gracias por su compra.
        </p>
      </div>

    </div>

    <div class="max-w-2xl mx-auto mt-10 flex flex-col sm:flex-row gap-4">
      <router-link to="/perfil" class="flex-1 bg-medical-blue text-white py-4 rounded-xl font-black text-lg hover:bg-medical-dark transition-all text-center shadow-lg active:scale-95">
        Rastrear mi pedido
      </router-link>
      <router-link to="/" class="flex-1 bg-white text-slate-600 border-2 border-slate-200 py-4 rounded-xl font-black text-lg hover:border-medical-blue hover:text-medical-blue transition-all text-center active:scale-95">
        Volver a la Tienda
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { authStore } from '@/store/auth';
import { apiClient } from '@/services/apiClient';

const route = useRoute();
const ticketGenerado = ref('');
const pedido = ref(null);
const cargando = ref(true);

const formatPrecio = (precio) => Number(precio).toFixed(2);

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '-';
  if (Array.isArray(fechaStr)) {
    const [year, month, day, hour = 0, minute = 0] = fechaStr;
    const fechaObj = new Date(year, month - 1, day, hour, minute);
    return fechaObj.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
  return new Date(fechaStr).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  // 🌟 EL FIX DEL SCROLL PARA EVITAR EL ESPACIO BLANCO ABAJO
  window.scrollTo(0, 0);
  setTimeout(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, 50);

  // 🌟 OBTENER LOS DATOS REALES DE LA BASE DE DATOS
  if (route.query.ticket) {
    ticketGenerado.value = route.query.ticket;
    
    if (authStore.estaLogueado) {
      try {
        const compras = await apiClient.obtenerMisCompras(authStore.usuarioActual.idUsuario);
        // Buscamos el pedido exacto que acaba de generar por su NroPedido (Ej: PED-2026-00001)
        pedido.value = compras.find(c => c.nroPedido === ticketGenerado.value);
      } catch (error) {
        console.error("Error cargando el comprobante:", error);
      } finally {
        cargando.value = false;
      }
    }
  } else {
    cargando.value = false;
  }
});
</script>