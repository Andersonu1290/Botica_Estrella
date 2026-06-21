<template>
  <div>
    <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <h2 class="text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Auditoría e Historial de Ventas
                </h2>
            </div>
            <a href="/admin/venta" class="btn-tech">Volver al Punto de Venta</a>
        </div>

        <div style="display: flex; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
            <button @click="tabActual = 'WEB'" class="btn-tech" :style="tabActual === 'WEB' ? 'background: var(--brand-blue); color: #fff;' : 'background: transparent; opacity: 0.6;'">
                📦 Pedidos Web (E-commerce)
            </button>
            <button @click="tabActual = 'POS'" class="btn-tech" :style="tabActual === 'POS' ? 'background: var(--brand-blue); color: #fff;' : 'background: transparent; opacity: 0.6;'">
                🏪 Ventas Físicas (Local)
            </button>
        </div>

        <!-- ========================================== -->
        <!-- TAB 1: PEDIDOS WEB                         -->
        <!-- ========================================== -->
        <div v-if="tabActual === 'WEB'">
            <div class="table-panel">
                <table class="tech-table">
                    <thead>
                        <tr>
                            <th>FECHA / HORA</th>
                            <th>N° COMPROBANTE</th>
                            <th>DATOS DEL CLIENTE</th>
                            <th>PRODUCTOS (WEB)</th>
                            <th>TOTAL</th>
                            <th class="text-center">ESTADO</th>
                            <th class="text-center">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="pedidosWeb.length === 0">
                            <td colspan="7" class="text-center p-30 text-muted">
                                Cargando pedidos web...
                            </td>
                        </tr>
                        <tr v-for="pedido in pedidosWeb" :key="pedido.idVentaCliente">
                            <td>
                                <span style="font-weight: bold; color: #e2e8f0;">{{ formatearFecha(pedido.fechaPedido) }}</span>
                            </td>
                            <td>
                                <span style="color: var(--brand-blue); font-weight: 900; display: block;">{{ pedido.nroPedido }}</span>
                                <span style="font-size: 0.75em; color: #94a3b8; text-transform: uppercase;">MÉTODO: {{ pedido.tipoPago.replace('_', ' ') }}</span>
                            </td>
                            <td>
                                <span style="font-weight: bold; color: #e2e8f0;">{{ pedido.nombreCliente }}</span><br>
                                <span style="font-size: 0.8em; color: #94a3b8;">📞 {{ pedido.telefonoCliente }} | ✉️ {{ pedido.emailCliente }}</span><br>
                                <span style="font-size: 0.8em; color: #94a3b8;">📍 {{ pedido.direccionEnvio }} {{ pedido.numeroCalle || '' }}, {{ pedido.ciudad }}</span>
                            </td>
                            <td>
                                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85em; color: #cbd5e1;">
                                    <li v-for="item in pedido.detalles" :key="item.idDetalle" style="margin-bottom: 3px;">
                                        <strong style="color: #fff;">{{ item.cantidad }}x</strong> {{ item.nombreProducto }}
                                    </li>
                                </ul>
                                <span style="font-size: 0.7em; color: #3b82f6; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px; display: block;">🚚 ENVÍO: {{ pedido.tipoEnvio }}</span>
                                <!-- Muestra el tracking si ya lo enviaron -->
                                <span v-if="pedido.numeroSeguimiento" style="font-size: 0.7em; color: #10b981; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; display: block;">📍 TRACK: {{ pedido.numeroSeguimiento }}</span>
                            </td>
                            <td>
                                <span style="font-weight: 900; color: #fff; font-size: 1.1em;">S/. {{ Number(pedido.total).toFixed(2) }}</span>
                            </td>
                            <td class="text-center">
                                <span :style="obtenerEstiloEstado(pedido.estado)">
                                    {{ pedido.estado }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                                    <button v-if="pedido.estado === 'PENDIENTE'" @click="abrirModal(pedido, 'ENVIAR')" class="btn-tech" style="padding: 6px 12px; font-size: 0.75em; border-color: #3b82f6; color: #3b82f6; width: 120px;">
                                        Marcar Enviado
                                    </button>
                                    
                                    <button v-if="pedido.estado === 'ENVIADO'" @click="abrirModal(pedido, 'ENTREGAR')" class="btn-tech" style="padding: 6px 12px; font-size: 0.75em; border-color: #10b981; color: #10b981; width: 120px;">
                                        Entregado
                                    </button>

                                    <button v-if="pedido.estado === 'PENDIENTE'" @click="abrirModal(pedido, 'REVERTIR')" class="btn-tech" style="padding: 6px 12px; font-size: 0.75em; border-color: #ef4444; color: #ef4444; width: 120px;">
                                        Revertir Venta
                                    </button>

                                    <span v-if="pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO'" style="font-size: 0.8em; color: #64748b; font-weight: bold;">
                                        Finalizado
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 2: VENTAS POS                          -->
        <!-- ========================================== -->
        <div v-show="tabActual === 'POS'">
            <div class="search-box-container">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" width="20" height="20">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="buscadorVentas" placeholder="Buscar por Cliente, S/N, Comprobante..." class="input-tech">
            </div>

            <div class="table-panel">
                <table class="tech-table" id="tablaVentas">
                    <thead>
                        <tr>
                            <th>FECHA / HORA</th>
                            <th>N° COMPROBANTE</th>
                            <th>CLIENTE</th>
                            <th>Producto (S/N)</th>
                            <th>TOTAL</th>
                            <th class="text-center">ESTADO</th>
                            <th class="text-center">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyHistorialVentas">
                        <tr>
                            <td colspan="7" class="text-center p-30 text-muted">
                                Cargando auditoría de transacciones...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- ========================================== -->
    <!-- MODAL INTERACTIVO DE GESTIÓN LOGÍSTICA     -->
    <!-- ========================================== -->
    <div v-if="modal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div class="p-6 border-b border-slate-100 bg-slate-50">
          <h3 class="text-xl font-black text-slate-800">{{ modal.titulo }}</h3>
          <p class="text-sm text-slate-500 mt-1">Pedido: <strong class="text-medical-blue">{{ modal.pedido.nroPedido }}</strong></p>
        </div>
        
        <div class="p-6">
          <!-- Campo solo para el estado ENVIAR -->
          <div v-if="modal.tipo === 'ENVIAR'">
            <label class="block text-xs font-black text-slate-400 uppercase mb-2">Empresa y Nro. de Seguimiento</label>
            <input v-model="modal.tracking" type="text" placeholder="Ej: Olva Courier - TRK-98765" class="w-full bg-white border-2 border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium text-slate-800">
            <p class="text-xs text-slate-400 mt-2">El cliente verá este código en su panel de seguimiento.</p>
          </div>
          
          <div v-if="modal.tipo === 'ENTREGAR'">
            <p class="text-slate-700 font-medium text-sm">Estás a punto de confirmar que el cliente recibió su paquete satisfactoriamente. Esta acción finalizará el ciclo logístico.</p>
          </div>
          
          <div v-if="modal.tipo === 'REVERTIR'">
            <p class="text-red-600 font-medium text-sm">Estás a punto de anular este pedido web. Los productos regresarán automáticamente al almacén y el estado cambiará a CANCELADO de forma irreversible.</p>
          </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button @click="cerrarModal" :disabled="procesando" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
          <button @click="ejecutarAccion" :disabled="procesando" class="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2" :class="modal.colorBtn">
            <span v-if="procesando" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ modal.textoBtn }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { apiClient } from '@/services/apiClient';

