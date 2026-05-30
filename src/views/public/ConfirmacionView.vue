<template>
  <div class="max-w-2xl mx-auto py-16 px-4">
    
    <div class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden">
      
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent"></div>

      <div class="relative z-10 w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>

      <h1 class="text-3xl md:text-4xl font-black text-slate-800 mb-4">¡Pedido Confirmado!</h1>
      <p class="text-slate-500 mb-10 leading-relaxed">
        Gracias por confiar en <strong>Botica Estrella</strong>. Tu compra ha sido procesada con éxito y nuestro equipo de logística ya está preparando tu pedido.
      </p>

      <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Número de Ticket / Comprobante</p>
        <span class="text-2xl font-mono font-black text-medical-blue tracking-tight select-all">
          {{ ticketGenerado || 'TCK-2026-GENERANDO...' }}
        </span>
      </div>

      <div class="space-y-4">
        <router-link to="/" class="block w-full bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-medical-blue transition-all active:scale-95 shadow-lg">
          Volver al Inicio
        </router-link>
        <router-link to="/perfil" class="block w-full text-slate-500 font-bold py-4 rounded-xl hover:text-medical-blue hover:bg-slate-50 transition-all">
          Ver historial de pedidos
        </router-link>
      </div>
    </div>

    <p class="text-center text-slate-400 text-sm mt-8">
      Te hemos enviado un correo de confirmación a tu bandeja de entrada.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Si quisieras traer el ticket real desde el router o una store, lo harías aquí:
const ticketGenerado = ref('');

onMounted(() => {
  // Aquí podrías recuperar el ticket que generó el backend 
  // si lo pasas por params o store al redirigir desde CheckoutView
  console.log("Confirmación de compra cargada exitosamente.");
});
</script>