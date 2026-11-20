<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/services/apiClient';
import { authStore } from '@/store/auth';
import { carritoStore } from '@/store/carrito';
import Icono from '@/components/smartcare/Icono.vue';
const emit = defineEmits(['cancelar', 'guardado']);

const router = useRouter();

// ---------- Utilidades ----------
const dos = (n) => String(n).padStart(2, '0');
const hoyLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
};
const horaLocal = () => {
  const d = new Date();
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
};

const stockRealBotiquin = ref(0);
const verificandoStock = ref(false);

const formularioVacio = () => ({
  idTratamiento: null,
  idProducto: null, // Vinculación con el E-commerce
  nombreMedicamento: '',
  dosis: '',
  unidadMedida: 'tableta',
  cantidadPorToma: 1,
  frecuenciaHoras: '',
  cantidadInicial: '',
  textoOcrCrudo: '',
  fechaInicio: hoyLocal(),
  horaPrimeraDosis: horaLocal(),
  validadoPorUsuario: false,
});

const formulario = ref(formularioVacio());
const procesandoOcr = ref(false);
const guardando = ref(false);
const errorOcr = ref('');
const errorGuardar = ref('');
// true cuando el backend rechazó el registro por stock comprometido/insuficiente
const errorEsDeStock = ref(false);

// ---------- Buscador de Catálogo ----------
const catalogoGlobal = ref([]);
const buscadorFoco = ref(false);
const textoBusqueda = ref('');

const resultadosBusqueda = computed(() => {
  if (!textoBusqueda.value) return [];
  const termino = textoBusqueda.value.toLowerCase();
  return catalogoGlobal.value
    .filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) ||
        p.codigoSKU.toLowerCase().includes(termino)
    )
    .slice(0, 4); // Mostramos max 4 sugerencias
});

// ---------- Stock del botiquín ----------
// El backend devuelve el stock LIBRE (comprado - consumido - reservado por otros tratamientos activos)
const verificarStock = async (idProducto) => {
  stockRealBotiquin.value = 0;
  if (!idProducto) return;
  verificandoStock.value = true;
  try {
    const stock = await apiClient.consultarStockBotiquin(
      authStore.usuarioActual.idUsuario,
      idProducto
    );
    stockRealBotiquin.value = Number(stock) || 0;
  } catch (error) {
    console.error('Error al consultar el botiquín:', error);
    stockRealBotiquin.value = 0;
  } finally {
    verificandoStock.value = false;
  }
};

// Consulta la base de datos sin recargar la página
const actualizarStockEnTiempoReal = () => verificarStock(formulario.value.idProducto);

const seleccionarProducto = async (prod) => {
  formulario.value.idProducto = prod.idProducto;
  formulario.value.nombreMedicamento = prod.nombre;
  textoBusqueda.value = prod.nombre;
  buscadorFoco.value = false;
  errorGuardar.value = '';
  errorEsDeStock.value = false;

  await actualizarStockEnTiempoReal();
};

// Cuando el usuario regresa a esta pestaña (por ejemplo tras pagar), se actualiza el stock
const onTabFocus = () => {
  if (document.visibilityState === 'visible') {
    actualizarStockEnTiempoReal();
  }
};

onMounted(async () => {
  try {
    catalogoGlobal.value = await apiClient.obtenerProductos();
  } catch (error) {
    console.error('Error cargando catálogo para SmartCare', error);
  }
  // Escucha cuando el usuario vuelve de la pestaña de pago
  document.addEventListener('visibilitychange', onTabFocus);
});

onUnmounted(() => {
  // Evitamos fugas de memoria al salir
  document.removeEventListener('visibilitychange', onTabFocus);
});

// Si el usuario edita el texto a mano, se rompe la vinculación
// y el nombre escrito pasa a ser el nombre del medicamento (registro manual)
const onInputBusqueda = (e) => {
  formulario.value.nombreMedicamento = e.target.value;
  if (formulario.value.idProducto) {
    formulario.value.idProducto = null;
    stockRealBotiquin.value = 0;
  }
};

// Reemplaza el setTimeout inline del template (no funciona en templates de Vue)
const cerrarBuscador = () => setTimeout(() => (buscadorFoco.value = false), 200);

