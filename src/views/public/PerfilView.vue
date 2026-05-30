<template>
  <div class="max-w-[80rem] mx-auto py-8">
    
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mi Cuenta</h1>
        <p class="text-slate-500 font-medium">Gestiona tu información y revisa tus compras</p>
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
            <p class="text-slate-500 mb-6">Cliente Web</p>
            
            <div class="flex flex-col gap-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Rol</span>
                <span class="font-bold text-slate-700">{{ usuarioActivo.rol || 'CLIENTE' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Estado</span>
                <span class="font-bold text-emerald-500">Activo</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Total Compras</span>
                <span class="font-bold text-slate-700">{{ comprasRealizadas.length }}</span>
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
            <div v-if="comprasRealizadas.length === 0" class="text-center py-12 text-slate-500">
              Aún no has realizado ninguna compra.
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full text-left min-w-[600px]">
                <thead>
                  <tr class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th class="p-4 md:px-6 md:py-4">Detalle del Pedido</th>
                    <th class="p-4 md:px-6 md:py-4">Fecha</th>
                    <th class="p-4 md:px-6 md:py-4 text-right">Total</th>
                    <th class="p-4 md:px-6 md:py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="orden in comprasRealizadas" :key="orden.ticket" class="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td class="p-4 md:px-6 md:py-5">
                      <span class="font-bold text-slate-800 group-hover:text-medical-blue transition-colors">{{ orden.ticket }}</span>
                      <p class="text-xs font-black text-medical-blue mt-1 uppercase">{{ orden.producto }}</p>
                      <p class="text-xs text-slate-500 mt-1">Pago: {{ orden.metodoPago }}</p>
                    </td>
                    <td class="p-4 md:px-6 md:py-5 text-slate-600 font-medium">
                      {{ formatearFechaServidor(orden.fecha) }}
                    </td>
                    <td class="p-4 md:px-6 md:py-5 text-right">
                      <span class="font-black text-slate-900">S/. {{ Number(orden.total).toFixed(2) }}</span>
                    </td>
                    <td class="p-4 md:px-6 md:py-5 text-center">
                      <span 
                        class="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase"
                        :class="{
                          'bg-emerald-100 text-emerald-600': orden.estado === 'COMPLETADA',
                          'bg-amber-100 text-amber-600': orden.estado === 'PENDIENTE',
                          'bg-red-100 text-red-500': orden.estado === 'ANULADA'
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

// 🌟 Consultamos a Spring Boot cuando la pantalla carga
onMounted(async () => {
  if (authStore.estaLogueado && usuarioActivo.value.idUsuario) {
    comprasRealizadas.value = await apiClient.obtenerMisCompras(usuarioActivo.value.idUsuario);
  } else {
    router.push('/login'); // Redirigimos si intenta entrar sin sesión
  }
});

// 🌟 Formateamos la fecha que llega desde MySQL (Timestamp)
const formatearFechaServidor = (fechaStr) => {
  if (!fechaStr) return 'Fecha no disponible';
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