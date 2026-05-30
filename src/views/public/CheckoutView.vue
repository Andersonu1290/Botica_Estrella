<template>
  <div class="max-w-[70rem] mx-auto py-8">
    <h1 class="text-3xl font-black text-slate-800 mb-8">Finalizar Pedido</h1>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-8 space-y-6">
        
        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs">1</span>
            Datos del Cliente
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Nombre Completo</label>
              <input v-model="form.nombre" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">DNI / RUC</label>
              <input v-model="form.docCliente" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs">2</span>
            Tipo de Comprobante
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <button @click="form.tipoComprobante = 'BOLETA'" :class="form.tipoComprobante === 'BOLETA' ? 'border-medical-blue bg-blue-50' : 'border-slate-200'" class="p-4 border-2 rounded-2xl text-left transition-all">
              <span class="block font-black text-slate-800">Boleta</span>
              <span class="text-xs text-slate-500">Para uso personal</span>
            </button>
            <button @click="form.tipoComprobante = 'FACTURA'" :class="form.tipoComprobante === 'FACTURA' ? 'border-medical-blue bg-blue-50' : 'border-slate-200'" class="p-4 border-2 rounded-2xl text-left transition-all">
              <span class="block font-black text-slate-800">Factura</span>
              <span class="text-xs text-slate-500">Para tu empresa</span>
            </button>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs">3</span>
            Método de Pago
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button v-for="metodo in metodosPago" :key="metodo.id" @click="form.metodoPago = metodo.id" :class="form.metodoPago === metodo.id ? 'border-medical-blue bg-blue-50' : 'border-slate-200'" class="p-4 border-2 rounded-2xl text-center transition-all hover:border-medical-blue">
              <span class="block font-black text-slate-800">{{ metodo.nombre }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4">
        <div class="bg-slate-900 rounded-[2rem] p-8 text-white sticky top-28">
          <h2 class="text-xl font-black mb-6">Resumen del Pedido</h2>
          <div class="space-y-4 mb-8">
            <div class="flex justify-between text-blue-200"><span>Subtotal</span><span>S/. {{ format(carritoStore.subtotalPrecio / 1.18) }}</span></div>
            <div class="flex justify-between text-blue-200"><span>IGV</span><span>S/. {{ format(carritoStore.subtotalPrecio - (carritoStore.subtotalPrecio / 1.18)) }}</span></div>
            <div class="flex justify-between text-xl font-black text-white pt-4 border-t border-white/20"><span>Total</span><span>S/. {{ format(carritoStore.subtotalPrecio) }}</span></div>
          </div>
          
          <button @click="procesarPago" :disabled="procesando" class="w-full bg-medical-accent hover:bg-green-500 py-4 rounded-xl font-black text-lg transition-all active:scale-95 shadow-lg disabled:opacity-50">
            {{ procesando ? 'Procesando...' : 'Confirmar y Pagar' }}
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { carritoStore } from '@/store/carrito';
import { apiClient } from '@/services/apiClient';

const router = useRouter();
const procesando = ref(false);

const form = reactive({
  nombre: '',
  docCliente: '',
  tipoComprobante: 'BOLETA',
  metodoPago: 'TARJETA'
});

// MODIFICA ESTA PARTE EN CheckoutView.vue
const metodosPago = [
  { id: 'pagoTarjeta', nombre: 'Tarjeta' },
  { id: 'pagoTransferencia', nombre: 'Transferencia' },
  { id: 'pagoEfectivo', nombre: 'Efectivo' }
];

const format = (n) => Number(n).toFixed(2);

const procesarPago = async () => {
  if (!form.nombre || !form.docCliente) {
    alert("Por favor completa tus datos de facturación.");
    return;
  }

  procesando.value = true;
  try {
    // Recorremos el carrito enviando una venta por cada ítem
    for (const item of carritoStore.items) {
        for (let i = 0; i < item.cantidad; i++) {
            const payload = {
                idProducto: item.producto.idProducto,
                nroSerie: `WEB-${Date.now()}-${i}`,
                tipoComprobante: form.tipoComprobante,
                idUsuario: 1, // ID quemado por ahora
                docCliente: form.docCliente,
                nombreCliente: form.nombre,
                correoCliente: "cliente@boticaestrella.com",
                metodoPago: form.metodoPago,
                total: item.producto.precio
            };
            await apiClient.procesarVenta(payload);
        }
    }
    
    carritoStore.vaciar();
    router.push('/confirmacion'); // Aquí crearemos la página de éxito
  } catch (err) {
    console.error(err);
    alert("Error en el pago: " + (err.message || "Intenta de nuevo"));
  } finally {
    procesando.value = false;
  }
};
</script>