// ---------- Frecuencia ----------
const opcionesFrecuencia = computed(() => {
  const base = [4, 6, 8, 12, 24];
  const actual = Number(formulario.value.frecuenciaHoras);
  if (actual > 0 && !base.includes(actual)) base.push(actual);
  return base.sort((a, b) => a - b);
});

// ---------- OCR Mejorado con Auto-vinculación ----------
const onFileChange = async (e) => {
  const archivo = e.target.files[0];
  e.target.value = '';
  if (!archivo) return;

  errorOcr.value = '';
  procesandoOcr.value = true;
  try {
    const ocr = await apiClient.procesarRecetaOcr(archivo);

    // 1. LÓGICA DE AUTO-VINCULACIÓN CON LA BASE DE DATOS
    let idEncontrado = null;
    let nombreFinal = ocr.nombreMedicamento || '';

    if (nombreFinal && catalogoGlobal.value.length > 0) {
      const termino = nombreFinal.toLowerCase();
      // Buscamos si la palabra de la IA está en el catálogo, o si el catálogo está en la palabra de la IA
      const match = catalogoGlobal.value.find(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          termino.includes(p.nombre.toLowerCase())
      );

      if (match) {
        idEncontrado = match.idProducto; // ¡Lo vinculamos automáticamente!
        nombreFinal = match.nombre; // Usamos el nombre oficial de tu BD
      }
    }

    // 2. Llenamos el formulario
    formulario.value = {
      ...formularioVacio(),
      idProducto: idEncontrado,
      nombreMedicamento: nombreFinal,
      dosis: ocr.dosis || '',
      unidadMedida: ocr.unidadMedida || 'tableta',
      cantidadPorToma: ocr.cantidadPorToma > 0 ? ocr.cantidadPorToma : 1,
      frecuenciaHoras: ocr.frecuenciaHoras > 0 ? ocr.frecuenciaHoras : '',
      cantidadInicial: ocr.cantidad > 0 ? ocr.cantidad : '',
      textoOcrCrudo: ocr.textoCrudo || '',
      validadoPorUsuario: false,
    };

    // Actualizamos el buscador visual
    textoBusqueda.value = nombreFinal;
    errorGuardar.value = '';
    errorEsDeStock.value = false;

    // Consultamos el stock del producto auto-vinculado
    await verificarStock(idEncontrado);
  } catch (error) {
    errorOcr.value =
      error.message ||
      'No pudimos leer la receta. Inténtalo de nuevo o ingresa los datos a mano.';
  } finally {
    procesandoOcr.value = false;
  }
};

// ---------- Validación y vista previa ----------
const formularioCompleto = computed(() => {
  const f = formulario.value;
  // El nombre puede venir del buscador (escrito a mano) o del formulario (OCR / catálogo)
  const nombre = (textoBusqueda.value || f.nombreMedicamento || '').trim();
  return (
    nombre &&
    String(f.dosis).trim() &&
    String(f.unidadMedida).trim() &&
    Number(f.cantidadPorToma) > 0 &&
    Number(f.frecuenciaHoras) > 0 &&
    Number(f.cantidadInicial) > 0 &&
    f.fechaInicio &&
    f.horaPrimeraDosis
  );
});

// Solo bloquea si el producto está vinculado, no hay stock libre y es un tratamiento nuevo
const requiereCompra = computed(
  () =>
    !!formulario.value.idProducto &&
    !formulario.value.idTratamiento &&
    !verificandoStock.value &&
    stockRealBotiquin.value <= 0
);

const puedeGuardar = computed(
  () =>
    formularioCompleto.value &&
    formulario.value.validadoPorUsuario &&
    !guardando.value &&
    !verificandoStock.value &&
    !requiereCompra.value
);

// (Cantidad total / (Tomas por día * Cantidad por toma))
const diasEstimados = computed(() => {
  const freq = Number(formulario.value.frecuenciaHoras);
  const cant = Number(formulario.value.cantidadInicial);
  const cantToma = Number(formulario.value.cantidadPorToma);

  if (!(freq > 0) || !(cant > 0) || !(cantToma > 0)) return null;
  const tomasPorDia = 24 / freq;
  return Math.floor(cant / (tomasPorDia * cantToma));
});

