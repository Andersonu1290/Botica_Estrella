<script setup>
import { ref, computed } from 'vue';
import Icono from '@/components/smartcare/Icono.vue';

const props = defineProps({
  historial: { type: Array, default: () => [] },
  cargando: { type: Boolean, default: false },
});

const emit = defineEmits(['nuevo', 'alerta', 'editar', 'eliminar', 'tomar-dosis', 'finalizar']);

const orden = ref('urgencia');
const menuAbierto = ref(null);
const pestanaActual = ref('ACTIVOS'); 

// ---------- 1. Separamos los datos reales ----------
const activos = computed(() => props.historial.filter(t => t.estado === 'ACTIVO'));
const finalizados = computed(() => props.historial.filter(t => t.estado === 'FINALIZADO'));

// ---------- 2. Matemáticas Inteligentes (Conectadas a la BD) ----------
const aFecha = (valor) => {
  const [y, m, d] = String(valor).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

const calcularProxima = (t) => {
  if (t.estado !== 'ACTIVO') return null;
  const freq = Number(t.frecuenciaHoras);
  if (!freq || !t.fechaInicio || !t.horaPrimeraDosis) return null;

  const [h, min] = String(t.horaPrimeraDosis).split(':').map(Number);
  const base = aFecha(t.fechaInicio);
  base.setHours(h, min, 0, 0);

  // MAGIA MATEMÁTICA: ¿Cuántas tomas ya se registró en la Base de Datos?
  // (Cantidad Inicial con la que se creó el tratamiento - Stock Actual del tratamiento) / Pastillas por toma
  const tomasConsumidas = Math.floor((t.cantidadInicial - t.stockActual) / t.cantidadPorToma);
  const tomasValidas = Math.max(0, tomasConsumidas);

  // La próxima toma exacta es: Hora Base + (Tomas ya consumidas * Frecuencia en horas)
  const proximaTime = base.getTime() + (tomasValidas * freq * 3600000);
  
  // Si ya se acabó el stock de este tratamiento, no hay próxima toma
  if (t.stockActual < t.cantidadPorToma) return null;

  return new Date(proximaTime);
};

// ---------- 3. Control de Seguridad Médica ----------
const esHoraDeTomar = (t) => {
  if (!t.proxima) return false;
  // Habilitamos el botón 30 minutos antes por si el paciente se adelanta un poco
  return Date.now() >= (t.proxima.getTime() - (30 * 60 * 1000));
};

const intentarTomarDosis = (t) => {
  // Si aún no es la hora, lanzamos la advertencia, pero permitimos forzarlo (Modo Prueba)
  if (!esHoraDeTomar(t)) {
    const forzarToma = confirm(
      `⚠️ AÚN NO ES LA HORA\n\nTu próxima dosis de ${t.nombreMedicamento} está programada para las ${hora(t.proxima)} h.\n\n¿Estás seguro de que deseas adelantar y registrar la toma ahora mismo para probar el sistema?`
    );
    
    // Si el usuario le da a "Cancelar", detenemos la ejecución
    if (!forzarToma) {
      return; 
    }
  }
  
  // Si ya es la hora, o si el usuario le dio a "Aceptar" en la advertencia, disparamos el evento al backend
  emit('tomar-dosis', t);
};

// ---------- 4. Utilidades visuales ----------
const hora = (f) => f.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
const etiquetaDia = (f) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dia = new Date(f);
  dia.setHours(0, 0, 0, 0);
  const diff = Math.round((dia - hoy) / 86400000);
  const fecha = f.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });
  if (diff === 0) return `Hoy, ${fecha}`;
  if (diff === 1) return `Mañana, ${fecha}`;
  return fecha;
};

const textoDias = (n) => {
  if (n <= 0) return 'Se agotó';
  return n === 1 ? 'Queda 1 día' : `Quedan ${n} días`;
};

const filas = computed(() => {
  const fuente = pestanaActual.value === 'ACTIVOS' ? activos.value : finalizados.value;
  const lista = fuente.map((t) => ({ ...t, proxima: calcularProxima(t) }));
  
  if (orden.value === 'proxima') {
    return lista.sort((a, b) => (a.proxima?.getTime() ?? Infinity) - (b.proxima?.getTime() ?? Infinity));
  }
  return lista.sort((a, b) => a.diasRestantes - b.diasRestantes);
});

