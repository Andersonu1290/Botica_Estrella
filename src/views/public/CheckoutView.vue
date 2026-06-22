<template>
  <div class="max-w-300 mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-black text-slate-800 mb-8">Finalizar Pedido</h1>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-8 space-y-6">
        
        <div class="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-slate-200">
          <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs shadow-md">1</span>
            Datos de Contacto
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Nombre</label>
              <input v-model="form.nombre" type="text" placeholder="Ej. Juan" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Apellido</label>
              <input v-model="form.apellido" type="text" placeholder="Ej. Pérez" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">DNI / RUC</label>
              <input v-model="form.docCliente" type="text" placeholder="Ej. 70123456" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Teléfono Móvil</label>
              <input v-model="form.telefono" type="tel" placeholder="Ej. 987654321" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Correo Electrónico</label>
              <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-slate-200">
          <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs shadow-md">2</span>
            Dirección de Envío
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2">
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Dirección (Calle/Av.)</label>
              <input v-model="form.direccion" type="text" placeholder="Ej. Av. Los Pinos" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Número</label>
              <input v-model="form.numeroCalle" type="text" placeholder="Ej. 123" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Dpto / Piso (Opcional)</label>
              <input v-model="form.apartamento" type="text" placeholder="Ej. Dpto 301" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Departamento / Región</label>
              <input v-model="form.departamento" type="text" placeholder="Ej. Lima" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-400 uppercase mb-2">Ciudad / Distrito</label>
              <input v-model="form.ciudad" type="text" placeholder="Ej. Miraflores" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-slate-200">
          <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs shadow-md">3</span>
            Opciones de Envío
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button @click="form.tipoEnvio = 'NORMAL'" :class="form.tipoEnvio === 'NORMAL' ? 'border-medical-blue bg-blue-50 ring-2 ring-medical-blue/20' : 'border-slate-200'" class="p-4 border-2 rounded-2xl text-left transition-all">
              <span class="block font-black text-slate-800">Normal</span>
              <span class="text-xs text-slate-500 block mb-2">Hasta 5 días hábiles</span>
              <span class="text-sm font-bold text-medical-blue">S/. 10.00</span>
            </button>
            <button @click="form.tipoEnvio = 'EXPRESS'" :class="form.tipoEnvio === 'EXPRESS' ? 'border-medical-blue bg-blue-50 ring-2 ring-medical-blue/20' : 'border-slate-200'" class="p-4 border-2 rounded-2xl text-left transition-all">
              <span class="block font-black text-slate-800">Express</span>
              <span class="text-xs text-slate-500 block mb-2">Hasta 48 horas</span>
              <span class="text-sm font-bold text-medical-blue">S/. 15.00</span>
            </button>
            <button @click="form.tipoEnvio = 'SAME_DAY'" :class="form.tipoEnvio === 'SAME_DAY' ? 'border-medical-blue bg-blue-50 ring-2 ring-medical-blue/20' : 'border-slate-200'" class="p-4 border-2 rounded-2xl text-left transition-all">
              <span class="block font-black text-slate-800">Mismo Día</span>
              <span class="text-xs text-slate-500 block mb-2">Llega hoy mismo</span>
              <span class="text-sm font-bold text-medical-blue">S/. 25.00</span>
            </button>
          </div>
        </div>

        <div class="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-slate-200">
          <h2 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs shadow-md">4</span>
            Pago y Comprobante
          </h2>
          
          <div class="mb-6">
            <label class="block text-xs font-black text-slate-400 uppercase mb-3">Comprobante de Pago</label>
            <div class="flex gap-4">
              <button @click="form.tipoComprobante = 'BOLETA'" :class="form.tipoComprobante === 'BOLETA' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-6 py-3 rounded-xl font-bold transition-colors">Boleta</button>
              <button @click="form.tipoComprobante = 'FACTURA'" :class="form.tipoComprobante === 'FACTURA' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-6 py-3 rounded-xl font-bold transition-colors">Factura</button>
            </div>
          </div>

          <label class="block text-xs font-black text-slate-400 uppercase mb-3">Método de Pago</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button v-for="metodo in metodosPago" :key="metodo.id" @click="form.metodoPago = metodo.id" :class="form.metodoPago === metodo.id ? 'border-medical-blue bg-blue-50 ring-2 ring-medical-blue/20' : 'border-slate-200'" class="p-4 border-2 rounded-2xl text-center transition-all hover:border-medical-blue">
              <span class="block text-sm font-black text-slate-800">{{ metodo.nombre }}</span>
            </button>
          </div>

          <div v-if="form.metodoPago.includes('TARJETA')" class="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 class="text-sm font-black text-slate-700 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              Datos de la Tarjeta
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <input v-model="form.tarjeta.titular" type="text" placeholder="Nombre en la tarjeta" class="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 outline-none focus:border-medical-blue" />
              </div>
              <div class="md:col-span-2">
                <input v-model="form.tarjeta.numero" type="text" maxlength="19" placeholder="0000 0000 0000 0000" class="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 outline-none focus:border-medical-blue font-mono" />
              </div>
              <div>
                <input v-model="form.tarjeta.vencimiento" type="text" placeholder="MM/YY" maxlength="5" class="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 outline-none focus:border-medical-blue text-center" />
              </div>
              <div>
                <input v-model="form.tarjeta.cvv" type="password" placeholder="CVV" maxlength="4" class="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 outline-none focus:border-medical-blue text-center" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="lg:col-span-4">
          <div class="bg-slate-900 rounded-4xl p-6 md:p-8 text-white sticky top-28 shadow-xl">
          <h2 class="text-xl font-black mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-medical-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            Resumen del Pedido
          </h2>
          
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-slate-400 font-medium">
              <span>Subtotal Productos</span>
              <span class="text-white">S/. {{ format(carritoStore.subtotalPrecio / 1.18) }}</span>
            </div>
            <div class="flex justify-between text-slate-400 font-medium">
              <span>IGV (18%)</span>
              <span class="text-white">S/. {{ format(carritoStore.subtotalPrecio - (carritoStore.subtotalPrecio / 1.18)) }}</span>
            </div>
            <div class="flex justify-between text-slate-400 font-medium">
              <span>Costo de Envío</span>
              <span class="text-medical-accent font-bold">S/. {{ format(costoEnvioCalculado) }}</span>
            </div>
          </div>
          
          <div class="flex justify-between items-end pt-6 border-t border-slate-700 mb-8">
            <span class="text-lg text-slate-300">Total a Pagar</span>
            <span class="text-3xl font-black text-white">S/. {{ format(totalFinal) }}</span>
          </div>
          
          <button @click="procesarPago" :disabled="procesando" class="w-full bg-medical-accent hover:bg-green-500 py-4 rounded-xl font-black text-lg transition-all active:scale-95 shadow-lg shadow-medical-accent/20 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2">
            <span v-if="procesando" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ procesando ? 'Procesando...' : 'Confirmar y Pagar' }}
          </button>
          
          <p class="text-xs text-slate-500 mt-6 text-center">
            Tus datos personales y de pago están protegidos por encriptación de extremo a extremo.
          </p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { carritoStore } from '@/store/carrito';
