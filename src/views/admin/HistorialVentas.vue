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
                                <span style="font-size: 0.8em; color: #94a3b8;">📍 {{ pedido.direccionEnvio }} {{ pedido.numeroCalle }}, {{ pedido.ciudad }}</span>
                            </td>

                            <td>
                                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85em; color: #cbd5e1;">
                                    <li v-for="item in pedido.detalles" :key="item.idDetalle" style="margin-bottom: 3px;">
                                        <strong style="color: #fff;">{{ item.cantidad }}x</strong> {{ item.nombreProducto }}
                                    </li>
                                </ul>
                                <span style="font-size: 0.7em; color: #3b82f6; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px; display: block;">🚚 ENVÍO: {{ pedido.tipoEnvio }}</span>
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
                                    <button v-if="pedido.estado === 'PENDIENTE'" @click="cambiarEstado(pedido, 'ENVIADO')" class="btn-tech" style="padding: 6px 12px; font-size: 0.75em; border-color: #3b82f6; color: #3b82f6; width: 120px;">
                                        Marcar Enviado
                                    </button>
                                    
                                    <button v-if="pedido.estado === 'ENVIADO'" @click="cambiarEstado(pedido, 'ENTREGADO')" class="btn-tech" style="padding: 6px 12px; font-size: 0.75em; border-color: #10b981; color: #10b981; width: 120px;">
                                        Entregado
                                    </button>

                                    <button v-if="pedido.estado === 'PENDIENTE'" @click="revertirVentaWeb(pedido)" class="btn-tech" style="padding: 6px 12px; font-size: 0.75em; border-color: #ef4444; color: #ef4444; width: 120px;">
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
  </div>
</template>

<script>
import { apiClient } from '@/services/apiClient';

export default {
  name: 'HistorialVentasView',
  data() {
    return {
      tabActual: 'WEB', 
      pedidosWeb: []
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
      .catch(err => console.error("Error al inyectar infraestructura del historial de ventas:", err));

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

    async cambiarEstado(pedido, nuevoEstado) {
      if (confirm(`¿Estás seguro de marcar el pedido ${pedido.nroPedido} como ${nuevoEstado}?`)) {
        try {
          await apiClient.actualizarEstadoPedidoWeb(pedido.idVentaCliente, nuevoEstado);
          await this.cargarPedidosWeb(); 
        } catch (error) {
          alert("Hubo un error al actualizar el estado.");
        }
      }
    },

    // 🔥 NUEVA FUNCIÓN: Lógica para Revertir Venta Web
    async revertirVentaWeb(pedido) {
      if (confirm(`ATENCIÓN: ¿Estás seguro de REVERTIR el pedido ${pedido.nroPedido}? \n\nEsta acción es irreversible y los productos regresarán al stock del almacén automáticamente.`)) {
        try {
          await apiClient.cancelarPedidoWeb(pedido.idVentaCliente);
          alert(`El pedido ${pedido.nroPedido} ha sido revertido exitosamente.`);
          await this.cargarPedidosWeb(); // Refresca la tabla
        } catch (error) {
          alert(error.message || "Hubo un error al revertir la venta web.");
        }
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
      if (script.src.includes('historialventas.js')) {
        script.remove();
      }
    });
  }
}
</script>

<style scoped>
</style>