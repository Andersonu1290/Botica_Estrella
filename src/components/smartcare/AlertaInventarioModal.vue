<script setup>
import { ref, computed } from 'vue';
import { authStore } from '@/store/auth';

const props = defineProps({
  tratamiento: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['cerrar', 'comprar']);

// Estado para alternar entre la alerta normal y el simulador de WhatsApp
const mostrandoWhatsapp = ref(false);

const cerrarModal = () => {
  mostrandoWhatsapp.value = false;
  emit('cerrar');
};

const nombreUsuario = computed(() => {
  return authStore.usuarioActual?.username || 'Paciente';
});
</script>

<template>
  <div v-if="tratamiento" class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    
    <!-- MODAL PRINCIPAL (ALERTA) -->
    <div v-if="!mostrandoWhatsapp" class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-in-up">
      <button @click="cerrarModal" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="p-8 text-center">
        <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-inner">
          <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        
        <h2 class="text-xs font-black tracking-widest text-red-500 uppercase mb-1">SmartCare Predictivo</h2>
        <h3 class="mb-2 text-2xl font-bold text-slate-900">Inventario Crítico</h3>
        <p class="mb-6 text-slate-500 font-medium">Revisa tus existencias y gestiona la reposición para no interrumpir tu medicación.</p>
        
        <div class="mb-8 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
          <p class="text-sm font-bold text-slate-800">{{ tratamiento.nombreMedicamento }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ tratamiento.stockActual }} unidades disponibles ({{ tratamiento.frecuenciaHoras }} h).</p>
        </div>

        <div class="flex flex-col gap-3">
          <button @click="$emit('comprar')" class="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            COMPRAR NUEVAMENTE EN BOTICA ESTRELLA
          </button>
          <button @click="mostrandoWhatsapp = true" class="w-full rounded-xl border-2 border-emerald-100 bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-100 transition-colors">
            SIMULAR ALERTA WHATSAPP
          </button>
        </div>
      </div>
    </div>

    <!-- SIMULADOR WHATSAPP -->
    <div v-else class="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#efeae2] shadow-2xl animate-fade-in-up border-8 border-slate-900">
      
      <!-- Cabecera WhatsApp -->
      <div class="bg-[#075e54] px-4 py-3 flex items-center gap-3 shadow-md relative z-10">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#075e54] font-black text-xl shrink-0">★</div>
        <div class="flex-1">
          <h4 class="text-white font-bold leading-tight">Botica Estrella Bot</h4>
          <p class="text-white/80 text-[11px]">En línea • Notificación Automática</p>
        </div>
        <button @click="cerrarModal" class="text-white/80 hover:text-white">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Cuerpo del Chat -->
      <div class="p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover min-h-[300px]">
        <!-- Fecha -->
        <div class="flex justify-center mb-4">
          <span class="bg-white/90 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm">HOY</span>
        </div>

        <!-- Burbuja de Mensaje -->
        <div class="bg-white p-3 rounded-tr-xl rounded-b-xl shadow-sm max-w-[90%] relative">
          <!-- Triangulito de la burbuja -->
          <div class="absolute top-0 -left-2 w-3 h-3 bg-white" style="clip-path: polygon(100% 0, 0 0, 100% 100%);"></div>
          
          <p class="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
            <span class="text-blue-500">⚕️</span> AVISO DE REPOSICIÓN SMARTCARE
          </p>
          <p class="text-sm text-slate-800 mb-3 leading-relaxed">
            Hola <strong>{{ nombreUsuario }}</strong>, tu tratamiento con <strong>{{ tratamiento.nombreMedicamento }}</strong> está por agotarse.
          </p>
          <p class="text-sm text-slate-800 mb-3 leading-relaxed">
            Te quedan pastillas para <strong>{{ tratamiento.diasRestantes || 'poco' }} días</strong> ({{ tratamiento.stockActual }} unidades disponibles).
          </p>
          <p class="text-sm text-slate-800 mb-3 leading-relaxed">
            Para no cortar tu tratamiento, puedes reponer con entrega rápida aquí:
          </p>
          <a href="#" @click.prevent="$emit('comprar')" class="text-blue-500 text-sm font-medium hover:underline break-all">
            https://boticaestrella.com/catalogo
          </a>
          
          <div class="flex justify-end mt-1">
            <span class="text-[10px] text-slate-400">Ahora</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>