import { authStore } from '@/store/auth';
import { apiClient } from '@/services/apiClient';

const router = useRouter();
const procesando = ref(false);

const form = reactive({
  nombre: '',
  apellido: '',
  docCliente: '',
  email: '',
  telefono: '',
  direccion: '',
  numeroCalle: '',
  apartamento: '',
  ciudad: '',
  departamento: '',
  tipoEnvio: 'NORMAL', 
  tipoComprobante: 'BOLETA',
  metodoPago: 'TARJETA_CREDITO',
  tarjeta: {
    titular: '',
    numero: '',
    vencimiento: '',
    cvv: ''
  }
});

const metodosPago = [
  { id: 'TARJETA_CREDITO', nombre: 'T. Crédito' },
  { id: 'TARJETA_DEBITO', nombre: 'T. Débito' },
  { id: 'YAPE', nombre: 'Yape / Plin' },
  { id: 'TRANSFERENCIA', nombre: 'Transferencia' }
];

const format = (n) => Number(n).toFixed(2);

const costoEnvioCalculado = computed(() => {
  if (form.tipoEnvio === 'NORMAL') return 10.00;
  if (form.tipoEnvio === 'EXPRESS') return 15.00;
  if (form.tipoEnvio === 'SAME_DAY') return 25.00;
  return 0;
});

