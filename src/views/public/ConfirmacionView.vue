<template>
  <!-- print:bg-white y print:py-0 limpian los fondos grises y los márgenes cuando se abre el diálogo de impresión -->
  <div class="max-w-4xl mx-auto py-12 px-4 w-full bg-slate-50 min-h-screen print:bg-white print:min-h-0 print:py-0">
    
    <!-- Mensaje de Éxito (Se oculta mágicamente al imprimir) -->
    <div class="text-center mb-10 print:hidden">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 class="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">Pago Procesado con Éxito</h1>
      <p class="text-slate-500">Tu pedido ha sido registrado y el comprobante ha sido emitido.</p>
    </div>

    <!-- Pantalla de Carga (Se oculta al imprimir) -->
    <div class="p-16 text-center print:hidden" v-if="cargando">
      <span class="animate-spin inline-block w-10 h-10 border-4 border-medical-blue border-t-transparent rounded-full mb-4"></span>
      <p class="text-slate-500 font-mono text-sm uppercase tracking-widest">Generando documento SUNAT...</p>
    </div>

    <!-- ========================================== -->
    <!-- COMPROBANTE ELECTRÓNICO ESTILO SUNAT       -->
    <!-- ========================================== -->
    <div v-else-if="pedido" class="bg-white max-w-3xl mx-auto shadow-xl border border-gray-300 p-8 md:p-12 relative print:shadow-none print:border-none print:p-0 comprobante-wrapper">
      
      <!-- Cabecera del Documento -->
      <div class="flex flex-col sm:flex-row print:flex-row justify-between items-start border-b-2 border-gray-800 pb-8 mb-8 gap-6">
        
        <!-- Datos de la Empresa -->
        <div class="flex-1">
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">Botica Estrella S.A.C.</h2>
          <div class="mt-3 text-xs sm:text-sm text-slate-700 font-mono space-y-1">
            <p>AV. GARCILASO DE LA VEGA 1348, CERCADO DE LIMA</p>
            <p>LIMA - LIMA - LIMA</p>
            <p>TELÉFONO: (01) 555-1234</p>
            <p>WEB: WWW.BOTICAESTRELLA.COM</p>
          </div>
        </div>

        <!-- Recuadro SUNAT -->
        <div class="w-full sm:w-72 print:w-72 border-2 border-slate-800 rounded-xl text-center py-4 bg-white shrink-0">
          <p class="text-lg font-black text-slate-800">R.U.C. 20546987123</p>
          <div class="bg-slate-800 py-2 my-3 print-bg-dark">
            <p class="text-lg font-black text-white uppercase tracking-widest print-text-white">{{ tipoDocumentoTitulo }}</p>
          </div>
          <p class="text-xl font-bold text-slate-800 font-mono">{{ folioReal }}</p>
        </div>
      </div>

      <!-- Datos del Cliente (Forzamos las 2 columnas en impresión) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-x-4 gap-y-3 text-xs sm:text-sm font-mono mb-8 text-slate-800">
        <div>
          <span class="font-bold text-slate-500">FECHA DE EMISIÓN:</span> 
          <span class="ml-2 font-bold">{{ formatearFecha(pedido.fechaPedido) }}</span>
        </div>
        <div>
          <span class="font-bold text-slate-500">FORMA DE PAGO:</span> 
          <span class="ml-2 uppercase">{{ pedido.tipoPago.replace('_', ' ') }}</span>
        </div>
        <div class="col-span-1 sm:col-span-2 print:col-span-2">
          <span class="font-bold text-slate-500">{{ labelCliente }}:</span> 
          <span class="ml-2 uppercase">{{ pedido.nombreCliente }} {{ pedido.apellidoCliente || '' }}</span>
        </div>
        <div class="col-span-1 sm:col-span-2 print:col-span-2">
          <span class="font-bold text-slate-500">DIRECCIÓN:</span> 
          <span class="ml-2 uppercase">{{ pedido.direccionEnvio }} {{ pedido.numeroCalle || '' }}, {{ pedido.ciudad }}</span>
        </div>
        <div class="col-span-1 sm:col-span-2 print:col-span-2">
          <span class="font-bold text-slate-500">NRO. PEDIDO INTERNO:</span> 
          <span class="ml-2 uppercase">{{ pedido.nroPedido }}</span>
        </div>
      </div>

      <!-- Tabla de Productos Detallada -->
      <table class="w-full text-xs sm:text-sm font-mono mb-8 border-collapse">
        <thead>
          <tr class="border-y-2 border-slate-800 text-slate-800 bg-slate-50 print-bg-light">
            <th class="py-3 px-2 text-center w-16 font-bold">CANT.</th>
            <th class="py-3 px-2 text-left font-bold">DESCRIPCIÓN DEL PRODUCTO</th>
            <th class="py-3 px-2 text-right w-24 font-bold">V. UNIT</th>
            <th class="py-3 px-2 text-right w-28 font-bold">IMPORTE</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="item in pedido.detalles" :key="item.idDetalle">
            <td class="py-3 px-2 text-center align-top">{{ item.cantidad }}</td>
            <td class="py-3 px-2 uppercase align-top">{{ item.nombreProducto }}</td>
            <td class="py-3 px-2 text-right align-top">S/ {{ formatPrecio(item.precioUnitario / 1.18) }}</td>
            <td class="py-3 px-2 text-right align-top">S/ {{ formatPrecio((item.precioUnitario / 1.18) * item.cantidad) }}</td>
          </tr>
          <!-- Fila del servicio de envío -->
          <tr v-if="pedido.costoEnvio > 0">
            <td class="py-3 px-2 text-center align-top">1</td>
            <td class="py-3 px-2 uppercase align-top">SERVICIO DE FLETE / ENVÍO ({{ pedido.tipoEnvio }})</td>
            <td class="py-3 px-2 text-right align-top">S/ {{ formatPrecio(pedido.costoEnvio / 1.18) }}</td>
            <td class="py-3 px-2 text-right align-top">S/ {{ formatPrecio(pedido.costoEnvio / 1.18) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Resumen Financiero y Totales -->
      <div class="flex flex-col sm:flex-row print:flex-row justify-between items-end gap-6 border-t-2 border-slate-800 pt-6">
        
        <!-- Código de barras y Hash simulado -->
        <div class="w-full sm:w-1/2 print:w-1/2 text-center sm:text-left print:text-left">
          <div class="inline-block border border-slate-300 p-2 bg-white mb-2">
            <!-- Simulación visual de código de barras usando bordes -->
            <div class="h-12 w-48 flex items-end justify-between px-2 bg-[repeating-linear-gradient(90deg,#0f172a_0px,#0f172a_2px,transparent_2px,transparent_5px,#0f172a_5px,#0f172a_6px,transparent_6px,transparent_10px)]">
            </div>
          </div>
          <p class="text-[9px] text-slate-500 font-mono break-all">
            Hash: {{ generarHashSimulado(pedido.nroPedido) }}
          </p>
        </div>

        <!-- Cuadro de Totales -->
        <div class="w-full sm:w-1/2 print:w-1/2 sm:max-w-xs text-sm font-mono space-y-2">
          <div class="flex justify-between text-slate-700">
            <span>OP. GRAVADA:</span>
            <span>S/ {{ formatPrecio(calcularOpGravada()) }}</span>
          </div>
          <div class="flex justify-between text-slate-700">
            <span>OP. INAFECTA:</span>
            <span>S/ 0.00</span>
          </div>
          <div class="flex justify-between text-slate-700">
            <span>IGV (18%):</span>
            <span>S/ {{ formatPrecio(calcularIGV()) }}</span>
          </div>
          <div class="flex justify-between text-lg font-black text-slate-900 border-t border-slate-300 pt-2 mt-2">
            <span>IMPORTE TOTAL:</span>
            <span>S/ {{ formatPrecio(pedido.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Pie legal -->
      <div class="mt-12 text-center">
        <p class="text-[10px] text-slate-500 font-mono uppercase leading-relaxed">
          Representación impresa del Comprobante Electrónico.<br>
          Podrá ser consultado en www.sunat.gob.pe<br>
          Autorizado mediante Resolución de Superintendencia N° 155-2017/SUNAT
        </p>
      </div>

    </div>

    <!-- Botones de Navegación (Se ocultan al imprimir) -->
    <div class="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
      <button @click="imprimirComprobante" class="flex-1 bg-slate-800 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-700 transition-all text-center shadow-lg active:scale-95 flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Imprimir Comprobante
      </button>
      <router-link to="/perfil" class="flex-1 bg-medical-blue text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-medical-dark transition-all text-center shadow-lg active:scale-95">
        Ir a Mi Cuenta
      </router-link>
      <router-link to="/" class="flex-1 bg-white text-slate-600 border-2 border-slate-200 py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:border-slate-300 hover:bg-slate-50 transition-all text-center active:scale-95">
        Continuar Comprando
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { authStore } from '@/store/auth';
import { apiClient } from '@/services/apiClient';

const route = useRoute();
const ticketGenerado = ref('');
const pedido = ref(null);
const cargando = ref(true);

const formatPrecio = (precio) => Number(precio).toFixed(2);

const esFactura = computed(() => {
  if (!pedido.value || !pedido.value.observaciones) return false;
  return pedido.value.observaciones.toUpperCase().includes('FACTURA');
});

const tipoDocumentoTitulo = computed(() => {
  return esFactura.value ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA';
});

const labelCliente = computed(() => {
  return esFactura.value ? 'SEÑOR(ES) / RAZÓN SOCIAL' : 'CLIENTE';
});

const folioReal = computed(() => {
  if (!ticketGenerado.value) return '';
  const prefijo = esFactura.value ? 'F001' : 'B001';
  const partes = ticketGenerado.value.split('-');
  const correlativo = partes.length === 3 ? partes[2] : '000001';
  return `${prefijo}-${correlativo}`;
});

const calcularOpGravada = () => {
  if (!pedido.value) return 0;
  return pedido.value.total / 1.18;
};

const calcularIGV = () => {
  if (!pedido.value) return 0;
  return pedido.value.total - (pedido.value.total / 1.18);
};

const generarHashSimulado = (codigo) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let hash = '';
  for (let i = 0; i < 28; i++) hash += chars.charAt(Math.floor(Math.random() * chars.length));
  return hash + '=';
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '-';
  if (Array.isArray(fechaStr)) {
    const [year, month, day] = fechaStr;
    const fechaObj = new Date(year, month - 1, day);
    return fechaObj.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  return new Date(fechaStr).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const imprimirComprobante = () => {
  window.print();
};

onMounted(async () => {
  window.scrollTo(0, 0);
  setTimeout(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, 50);

  if (route.query.ticket) {
    ticketGenerado.value = route.query.ticket;
    
    if (authStore.estaLogueado) {
      try {
        const compras = await apiClient.obtenerMisCompras(authStore.usuarioActual.idUsuario);
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

<!-- 🌟 MAGIA NEGRA DE CSS PARA IMPRESIÓN 🌟 -->
<style>
@media print {
  /* Obliga a Chrome/Edge a imprimir los colores de fondo como el recuadro negro del RUC */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* Oculta la barra de navegación, el footer azul y el chatbot (Están en PublicLayout.vue) */
  header, footer, #chatbot-container {
    display: none !important;
  }
  
  /* Elimina márgenes y paddings para que la hoja A4 se vea limpia */
  body, main {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }
  
  /* Forzamos colores que Tailwind a veces pierde al imprimir */
  .print-bg-dark { background-color: #1e293b !important; }
  .print-bg-light { background-color: #f8fafc !important; }
  .print-text-white { color: #ffffff !important; }

  /* Configuración de página A4 sin encabezados del navegador */
  @page {
    margin: 1cm;
    size: portrait;
  }
}
</style>