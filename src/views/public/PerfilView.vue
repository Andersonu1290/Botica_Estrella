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
            <h2 class="text-xl font-black text-slate-800">{{ usuarioMock.nombre }}</h2>
            <p class="text-slate-500 mb-6">{{ usuarioMock.correo }}</p>
            
            <div class="flex flex-col gap-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Documento</span>
                <span class="font-bold text-slate-700">{{ usuarioMock.documento }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Teléfono</span>
                <span class="font-bold text-slate-700">{{ usuarioMock.telefono }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Miembro desde</span>
                <span class="font-bold text-slate-700">Mayo 2026</span>
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
            <div class="overflow-x-auto">
              <table class="w-full text-left min-w-[600px]">
                <thead>
                  <tr class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th class="p-4 md:px-6 md:py-4">Ticket</th>
                    <th class="p-4 md:px-6 md:py-4">Fecha</th>
                    <th class="p-4 md:px-6 md:py-4 text-right">Total</th>
                    <th class="p-4 md:px-6 md:py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="orden in ordenesMock" :key="orden.ticket" class="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td class="p-4 md:px-6 md:py-5">
                      <span class="font-bold text-slate-800 group-hover:text-medical-blue transition-colors">{{ orden.ticket }}</span>
                      <p class="text-xs text-slate-500 mt-1">{{ orden.metodoPago }}</p>
                    </td>
                    <td class="p-4 md:px-6 md:py-5 text-slate-600 font-medium">
                      {{ orden.fecha }}
                    </td>
                    <td class="p-4 md:px-6 md:py-5 text-right">
                      <span class="font-black text-slate-900">S/. {{ orden.total.toFixed(2) }}</span>
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

            <div class="p-6 text-center border-t border-slate-100">
              <button class="text-sm font-bold text-slate-400 hover:text-medical-blue transition-colors">
                Cargar pedidos anteriores
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// DATOS SIMULADOS (Mock) - En el futuro vendrán de Spring Boot + JWT
const usuarioMock = {
  nombre: "Cliente E-commerce",
  correo: "cliente@boticaestrella.com",
  documento: "74582196",
  telefono: "+51 987 654 321"
};

// Genera las iniciales para el Avatar (ej: "CE")
const inicialesUsuario = computed(() => {
  return usuarioMock.nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
});

// LISTA DE COMPRAS SIMULADAS
const ordenesMock = [
  {
    ticket: "TCK-202605291258",
    fecha: "29 May 2026, 12:58 PM",
    metodoPago: "Tarjeta de Crédito",
    total: 100.40,
    estado: "COMPLETADA"
  },
  {
    ticket: "TCK-202605200915",
    fecha: "20 May 2026, 09:15 AM",
    metodoPago: "Yape / Plin",
    total: 35.50,
    estado: "COMPLETADA"
  },
  {
    ticket: "TCK-202604151642",
    fecha: "15 Abr 2026, 04:42 PM",
    metodoPago: "Efectivo",
    total: 125.30,
    estado: "ANULADA"
  }
];

const cerrarSesion = () => {
  alert("Sesión cerrada (Simulación). Redirigiendo al inicio...");
  router.push('/');
};
</script>