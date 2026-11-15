<script setup>
import { ref, computed } from 'vue';
import Icono from '@/components/smartcare/Icono.vue';

const props = defineProps({
  historial: { type: Array, default: () => [] },
  cargando: { type: Boolean, default: false },
});
// Agrega 'editar' y 'eliminar' a los emits
const emit = defineEmits(['nuevo', 'alerta', 'editar', 'eliminar','tomar-dosis']); 
const orden = ref('urgencia'); 
const menuAbierto = ref(null); // NUEVO: Controla el menú de 3 puntos

// ---------- Utilidades de fecha (todo en hora local) ----------
const aFecha = (valor) => {
  const [y, m, d] = String(valor).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Próxima toma a partir de fechaInicio + horaPrimeraDosis + frecuencia.
// Si el backend no envía esos campos, devuelve null y se muestra un guion.
const calcularProxima = (t) => {
  const freq = Number(t.frecuenciaHoras);
  if (!freq || !t.fechaInicio || !t.horaPrimeraDosis) return null;

  const [h, min] = String(t.horaPrimeraDosis).split(':').map(Number);
  const base = aFecha(t.fechaInicio);
  if ([h, min, base.getTime()].some(Number.isNaN)) return null;
  base.setHours(h, min, 0, 0);

  const paso = freq * 3600000;
  let proxima = base.getTime();
  const ahora = Date.now();
  if (ahora > proxima) proxima += Math.ceil((ahora - proxima) / paso) * paso;

  if (t.fechaAgotamiento) {
    const fin = aFecha(t.fechaAgotamiento);
    fin.setHours(23, 59, 59, 999);
    if (proxima > fin.getTime()) return null;
  }
  return new Date(proxima);
};

const hora = (f) =>
  f.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

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

// ---------- Datos derivados ----------
const filas = computed(() => {
  const lista = props.historial.map((t) => ({ ...t, proxima: calcularProxima(t) }));
  if (orden.value === 'proxima') {
    return lista.sort(
      (a, b) =>
        (a.proxima?.getTime() ?? Infinity) - (b.proxima?.getTime() ?? Infinity)
    );
  }
  return lista.sort((a, b) => a.diasRestantes - b.diasRestantes);
});

const kpiProxima = computed(() => {
  const conHora = filas.value.filter((t) => t.proxima);
  if (!conHora.length) return null;
  const t = conHora.reduce((a, b) => (a.proxima <= b.proxima ? a : b));
  return {
    hora: hora(t.proxima),
    detalle: `${etiquetaDia(t.proxima)}, ${t.nombreMedicamento}`,
  };
});

const criticos = computed(() => props.historial.filter((t) => t.alertaCritica).length);

const fechaHoy = computed(() => {
  const txt = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
});
</script>

<template>
  <section>
    <!-- Encabezado -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Tratamientos activos</h1>
        <p class="mt-1 text-slate-500">
          Tu medicación, organizada. Consulta tus próximas tomas y lo que te queda.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        @click="emit('nuevo')"
      >
        <Icono nombre="mas" class="h-5 w-5" />
        Nuevo tratamiento
      </button>
    </div>

    <!-- Resumen -->
    <div class="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icono nombre="pastilla" class="h-5 w-5" />
        </span>
        <div>
          <p class="text-slate-500">
            <span class="text-2xl font-bold text-slate-900">{{ historial.length }}</span>
            {{ historial.length === 1 ? 'tratamiento activo' : 'tratamientos activos' }}
          </p>
          <p class="text-xs text-slate-400">Todos tus medicamentos en un solo lugar</p>
        </div>
      </div>
      <div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icono nombre="reloj" class="h-5 w-5" />
        </span>
        <div v-if="kpiProxima">
          <p class="text-slate-500">
            <span class="text-2xl font-bold text-slate-900">{{ kpiProxima.hora }}</span>
            próxima toma
          </p>
          <p class="text-xs text-slate-400">{{ kpiProxima.detalle }}</p>
        </div>
        <div v-else>
          <p class="font-semibold text-slate-900">Sin tomas pendientes</p>
          <p class="text-xs text-slate-400">Registra un tratamiento para verlas aquí</p>
        </div>
      </div>
      <div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-xl"
          :class="criticos ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'"
        >
          <Icono :nombre="criticos ? 'alerta' : 'check'" class="h-5 w-5" />
        </span>
        <div>
          <p class="text-slate-500">
            <span class="text-2xl font-bold text-slate-900">{{ criticos }}</span>
            con stock crítico
          </p>
          <p class="text-xs text-slate-400">
            {{ criticos ? 'Quedan 3 días o menos' : 'Tienes stock suficiente en todos' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Pestañas y orden -->
    <div class="mb-5 flex items-center justify-between border-b border-slate-200">
      <div class="flex gap-6">
        <span class="-mb-px flex items-center gap-2 border-b-2 border-blue-600 pb-3 font-semibold text-blue-600">
          Activos
          <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs">{{ historial.length }}</span>
        </span>
        <span class="pb-3 text-slate-400" title="Próximamente">Finalizados</span>
      </div>
      <label class="flex items-center gap-2 pb-3 text-sm text-slate-500">
        Ordenar por
        <select
          v-model="orden"
          class="rounded-lg border border-slate-200 bg-white py-1 pl-2 pr-7 font-semibold text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <option value="urgencia">Más urgente</option>
          <option value="proxima">Próxima toma</option>
        </select>
      </label>
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="py-20 text-center" role="status" aria-label="Cargando tratamientos">
      <span class="inline-block h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>

    <!-- Vacío -->
    <div
      v-else-if="!historial.length"
      class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
    >
      <span class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icono nombre="pastilla" class="h-6 w-6" />
      </span>
      <p class="font-semibold text-slate-800">Aún no tienes tratamientos activos</p>
      <p class="mx-auto mt-1 max-w-sm text-sm text-slate-500">
        Sube una foto de tu receta o ingresa los datos a mano, y te avisamos antes de que se acabe.
      </p>
      <button
        type="button"
        class="mt-5 font-semibold text-blue-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        @click="emit('nuevo')"
      >
        Registrar mi primer tratamiento
      </button>
    </div>

    <!-- Lista Corregida -->
    <ul v-else class="space-y-4">
      <li
        v-for="t in filas"
        :key="t.idTratamiento"
        class="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        
        <!-- Bloque 1: Medicamento -->
        <div class="flex min-w-[250px] items-center gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50/50 border border-slate-100 text-blue-500">
            <Icono nombre="pastilla" class="h-6 w-6" />
          </span>
          <div class="min-w-0">
            <h2 class="truncate text-lg font-bold text-slate-900">{{ t.nombreMedicamento }}</h2>
            <p class="text-sm text-slate-500">Vía oral</p>
          </div>
        </div>

        <!-- Bloque 2: Dosis -->
        <div class="hidden md:block min-w-[150px]">
          <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Dosis</p>
          <p class="font-bold text-slate-800 text-sm mt-0.5">{{ t.dosis }}</p>
          <p class="text-xs text-slate-500 mt-0.5">Cada {{ t.frecuenciaHoras }} horas</p>
        </div>

        <!-- Bloque 3: Próxima Toma (Modificado) -->
        <div class="hidden md:block min-w-[180px]">
          <p class="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Icono nombre="reloj" class="h-3.5 w-3.5" />
            Próxima toma
          </p>
          <template v-if="t.proxima">
            <p class="text-lg font-bold text-slate-800 mt-0.5">{{ hora(t.proxima) }} h</p>
            
            <!-- NUEVO BOTÓN PARA REGISTRAR TOMA -->
            <button 
              @click="emit('tomar-dosis', t)" 
              class="mt-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors active:scale-95 flex items-center gap-1"
            >
              <Icono nombre="check" class="w-3 h-3" /> Tomé mi dosis
            </button>
            
          </template>
          <p v-else class="text-lg font-bold text-slate-400 mt-0.5">Sin horario</p>
        </div>

        <!-- Bloque 4: Alertas y Opciones (Menú a la derecha) -->
        <div class="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto ml-auto">
          
          <div class="flex flex-col items-start md:items-end gap-1">
            <component
              :is="t.alertaCritica ? 'button' : 'span'"
              :type="t.alertaCritica ? 'button' : undefined"
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider"
              :class="t.alertaCritica ? 'border-red-200 bg-red-50 text-red-600 hover:scale-105 transition-transform' : 'border-emerald-200 bg-emerald-50 text-emerald-600'"
              @click="t.alertaCritica ? emit('alerta', t) : null"
            >
              <Icono v-if="t.alertaCritica" nombre="alerta" class="h-4 w-4" />
              <span v-else class="h-2 w-2 rounded-full bg-emerald-500" />
              {{ textoDias(t.diasRestantes) }}
            </component>
            <p class="text-xs font-medium text-slate-400">{{ t.stockActual }} unidades disponibles</p>
          </div>

          <!-- MENÚ DE 3 PUNTOS (Correctamente alineado a la derecha) -->
          <div class="relative ml-2 shrink-0">
            <button @click.stop="menuAbierto = menuAbierto === t.idTratamiento ? null : t.idTratamiento" class="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>

            <!-- Menú Desplegable -->
            <div v-if="menuAbierto === t.idTratamiento" class="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2">
              <button @click="emit('editar', t); menuAbierto = null" class="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Editar</button>
              <button @click="emit('eliminar', t); menuAbierto = null" class="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">Eliminar</button>
            </div>
          </div>
          
        </div>
      </li>
    </ul>

    <p class="mt-6 flex items-center justify-between gap-4 text-xs text-slate-400">
      <span>{{ fechaHoy }}</span>
      <span class="flex items-center gap-1.5">
        <Icono nombre="info" class="h-3.5 w-3.5" />
        Sigue siempre la dosis y el horario de tu receta.
      </span>
    </p>
  </section>
</template>