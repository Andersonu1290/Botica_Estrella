<template>
  <div class="max-w-4xl mx-auto py-12 px-4 w-full bg-slate-50 min-h-[70vh]">
    
    <!-- Botón Volver -->
    <router-link to="/perfil" class="inline-flex items-center gap-2 text-slate-500 hover:text-medical-blue font-bold mb-8 transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Volver a mis pedidos
    </router-link>

    <!-- Estado de Carga -->
    <div class="p-16 text-center" v-if="cargando">
      <span class="animate-spin inline-block w-10 h-10 border-4 border-medical-blue border-t-transparent rounded-full mb-4"></span>
      <p class="text-slate-500 font-mono text-sm uppercase tracking-widest">Buscando paquete...</p>
    </div>

    <div v-else-if="pedido" class="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
      
      <!-- Cabecera -->
      <div class="bg-slate-900 p-8 md:p-10 text-white">
        <div class="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <span class="text-blue-300 text-xs font-black uppercase tracking-widest block mb-2">Estado del Envío</span>
            <h1 class="text-3xl md:text-4xl font-black tracking-tight">{{ mensajeEstado }}</h1>
          </div>
          <div class="text-left md:text-right">
            <span class="text-slate-400 text-xs font-bold uppercase tracking-widest block">Nro. de Pedido</span>
            <span class="text-xl font-mono font-bold text-white">{{ pedido.nroPedido }}</span>
          </div>
        </div>
      </div>

      <!-- Línea de Tiempo (Stepper) -->
      <div class="p-8 md:p-12 border-b border-slate-100">
        <div class="relative">
          <!-- Línea de fondo -->
          <div class="absolute top-6 left-6 right-6 h-1 bg-slate-100 rounded-full z-0 hidden md:block"></div>
          
          <!-- Línea de progreso dinámica -->
          <div class="absolute top-6 left-6 h-1 bg-medical-blue rounded-full z-0 transition-all duration-1000 hidden md:block" :style="{ width: progresoAncho }"></div>

          <div class="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
            
            <!-- Paso 1: Confirmado -->
            <div class="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div class="w-12 h-12 rounded-full flex items-center justify-center font-black transition-colors" :class="pasoActual >= 1 ? 'bg-medical-blue text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-if="pasoActual > 1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                <span v-else>1</span>
              </div>
              <div class="text-left md:text-center">
                <p class="font-bold text-slate-800">Confirmado</p>
                <p class="text-xs text-slate-500">Orden recibida</p>
              </div>
            </div>

            <!-- Paso 2: Procesando -->
            <div class="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div class="w-12 h-12 rounded-full flex items-center justify-center font-black transition-colors" :class="pasoActual >= 2 ? 'bg-medical-blue text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-if="pasoActual > 2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                <span v-else>2</span>
              </div>
              <div class="text-left md:text-center">
                <p class="font-bold text-slate-800">Preparando</p>
                <p class="text-xs text-slate-500">En almacén</p>
              </div>
            </div>

            <!-- Paso 3: Enviado -->
            <div class="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div class="w-12 h-12 rounded-full flex items-center justify-center font-black transition-colors" :class="pasoActual >= 3 ? 'bg-medical-blue text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-if="pasoActual > 3"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                <span v-else>3</span>
              </div>
              <div class="text-left md:text-center">
                <p class="font-bold text-slate-800">En Camino</p>
                <p class="text-xs text-slate-500">Con el motorizado</p>
              </div>
            </div>

            <!-- Paso 4: Entregado -->
            <div class="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div class="w-12 h-12 rounded-full flex items-center justify-center font-black transition-colors" :class="pasoActual >= 4 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-400'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-if="pasoActual >= 4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                <span v-else>4</span>
              </div>
              <div class="text-left md:text-center">
                <p class="font-bold text-slate-800">Entregado</p>
                <p class="text-xs text-slate-500">En tus manos</p>
              </div>
            </div>

          </div>
        </div>

        <!-- Si está cancelado -->
        <div v-if="pasoActual === -1" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 text-red-600">
          <svg class="w-8 h-8 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <p class="font-black text-lg">Pedido Cancelado</p>
            <p class="text-sm">Este pedido fue anulado y ya no se encuentra en curso.</p>
          </div>
        </div>
      </div>

      <!-- Detalles del Envío -->
      <div class="p-8 md:p-10 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Destino
          </h3>
          <p class="text-slate-700 font-bold">{{ pedido.nombreCliente }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ pedido.direccionEnvio }} {{ pedido.numeroCalle || '' }}</p>
          <p class="text-slate-500 text-sm">{{ pedido.ciudad }}, {{ pedido.departamento }}</p>
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Tiempos Estimados
          </h3>
          <p class="text-slate-500 text-sm">Tipo de Servicio: <strong class="text-slate-800">{{ pedido.tipoEnvio }}</strong></p>
          <p class="text-slate-500 text-sm mt-1">Estimado: <strong class="text-slate-800">{{ formatearFecha(pedido.fechaEntregaEstimada) }}</strong></p>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { authStore } from '@/store/auth';
import { apiClient } from '@/services/apiClient';

const route = useRoute();
const pedido = ref(null);
const cargando = ref(true);

const pasoActual = computed(() => {
  if (!pedido.value) return 1;
  const estado = pedido.value.estado;
  if (estado === 'CANCELADO' || estado === 'ANULADA') return -1;
  if (estado === 'PENDIENTE') return 1;
  if (estado === 'PAGADO' || estado === 'PROCESANDO') return 2;
  if (estado === 'ENVIADO') return 3;
  if (estado === 'ENTREGADO') return 4;
  return 1;
});

const progresoAncho = computed(() => {
  if (pasoActual.value <= 1) return '0%';
  if (pasoActual.value === 2) return '33%';
  if (pasoActual.value === 3) return '66%';
  if (pasoActual.value >= 4) return '100%';
  return '0%';
});

const mensajeEstado = computed(() => {
  if (pasoActual.value === -1) return 'Cancelado';
  if (pasoActual.value === 1) return 'Pedido Recibido';
  if (pasoActual.value === 2) return 'Preparando tu pedido';
  if (pasoActual.value === 3) return '¡Paquete en camino!';
  if (pasoActual.value === 4) return 'Paquete Entregado';
  return 'Procesando...';
});

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '-';
  if (Array.isArray(fechaStr)) {
    const [year, month, day] = fechaStr;
    return new Date(year, month - 1, day).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  return new Date(fechaStr).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(async () => {
  window.scrollTo(0, 0);

  if (route.query.ticket && authStore.estaLogueado) {
    try {
      const compras = await apiClient.obtenerMisCompras(authStore.usuarioActual.idUsuario);
      pedido.value = compras.find(c => c.nroPedido === route.query.ticket);
    } catch (error) {
      console.error("Error cargando el seguimiento:", error);
    } finally {
      cargando.value = false;
    }
  } else {
    cargando.value = false;
  }
});
</script>