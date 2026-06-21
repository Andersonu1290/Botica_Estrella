<template>
  <div class="max-w-[80rem] mx-auto py-8 px-4 sm:px-6 lg:px-8">
    
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mi Cuenta</h1>
        <p class="text-slate-500 font-medium">Gestiona tu información y revisa tus pedidos</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-4 space-y-6">
        
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-medical-blue to-blue-400"></div>
          
          <div class="relative z-10">
            <div class="w-24 h-24 bg-white rounded-full mx-auto border-4 border-white shadow-md flex items-center justify-center text-4xl font-black text-medical-blue mb-4">
              {{ inicialesUsuario }}
            </div>
            <h2 class="text-xl font-black text-slate-800">{{ usuarioActivo.username }}</h2>
            <p class="text-slate-500 mb-6">Cliente Frecuente</p>
            
            <div class="flex flex-col gap-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Rol</span>
                <span class="font-bold text-slate-700">{{ usuarioActivo.rol || 'CLIENTE' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Estado</span>
                <span class="font-bold text-emerald-500 flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Activo
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Total Pedidos</span>
                <span class="font-bold text-medical-blue">{{ comprasRealizadas.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <button @click="cerrarSesion" class="w-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl py-4 font-black transition-colors flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Cerrar Sesión
        </button>

      </div>

      <div class="lg:col-span-8">
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          
          <div class="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 class="text-xl font-black text-slate-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              Mis Pedidos Recientes
            </h2>
          </div>

          <div class="p-0 md:p-4">
            <div v-if="comprasRealizadas.length === 0" class="text-center py-16 px-4">
              <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
              <h3 class="text-lg font-black text-slate-700 mb-2">Aún no has realizado compras</h3>
              <p class="text-slate-500 mb-6">Explora nuestro catálogo y encuentra lo que necesitas.</p>
              <router-link to="/productos" class="inline-flex bg-medical-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-medical-dark transition-colors">
                Ir al Catálogo
              </router-link>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full text-left min-w-[650px]">
                <thead>
                  <tr class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th class="p-4 md:px-6 md:py-4">Detalle del Pedido</th>
                    <th class="p-4 md:px-6 md:py-4">Fecha y Envío</th>
                    <th class="p-4 md:px-6 md:py-4 text-right">Total</th>
                    <th class="p-4 md:px-6 md:py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="orden in comprasRealizadas" :key="orden.nroPedido" class="hover:bg-slate-50 transition-colors">
                    
                    <td class="p-4 md:px-6 md:py-5">
                      <div class="flex flex-col gap-1">
                        <span class="font-black text-medical-blue uppercase tracking-tight">{{ orden.nroPedido }}</span>
                        
                        <ul class="mt-2 space-y-1">
                          <li v-for="item in orden.detalles" :key="item.idDetalle" class="text-xs text-slate-600 flex gap-2">
                            <span class="font-bold text-slate-800">{{ item.cantidad }}x</span>
                            <span class="truncate max-w-[200px]" :title="item.nombreProducto">{{ item.nombreProducto }}</span>
                          </li>
                        </ul>
                      </div>
                    </td>

                    <td class="p-4 md:px-6 md:py-5">
                      <p class="text-sm text-slate-800 font-bold mb-1">{{ formatearFechaServidor(orden.fechaPedido) }}</p>
                      <div class="flex flex-col gap-0.5 text-xs text-slate-500">
                        <span>Envío: <strong class="text-slate-700">{{ orden.tipoEnvio }}</strong></span>
                        <span>Pago: <strong class="text-slate-700">{{ orden.tipoPago.replace('_', ' ') }}</strong></span>
                      </div>
                    </td>

                    <td class="p-4 md:px-6 md:py-5 text-right">
                      <span class="font-black text-slate-900 text-lg block">S/. {{ Number(orden.total).toFixed(2) }}</span>
                      <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Incluye IGV</span>
                    </td>

                    <td class="p-4 md:px-6 md:py-5 text-center">
                      <span 
                        class="inline-block px-3 py-1.5 rounded-lg text-[11px] font-black tracking-widest uppercase shadow-sm border"
                        :class="{
                          'bg-emerald-50 text-emerald-600 border-emerald-200': orden.estado === 'ENTREGADO' || orden.estado === 'PAGADO',
                          'bg-amber-50 text-amber-600 border-amber-200': orden.estado === 'PENDIENTE' || orden.estado === 'PROCESANDO',
                          'bg-blue-50 text-medical-blue border-blue-200': orden.estado === 'ENVIADO',
                          'bg-red-50 text-red-500 border-red-200': orden.estado === 'CANCELADO' || orden.estado === 'ANULADA'
                        }"
                      >
                        {{ orden.estado }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/store/auth';
import { apiClient } from '@/services/apiClient';

const router = useRouter();
const comprasRealizadas = ref([]);

// 🌟 Obtenemos al usuario real de la tienda reactiva
const usuarioActivo = computed(() => authStore.usuarioActual || { username: 'Invitado' });

const inicialesUsuario = computed(() => {
  return usuarioActivo.value.username
    ? usuarioActivo.value.username.substring(0, 2).toUpperCase()
    : 'US';
});

// 🌟 Consultamos al Backend usando la API actualizada
onMounted(async () => {
  if (authStore.estaLogueado && usuarioActivo.value.idUsuario) {
    comprasRealizadas.value = await apiClient.obtenerMisCompras(usuarioActivo.value.idUsuario);
  } else {
    router.push('/login'); 
  }
});

// 🌟 Formateamos la fecha que llega desde MySQL (Soporta Timestamp y Arrays ISO)
const formatearFechaServidor = (fechaStr) => {
  if (!fechaStr) return 'Pendiente';
  
  // Spring Boot a veces devuelve las fechas como arrays [año, mes, dia, hora, minuto]
  if (Array.isArray(fechaStr)) {
    const [year, month, day, hour = 0, minute = 0] = fechaStr;
    const fechaObj = new Date(year, month - 1, day, hour, minute);
    return fechaObj.toLocaleDateString('es-PE', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  return new Date(fechaStr).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const cerrarSesion = () => {
  authStore.cerrarSesion();
  router.push('/');
};
</script>