const fechaAgotamiento = computed(() => {
  if (diasEstimados.value === null || !formulario.value.fechaInicio) return null;
  const [y, m, d] = formulario.value.fechaInicio.split('-').map(Number);
  return new Date(y, m - 1, d + diasEstimados.value).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
  });
});

const primeraDosis = computed(() => {
  const { fechaInicio, horaPrimeraDosis } = formulario.value;
  if (!fechaInicio || !horaPrimeraDosis) return '';
  const [y, m, d] = fechaInicio.split('-').map(Number);
  const [h, min] = horaPrimeraDosis.split(':').map(Number);
  const fecha = new Date(y, m - 1, d, h, min);
  const hora = fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const esHoy = fechaInicio === hoyLocal();
  return esHoy
    ? `Hoy a las ${hora}`
    : `${fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })} a las ${hora}`;
});

// ---------- Compra del medicamento faltante ----------
// Matemática de inventario: lo que necesita - lo que tiene LIBRE en casa
const cantidadFaltanteComprar = computed(() => {
  const requerido = Number(formulario.value.cantidadInicial) || 0;
  const enCasa = Number(stockRealBotiquin.value) || 0;
  const faltante = requerido - enCasa;
  return faltante > 0 ? faltante : 0; // Si tiene de más, le falta 0
});

const comprarMedicamentoFaltante = async () => {
  if (!formulario.value.idProducto || cantidadFaltanteComprar.value <= 0) return;

  const productoParaComprar = catalogoGlobal.value.find(
    (p) => p.idProducto === formulario.value.idProducto
  );
  if (!productoParaComprar) return;

  const stockTienda = productoParaComprar.stockActual ?? productoParaComprar.stock ?? 0;
  const cantidadAComprar = cantidadFaltanteComprar.value;

  const itemEnCarrito = carritoStore.items.find(
    (i) => i.producto && i.producto.idProducto === productoParaComprar.idProducto
  );
  const yaEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

  if (yaEnCarrito + cantidadAComprar > stockTienda) {
    alert(
      `Stock insuficiente en la botica. Necesitas ${cantidadAComprar}, pero solo nos quedan ${stockTienda} unidades disponibles.`
    );
    return; // Evita el mensaje de éxito falso.
  }

  try {
    await carritoStore.agregarBD(
      authStore.usuarioActual.idUsuario,
      productoParaComprar,
      cantidadAComprar
    );

    // Abrimos el carrito en OTRA PESTAÑA.
    // Esta pestaña queda esperando; al volver, onTabFocus actualiza el stock.
    window.open('/carrito', '_blank');
  } catch (error) {
    alert('Ocurrió un error al agregar el medicamento al carrito.');
  }
};

// ---------- Guardar ----------
const guardarTratamiento = async () => {
  if (!puedeGuardar.value) return;
  guardando.value = true;
  errorGuardar.value = ''; // Limpiamos errores previos
  errorEsDeStock.value = false;

  try {
    const ahora = new Date();
    const horaExacta = String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');

    if (!formulario.value.idProducto) {
      formulario.value.nombreMedicamento = textoBusqueda.value;
    }

    const payload = {
      ...formulario.value,
      idUsuario: authStore.usuarioActual.idUsuario,
      fechaInicio: ahora.toISOString().split('T')[0],
      horaPrimeraDosis: horaExacta,
    };

    // ELIMINAMOS EL NULL PARA QUE SPRING BOOT NO DE ERROR DE PARSEO
    if (!payload.idTratamiento) {
      delete payload.idTratamiento;
    }

    if (formulario.value.idTratamiento) {
      await apiClient.actualizarTratamiento(formulario.value.idTratamiento, payload, authStore.usuarioActual.idUsuario);
    } else {
      await apiClient.registrarTratamiento(payload);
    }

    formulario.value = formularioVacio();
    textoBusqueda.value = '';
    stockRealBotiquin.value = 0;
    emit('guardado'); // Le avisa a la vista principal que terminó con éxito
  } catch (error) {
    // El backend responde 400 con { "error": "..." } y apiClient lo expone en error.message
    const mensaje = error?.message || 'No pudimos guardar el tratamiento. Inténtalo de nuevo.';
    const mensajeMayus = mensaje.toUpperCase();

    // El backend rechazó la operación por inventario (comprometido o insuficiente)
    const esErrorDeStock =
      mensajeMayus.includes('STOCK COMPROMETIDO') ||
      mensajeMayus.includes('STOCK INSUFICIENTE');

    errorGuardar.value = mensaje; // Queda visible en el formulario si el usuario cancela
    errorEsDeStock.value = esErrorDeStock;

    if (esErrorDeStock) {
      // Refrescamos el stock libre real para que el panel de la derecha quede al día
      await actualizarStockEnTiempoReal();

      const irAComprar = confirm(
        mensaje + '\n\n¿Deseas ir al catálogo de Botica Estrella ahora mismo para adquirir este medicamento?'
      );

      if (irAComprar) {
        router.push('/productos'); // Redirección automática
      }
    }
  } finally {
    guardando.value = false;
  }
};