const totalFinal = computed(() => {
  return carritoStore.subtotalPrecio + costoEnvioCalculado.value;
});

const procesarPago = async () => {
  if (!form.nombre || !form.apellido || !form.docCliente || !form.direccion || !form.ciudad) {
    alert("Por favor completa todos tus datos personales y de envío antes de continuar.");
    return;
  }

  const usuarioGuardado = authStore.usuarioActual;

  if (!usuarioGuardado || !usuarioGuardado.idUsuario) {
    alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
    router.push('/login?redirect=/checkout');
    return;
  }

  procesando.value = true;

  try {
    // 1️⃣ Mapeamos los items del carrito para que coincida con ItemCarritoDTO de Java
    const itemsCarrito = carritoStore.items.map(item => {
      return {
        idProducto: item.producto.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
      };
    });

    // 2️⃣ Extraemos los últimos 4 dígitos y marca de la tarjeta de forma segura
    let ultimos4 = null;
    let marcaTarjeta = null;
    if (form.metodoPago.includes('TARJETA') && form.tarjeta.numero) {
      const numLimpio = form.tarjeta.numero.replace(/\s+/g, '');
      ultimos4 = numLimpio.slice(-4);
      marcaTarjeta = form.tarjeta.numero.startsWith('4') ? 'VISA' : 'MASTERCARD';
    }

    // 3️⃣ CONSTRUIMOS EL PAYLOAD MAESTRO (Coincide exacto con PedidoClienteRequestDTO)
    const payloadMaestro = {
      idUsuario: usuarioGuardado.idUsuario,
      dniCliente: form.docCliente,
      nombreCliente: form.nombre,
      apellidoCliente: form.apellido,
      emailCliente: form.email,
      telefonoCliente: form.telefono,
      
      direccionEnvio: form.direccion,
      numeroCalle: form.numeroCalle,
      apartamento: form.apartamento,
      ciudad: form.ciudad,
      departamento: form.departamento,
      codigoPostal: "LIMA-01", 
      
      tipoEnvio: form.tipoEnvio,
      costoEnvio: costoEnvioCalculado.value,
      
      tipoPago: form.metodoPago,
      tipoTarjeta: marcaTarjeta,
      ultimos4Digitos: ultimos4,
      bancoTarjeta: form.metodoPago.includes('TARJETA') ? "Web E-commerce" : null,
      nombreTitular: form.tarjeta.titular,
      
      items: itemsCarrito, // En vez de detalles, el DTO de Java pide "items"
      
      observaciones: `Comprobante solicitado: ${form.tipoComprobante}`
    };

    // 4️⃣ UNA SOLA LLAMADA A LA API USANDO LA NUEVA RUTA /api/v1/pedidos
    const respuestaBackend = await apiClient.crearPedido(payloadMaestro);

    // 5️⃣ Vaciamos el carrito tras confirmación exitosa
    await carritoStore.vaciarBD(usuarioGuardado.idUsuario);

    // 6️⃣ Redirigimos pasando el ticket real (nroPedido) devuelto por Java
    const ticketFinal = respuestaBackend.pedido.nroPedido; // El JSON de Java manda { success: true, pedido: { nroPedido: ... } }
    
    router.push({ 
      path: '/confirmacion', 
      query: { ticket: ticketFinal } 
    });

  } catch (err) {
    console.error(err);
    if (String(err.message || '').toLowerCase().includes('sesión')) {
      authStore.cerrarSesion();
      router.push('/login?redirect=/checkout');
      return;
    }
    alert("Error procesando pedido: " + (err.message || "Intenta de nuevo"));
  } finally {
    procesando.value = false;
  }
};
</script>