export default {
  name: 'HistorialVentasView',
  data() {
    return {
      tabActual: 'WEB', 
      pedidosWeb: [],
      procesando: false,
      // Objeto que controla la ventana Modal
      modal: {
        visible: false,
        tipo: '',
        pedido: null,
        titulo: '',
        tracking: '',
        colorBtn: '',
        textoBtn: ''
      }
    };
  },
  mounted() {
    window.VITE_API_URL = import.meta.env.VITE_API_URL;
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/historialventas.js'))
      .then(() => {
        setTimeout(() => {
          window.document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true, cancelable: true }));
        }, 50);
      })
      .catch(err => console.error("Error al inyectar infraestructura:", err));

    this.cargarPedidosWeb();
  },
  methods: {
    async cargarPedidosWeb() {
      try {
        this.pedidosWeb = await apiClient.obtenerTodosLosPedidosWeb();
      } catch (error) {
        console.error("Error al cargar pedidos web:", error);
      }
    },

    // 🌟 ABRIR EL MODAL SEGÚN LA ACCIÓN
    abrirModal(pedido, tipoAccion) {
      this.modal.pedido = pedido;
      this.modal.tipo = tipoAccion;
      this.modal.tracking = ''; 
      this.modal.visible = true;

      if (tipoAccion === 'ENVIAR') {
        this.modal.titulo = 'Registrar Despacho';
        this.modal.colorBtn = 'bg-blue-500 hover:bg-blue-600';
        this.modal.textoBtn = 'Confirmar Envío';
      } else if (tipoAccion === 'ENTREGAR') {
        this.modal.titulo = 'Confirmar Entrega';
        this.modal.colorBtn = 'bg-emerald-500 hover:bg-emerald-600';
        this.modal.textoBtn = 'Finalizar Pedido';
      } else if (tipoAccion === 'REVERTIR') {
        this.modal.titulo = 'Anular Pedido Web';
        this.modal.colorBtn = 'bg-red-500 hover:bg-red-600';
        this.modal.textoBtn = 'Revertir y Devolver Stock';
      }
    },

    cerrarModal() {
      this.modal.visible = false;
    },

    // 🌟 EJECUTAR LA ACCIÓN AL DAR CLIC EN GUARDAR EN EL MODAL
    async ejecutarAccion() {
      this.procesando = true;
      try {
        if (this.modal.tipo === 'ENVIAR') {
          // Validar que haya escrito un código (opcional, pero buena práctica)
          if (!this.modal.tracking) {
            alert("Por favor ingrese la empresa y número de seguimiento.");
            this.procesando = false;
            return;
          }
          await apiClient.actualizarEstadoPedidoWeb(this.modal.pedido.idVentaCliente, 'ENVIADO', this.modal.tracking);
        } 
        else if (this.modal.tipo === 'ENTREGAR') {
          await apiClient.actualizarEstadoPedidoWeb(this.modal.pedido.idVentaCliente, 'ENTREGADO');
        } 
        else if (this.modal.tipo === 'REVERTIR') {
          await apiClient.cancelarPedidoWeb(this.modal.pedido.idVentaCliente);
        }
        
        await this.cargarPedidosWeb();
        this.cerrarModal();
      } catch (error) {
        alert(error.message || "Hubo un error al procesar la acción.");
      } finally {
        this.procesando = false;
      }
    },

    formatearFecha(fechaStr) {
      if (!fechaStr) return '-';
      if (Array.isArray(fechaStr)) {
        const [year, month, day, hour = 0, minute = 0] = fechaStr;
        const fechaObj = new Date(year, month - 1, day, hour, minute);
        return fechaObj.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      }
      return new Date(fechaStr).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    },

    obtenerEstiloEstado(estado) {
      const base = "display: inline-block; padding: 4px 10px; border-radius: 50px; font-size: 0.75em; font-weight: 900; letter-spacing: 1px; border: 1px solid ";
      if (estado === 'PENDIENTE') return base + "rgba(245, 158, 11, 0.3); color: #fcd34d; background: rgba(245, 158, 11, 0.1);";
      if (estado === 'ENVIADO') return base + "rgba(59, 130, 246, 0.3); color: #93c5fd; background: rgba(59, 130, 246, 0.1);";
      if (estado === 'ENTREGADO') return base + "rgba(16, 185, 129, 0.3); color: #6ee7b7; background: rgba(16, 185, 129, 0.1);";
      if (estado === 'CANCELADO') return base + "rgba(239, 68, 68, 0.3); color: #fca5a5; background: rgba(239, 68, 68, 0.1);";
      return base + "rgba(255, 255, 255, 0.2); color: #fff;";
    },

    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        const scriptExistente = document.querySelector(`script[src="${ruta}"]`);
        if (scriptExistente) { resolve(); return; }
        const script = document.createElement('script');
        script.src = ruta;
        script.className = 'script-historial-modulo';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  },
  unmounted() {
    const scriptsCargados = document.querySelectorAll('.script-historial-modulo');
    scriptsCargados.forEach(script => {
      if (script.src.includes('historialventas.js')) script.remove();
    });
  }
}
</script>