// Exponemos este método para que el padre (SmartCareView) pueda inyectarle datos de edición
const cargarDatosEdicion = (tratamiento) => {
  formulario.value = {
    idTratamiento: tratamiento.idTratamiento,
    idProducto: tratamiento.idProducto,
    nombreMedicamento: tratamiento.nombreMedicamento,
    dosis: tratamiento.dosis,
    unidadMedida: tratamiento.unidadMedida,
    cantidadPorToma: tratamiento.cantidadPorToma,
    frecuenciaHoras: tratamiento.frecuenciaHoras,
    cantidadInicial: tratamiento.cantidadInicial,
    textoOcrCrudo: tratamiento.textoOcrCrudo || '',
    fechaInicio: tratamiento.fechaInicio,
    horaPrimeraDosis: tratamiento.horaPrimeraDosis,
    validadoPorUsuario: true,
  };
  textoBusqueda.value = tratamiento.nombreMedicamento;
};

defineExpose({
  cargarDatosEdicion,
});

const campo =
  'block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30';
</script>

<template>
  <section class="pb-16">
    <button
      type="button"
      class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
      @click="emit('cancelar')"
    >
      <Icono nombre="flechaIzq" class="h-4 w-4" />
      De vuelta a mis tratamientos
    </button>

    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Registrar un nuevo tratamiento</h1>
    <p class="mb-8 mt-1 text-slate-500">
      Sube la foto de tu receta para autocompletar los datos, o escríbelos tú mismo.
    </p>

    <!-- Lectura de receta con IA -->
    <div class="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="flex items-start gap-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <Icono nombre="chispa" class="h-5 w-5" />
          </span>
          <div>
            <h2 class="font-semibold text-slate-900">Autocompleta con una foto de tu receta</h2>
            <p v-if="!procesandoOcr" class="mt-0.5 max-w-md text-sm text-slate-600">
              La IA lee la receta y llena el formulario. Tú revisas todo antes de guardar.
            </p>
            <p v-else class="mt-0.5 max-w-md text-sm text-slate-600 font-bold text-blue-700 animate-pulse" role="status">
              Leyendo receta médica. Por favor espera...
            </p>
          </div>
        </div>

        <label
          class="relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600"
          :class="{ 'pointer-events-none opacity-70': procesandoOcr }"
        >
          <input type="file" accept="image/*" class="sr-only" :disabled="procesandoOcr" @change="onFileChange" />
          <span v-if="procesandoOcr" class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <Icono v-else nombre="camara" class="h-5 w-5" />
          {{ procesandoOcr ? 'Procesando IA...' : 'Subir foto de receta' }}
        </label>
      </div>
      <p v-if="errorOcr" role="alert" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-bold">
        {{ errorOcr }}
      </p>
    </div>

    <div class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <!-- Formulario -->
      <div class="overflow-visible rounded-2xl border border-slate-200 bg-white xl:col-span-8 shadow-sm">

        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-5 md:px-8 bg-slate-50/50">
          <h2 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icono nombre="pastilla" class="h-5 w-5 text-blue-600" />
            Detalles del tratamiento
          </h2>
          <span class="text-xs text-slate-400 font-medium">Todos los campos son obligatorios.</span>
        </div>

        <div class="space-y-6 px-6 py-6 md:px-8">

          <!-- BUSCADOR INTELIGENTE (Vincula con E-commerce) -->
          <div class="relative">
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Nombre del medicamento (Buscar en catálogo)
            </label>
            <input
              v-model="textoBusqueda"
              @focus="buscadorFoco = true"
              @blur="cerrarBuscador"
              @input="onInputBusqueda"
              type="text"
              :class="campo"
              placeholder="Ej: Paracetamol, Losartán..."
            />

            <div v-if="buscadorFoco && resultadosBusqueda.length > 0" class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              <div
                v-for="prod in resultadosBusqueda"
                :key="prod.idProducto"
                @mousedown="seleccionarProducto(prod)"
                class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between transition-colors"
              >
                <div>
                  <p class="text-sm font-bold text-slate-800">{{ prod.nombre }}</p>
                  <p class="text-xs text-slate-400 font-mono">SKU: {{ prod.codigoSKU }}</p>
                </div>
                <span class="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Vincular</span>
              </div>
            </div>

            <p v-if="formulario.idProducto" class="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Icono nombre="check" class="w-3 h-3" /> Medicamento vinculado al catálogo (SKU oficial)
            </p>
            <p v-else class="mt-2 text-xs text-slate-400">
              Si la botica no lo vende, puedes dejar el nombre escrito manualmente.
            </p>

            <p v-if="verificandoStock" class="mt-2 text-xs text-slate-400 animate-pulse">
              Consultando tu botiquín...
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Dosis (Concentración)</label>
              <input v-model="formulario.dosis" type="text" :class="campo" placeholder="Ej: 500 mg" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Unidad de medida</label>
              <select v-model="formulario.unidadMedida" :class="campo">
                <option value="tableta">Tabletas / Pastillas</option>
                <option value="cápsula">Cápsulas</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="cucharada">Cucharadas</option>
                <option value="unidad">Unidades genéricas</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Cant. por toma</label>
              <input v-model.number="formulario.cantidadPorToma" type="number" min="1" :class="campo" placeholder="Ej: 1" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Frecuencia</label>
              <select v-model.number="formulario.frecuenciaHoras" :class="campo">
                <option value="" disabled>Elige una</option>
                <option v-for="h in opcionesFrecuencia" :key="h" :value="h">Cada {{ h }} horas</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Cant. Total a Comprar</label>
              <input v-model.number="formulario.cantidadInicial" type="number" min="1" :class="campo" placeholder="Ej: 30" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-slate-100 pt-6">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Fecha de inicio</label>
              <input v-model="formulario.fechaInicio" type="date" :class="campo" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hora primera dosis</label>
              <input v-model="formulario.horaPrimeraDosis" type="time" :class="campo" />
            </div>
          </div>

          <details v-if="formulario.textoOcrCrudo" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <summary class="cursor-pointer text-sm font-semibold text-slate-700">Ver el texto crudo detectado por la IA</summary>
            <pre class="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-slate-600 font-mono">{{ formulario.textoOcrCrudo }}</pre>
          </details>

          <!-- Confirmación HITL -->
          <label v-if="textoBusqueda" class="flex cursor-pointer items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4 transition-colors hover:bg-blue-50">
            <input v-model="formulario.validadoPorUsuario" type="checkbox" class="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
            <span class="text-sm font-bold text-slate-700">
              Confirmo que revisé estos datos y coinciden exactamente con mi receta física.
            </span>
          </label>

          <!-- ALERTA DE ERROR RECHAZADO POR EL BACKEND (stock comprometido/insuficiente u otros) -->
          <div
            v-if="errorGuardar"
            role="alert"
            class="rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-red-700 shadow-sm"
          >
            <div class="flex items-start gap-3">
              <Icono nombre="alerta" class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div class="min-w-0">
                <p class="text-sm font-bold">{{ errorGuardar }}</p>
                <button
                  v-if="errorEsDeStock"
                  type="button"
                  class="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 active:scale-95"
                  @click="router.push('/productos')"
                >
                  <Icono nombre="bolsa" class="h-4 w-4" />
                  Ir al catálogo a comprar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:px-8">
          <p class="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Icono nombre="candado" class="h-4 w-4" />
            Tu información de salud es privada y encriptada.
          </p>
          <div class="flex w-full gap-3 md:w-auto">
            <button type="button" class="flex-1 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 md:flex-none" @click="emit('cancelar')">
              Cancelar
            </button>
            <button type="button" class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:flex-none" :disabled="!puedeGuardar" @click="guardarTratamiento">
              <span v-if="guardando" class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <Icono v-else nombre="check" class="h-5 w-5" />
              Guardar Tratamiento
            </button>
          </div>
        </div>
      </div>

      <!-- Vista previa (Sidebar Derecha) -->
      <aside class="xl:col-span-4">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm sticky top-6">
          <h2 class="mb-6 font-black text-slate-900 text-lg">Vista previa del tratamiento</h2>

          <div class="mb-6 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 border border-blue-200">
              <Icono nombre="pastilla" class="h-6 w-6" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-lg font-black text-slate-900">
                {{ textoBusqueda || 'Nombre del Fármaco' }}
              </p>
              <p class="text-sm font-medium text-slate-500 capitalize">Vía oral - {{ formulario.dosis || 'Dosis' }}</p>
            </div>
          </div>

          <dl class="mb-6 space-y-4 border-y border-slate-100 py-6 text-sm">
            <div class="flex justify-between gap-4 items-center">
              <dt class="text-slate-500 font-medium">Consumo</dt>
              <dd class="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                {{ formulario.cantidadPorToma }} {{ formulario.unidadMedida }}(s)
              </dd>
            </div>
            <div class="flex justify-between gap-4 items-center">
              <dt class="text-slate-500 font-medium">Frecuencia</dt>
              <dd class="font-bold text-slate-800">
                {{ formulario.frecuenciaHoras ? `Cada ${formulario.frecuenciaHoras} horas` : '-' }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 items-center">
              <dt class="text-slate-500 font-medium">Total a comprar</dt>
              <dd class="font-bold text-slate-800">
                {{ formulario.cantidadInicial ? `${formulario.cantidadInicial} unds` : '-' }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 items-center">
              <dt class="text-slate-500 font-medium">Te alcanza para</dt>
              <dd class="font-bold text-slate-800">
                {{ diasEstimados !== null ? `${diasEstimados} días exactos` : '-' }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 items-center">
              <dt class="text-slate-500 font-medium">Se agota el</dt>
              <dd class="font-bold text-medical-blue">{{ fechaAgotamiento || '-' }}</dd>
            </div>
          </dl>

          <!-- MÓDULO DE VENTA CRUZADA (E-COMMERCE) -->
          <div v-if="formulario.idProducto" class="mb-6 p-4 rounded-2xl border" :class="stockRealBotiquin > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'">
            <template v-if="verificandoStock">
              <span class="animate-pulse text-slate-500 font-bold text-sm">Verificando tu botiquín virtual...</span>
            </template>

            <template v-else-if="stockRealBotiquin > 0">
              <p class="text-emerald-700 font-bold text-sm mb-1 flex items-center gap-1">
                <Icono nombre="check" class="w-4 h-4" /> ¡Tienes stock disponible!
              </p>
              <p class="text-xs text-emerald-600">Tienes {{ stockRealBotiquin }} unidades libres en tu botiquín.</p>
            </template>

            <template v-else>
              <p class="text-red-700 font-black text-sm mb-2 flex items-center gap-1">
                <Icono nombre="alerta" class="w-4 h-4" /> No tienes stock libre de este medicamento
              </p>
              <p class="text-xs text-red-600 mb-3">Tus unidades en casa ya están reservadas para otro tratamiento activo, o aún no las has comprado. Cómpralo ahora para poder iniciar este tratamiento.</p>
              <button
                type="button"
                @click="comprarMedicamentoFaltante"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-sm transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Icono nombre="bolsa" class="w-4 h-4" /> Agregar {{ cantidadFaltanteComprar || 'X' }} al Carrito
              </button>
            </template>
          </div>

          <div class="flex gap-4 rounded-2xl bg-blue-50 p-5 text-blue-900 border border-blue-100">
            <Icono nombre="reloj" class="h-6 w-6 shrink-0 text-blue-600" />
            <div>
              <p class="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Primera toma</p>
              <p class="font-bold text-sm">{{ primeraDosis || 'Elige fecha y hora' }}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>