// ---------- 5. KPIs Dinámicos ----------
const kpiProxima = computed(() => {
  // Solo analizamos los tratamientos activos que tengan una próxima toma calculada
  const conHora = activos.value
    .map(t => ({...t, proxima: calcularProxima(t)}))
    .filter((t) => t.proxima);

  if (!conHora.length) return null;

  // Ordenamos para mostrar siempre la toma más urgente (la que esté más cerca en el tiempo)
  const ordenados = conHora.sort((a, b) => a.proxima.getTime() - b.proxima.getTime());
  const t = ordenados[0];

  return {
    hora: hora(t.proxima),
    detalle: `${etiquetaDia(t.proxima)}, ${t.nombreMedicamento}`,
  };
});

const criticos = computed(() => activos.value.filter((t) => t.alertaCritica).length);

const fechaHoy = computed(() => {
  const txt = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
});
</script>

<template>
  <section>
    <!-- Encabezado -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Mis tratamientos</h1>
        <p class="mt-1 text-slate-500">
          Tu medicación, organizada. Consulta tus próximas tomas y lo que te queda.
        </p>
      </div>
      <button type="button" class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700" @click="emit('nuevo')">
        <Icono nombre="mas" class="h-5 w-5" />
        Nuevo tratamiento
      </button>
    </div>

    <!-- KPIs Dinámicos -->
    <div class="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icono nombre="pastilla" class="h-5 w-5" /></span>
        <div>
          <p class="text-slate-500">
            <span class="text-2xl font-bold text-slate-900">{{ activos.length }}</span>
            {{ activos.length === 1 ? 'tratamiento activo' : 'tratamientos activos' }}
          </p>
          <p class="text-xs font-bold text-emerald-500">Y {{ finalizados.length }} completados</p>
        </div>
      </div>
      <div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icono nombre="reloj" class="h-5 w-5" /></span>
        <div v-if="kpiProxima">
          <p class="text-slate-500"><span class="text-2xl font-bold text-slate-900">{{ kpiProxima.hora }}</span> próxima toma</p>
          <p class="text-xs font-bold text-slate-500">{{ kpiProxima.detalle }}</p>
        </div>
        <div v-else>
          <p class="font-bold text-slate-900 mt-1">Sin tomas pendientes</p>
          <p class="text-xs text-slate-400">Todo al día</p>
        </div>
      </div>
      <!-- KPI 3: Alertas de Reposición -->
      <div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl" :class="criticos ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'">
          <Icono :nombre="criticos ? 'alerta' : 'check'" class="h-5 w-5" />
        </span>
        <div>
          <p class="text-slate-500">
            <span class="text-2xl font-bold text-slate-900">{{ criticos }}</span> por agotarse
          </p>
          <p class="text-xs font-bold text-slate-500">
            {{ criticos ? 'Cobertura para 3 días o menos' : 'Medicación cubierta' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Pestañas Interactivas -->
    <div class="mb-5 flex items-center justify-between border-b border-slate-200">
      <div class="flex gap-6">
        <button 
          @click="pestanaActual = 'ACTIVOS'" 
          class="-mb-px flex items-center gap-2 pb-3 font-semibold transition-colors"
          :class="pestanaActual === 'ACTIVOS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'"
        >
          Activos
          <span class="rounded-full px-2 py-0.5 text-xs transition-colors" :class="pestanaActual === 'ACTIVOS' ? 'bg-blue-100' : 'bg-slate-100'">{{ activos.length }}</span>
        </button>
        <button 
          @click="pestanaActual = 'FINALIZADOS'" 
          class="-mb-px flex items-center gap-2 pb-3 font-semibold transition-colors"
          :class="pestanaActual === 'FINALIZADOS' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-400 hover:text-slate-600'"
        >
          Finalizados
          <span class="rounded-full px-2 py-0.5 text-xs transition-colors" :class="pestanaActual === 'FINALIZADOS' ? 'bg-emerald-100' : 'bg-slate-100'">{{ finalizados.length }}</span>
        </button>
      </div>
      
      <label v-if="pestanaActual === 'ACTIVOS'" class="flex items-center gap-2 pb-3 text-sm text-slate-500">
        Ordenar por
        <select v-model="orden" class="rounded-lg border border-slate-200 bg-white py-1 pl-2 pr-7 font-semibold text-slate-800 outline-none">
          <option value="urgencia">Más urgente</option>
          <option value="proxima">Próxima toma</option>
        </select>
      </label>
    </div>

    <div v-if="cargando" class="py-20 text-center"><span class="inline-block h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
    
    <div v-else-if="!filas.length" class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <p class="font-semibold text-slate-800">No tienes tratamientos en la pestaña de {{ pestanaActual.toLowerCase() }}.</p>
    </div>

    <!-- Lista Principal -->
    <ul v-else class="space-y-4">
      <li v-for="t in filas" :key="t.idTratamiento" class="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow" :class="{'opacity-70 bg-slate-50': t.estado === 'FINALIZADO'}">
        
        <div class="flex min-w-[250px] items-center gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50/50 border border-slate-100" :class="t.estado === 'ACTIVO' ? 'text-blue-600' : 'text-slate-400'">
            <Icono nombre="pastilla" class="h-6 w-6" />
          </span>
          <div class="min-w-0">
            <h2 class="truncate text-lg font-bold text-slate-900">{{ t.nombreMedicamento }}</h2>
            <p class="text-sm font-semibold text-slate-500">Vía oral</p>
          </div>
        </div>

        <div class="hidden md:block min-w-[150px]">
          <p class="text-[11px] text-slate-400 font-black uppercase tracking-widest">Dosis</p>
          <p class="font-bold text-slate-800 text-sm mt-0.5">{{ t.dosis }}</p>
          <p class="text-xs font-semibold text-slate-500 mt-0.5">Cada {{ t.frecuenciaHoras }} horas</p>
        </div>

        <!-- PRÓXIMA TOMA (INTELIGENTE Y RESTRINGIDA) -->
        <div class="hidden md:block min-w-[180px]">
          <template v-if="t.estado === 'ACTIVO'">
            <p class="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-slate-400"><Icono nombre="reloj" class="h-3.5 w-3.5" /> Próxima toma</p>
            <template v-if="t.proxima">
              <p class="text-lg font-black text-slate-800 mt-0.5">{{ hora(t.proxima) }} h</p>
              
              <!-- Botón Dinámico de Toma -->
              <button 
                @click="intentarTomarDosis(t)" 
                :class="esHoraDeTomar(t) ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'"
                class="mt-2 text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 w-32"
              >
                <Icono nombre="check" class="w-3.5 h-3.5" /> 
                {{ esHoraDeTomar(t) ? 'TOMÉ MI DOSIS' : 'AÚN NO ES HORA' }}
              </button>
            </template>
            <p v-else class="text-lg font-bold text-slate-400 mt-0.5">Tratamiento agotado</p>
          </template>
          <template v-else>
            <p class="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-emerald-500"><Icono nombre="check" class="h-3.5 w-3.5" /> Estado</p>
            <p class="text-lg font-black text-slate-500 mt-0.5">Completado</p>
          </template>
        </div>

        <div class="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto ml-auto">
          <div class="flex flex-col items-start md:items-end gap-1">
            <template v-if="t.estado === 'ACTIVO'">
              <component :is="t.alertaCritica ? 'button' : 'span'" class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider" :class="t.alertaCritica ? 'border-red-200 bg-red-50 text-red-600 hover:scale-105 transition-transform' : 'border-emerald-200 bg-emerald-50 text-emerald-600'" @click="t.alertaCritica ? emit('alerta', t) : null">
                <Icono v-if="t.alertaCritica" nombre="alerta" class="h-4 w-4" />
                <span v-else class="h-2 w-2 rounded-full bg-emerald-500" />
                {{ textoDias(t.diasRestantes) }}
              </component>
              <p class="text-xs font-bold text-slate-400">{{ t.stockActual }} unidades restantes</p>
            </template>
          </div>

          <!-- MENÚ 3 PUNTOS: Oculta 'Editar' y 'Tomar' si está Finalizado -->
          <div class="relative ml-2 shrink-0">
            <button @click.stop="menuAbierto = menuAbierto === t.idTratamiento ? null : t.idTratamiento" class="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            
            <div v-if="menuAbierto === t.idTratamiento" class="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2">
              <button v-if="t.estado === 'ACTIVO'" @click="emit('editar', t); menuAbierto = null" class="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Editar pauta</button>
              <button v-if="t.estado === 'ACTIVO'" @click="emit('finalizar', t); menuAbierto = null" class="w-full text-left px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors">Finalizar ahora</button>
              <button @click="emit('eliminar', t); menuAbierto = null" class="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
    
    <p class="mt-6 flex items-center justify-between gap-4 text-xs font-bold text-slate-400">
      <span>{{ fechaHoy }}</span>
    </p>
  </section>
</template>