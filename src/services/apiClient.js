import { authStore } from '@/store/auth';
import { esJwtExpirado, obtenerTokenCliente } from '@/utils/auth';

const BASE_URL = (import.meta.env.VITE_API_URL || '/api') + '/v1';

const buildHeaders = (isMultipart = false, incluirAuth = true) => {
  const headers = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (incluirAuth) {
    const token = obtenerTokenCliente();
    if (token && !esJwtExpirado(token)) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const manejarRespuesta = async (respuesta) => {
  if (respuesta.status === 401) {
    authStore.cerrarSesion();
    throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
  }

  if (respuesta.status === 204) {
    return null;
  }

  const texto = await respuesta.text();

  let data;

  try {
    data = texto ? JSON.parse(texto) : {};
  } catch {
    data = { mensaje: texto };
  }

  if (!respuesta.ok) {
    throw new Error(data.error || data.mensaje || `Error HTTP ${respuesta.status}`);
  }

  return data;
};

export const apiClient = {
  
  async obtenerProductos() {
    try {
      const respuesta = await fetch(`${BASE_URL}/productos`, {
        method: 'GET',
        headers: buildHeaders(false, false)
      });
      if (!respuesta.ok) throw new Error('Error al obtener el inventario');
      return await respuesta.json();
    } catch (error) {
      console.error("Error en apiClient:", error);
      return []; 
    }
  },

  async obtenerProductoPorId(id) {
    try {
      const respuesta = await fetch(`${BASE_URL}/productos/${id}`, {
        method: 'GET',
        headers: buildHeaders(false, false)
      });
      if (!respuesta.ok) throw new Error(`Error al obtener el producto con ID: ${id}`);
      return await respuesta.json();
    } catch (error) {
      console.error(`Error al cargar el detalle del producto ${id}:`, error);
      return null;
    }
  },

  async crearPedido(pedidoPayload) {
    try {
      const respuesta = await fetch(`${BASE_URL}/pedidos`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(pedidoPayload)
      });
      
      return await manejarRespuesta(respuesta);
    } catch (error) {
      console.error("Error crítico procesando pedido de cliente:", error);
      throw error; 
    }
  },

  async obtenerMisCompras(idUsuario) {
    try {
      const respuesta = await fetch(`${BASE_URL}/pedidos/cliente/${idUsuario}`, {
        method: 'GET',
        headers: buildHeaders()
      });
      const data = await manejarRespuesta(respuesta);
      return Array.isArray(data) ? data : (data.pedidos || []);
    } catch (error) {
      console.error("Error en apiClient al traer compras:", error);
      throw error;
    }
  },

  async obtenerCategorias() {
    try {
      const respuesta = await fetch(`${BASE_URL}/categorias`, {
        method: 'GET',
        headers: buildHeaders(false, false)
      });
      if (!respuesta.ok) throw new Error('Error al obtener categorías');
      return await respuesta.json();
    } catch (error) {
      console.error("Error cargando categorías:", error);
      return [];
    }
  },

  obtenerUrlImagen(idProducto) {
    return `${BASE_URL}/productos/${idProducto}/imagen`;
  },

  // ====================================================================
  // 🔥 FUNCIONES EXCLUSIVAS PARA EL PANEL DE ADMINISTRADOR (FASE 4)
  // ====================================================================
  
  async obtenerHistorialPOS() {
    try {
      const respuesta = await fetch(`${BASE_URL}/ventas/historial`, {
        method: 'GET',
        headers: buildHeaders()
      });
      if (!respuesta.ok) throw new Error('Error al obtener ventas locales');
      return await respuesta.json();
    } catch (error) {
      console.error("Error cargando POS:", error);
      return [];
    }
  },

  async obtenerTodosLosPedidosWeb() {
    try {
      const respuesta = await fetch(`${BASE_URL}/pedidos/admin/todos`, {
        method: 'GET',
        headers: buildHeaders()
      });
      if (!respuesta.ok) throw new Error('Error al obtener pedidos web');
      const data = await respuesta.json();
      return Array.isArray(data) ? data : (data.pedidos || []);
    } catch (error) {
      console.error("Error cargando pedidos web:", error);
      return [];
    }
  },

  // Cambia el estado y opcionalmente envía el número de seguimiento
  async actualizarEstadoPedidoWeb(idVentaCliente, nuevoEstado, numeroSeguimiento = '') {
    try {
      let url = `${BASE_URL}/pedidos/${idVentaCliente}/estado?nuevoEstado=${nuevoEstado}`;
      
      // Si el administrador escribió un código de seguimiento, lo mandamos en la URL
      if (numeroSeguimiento) {
        url += `&numeroSeguimiento=${encodeURIComponent(numeroSeguimiento)}`;
      }

      const respuesta = await fetch(url, { method: 'PUT', headers: buildHeaders() });
      if (!respuesta.ok) throw new Error('Error al actualizar estado');
      return await respuesta.json();
    } catch (error) {
      console.error("Error actualizando estado:", error);
      throw error;
    }
  },

  // 🔥 NUEVO: Función para revertir/cancelar una venta web
  async cancelarPedidoWeb(idVentaCliente) {
    try {
      const respuesta = await fetch(`${BASE_URL}/pedidos/${idVentaCliente}/cancelar`, {
        method: 'PUT',
        headers: buildHeaders()
      });
      if (!respuesta.ok) {
        const err = await respuesta.json().catch(() => null);
        throw new Error(err?.error || 'Error al cancelar pedido');
      }
      return await respuesta.json();
    } catch (error) {
      console.error("Error cancelando pedido:", error);
      throw error;
    }
  }

};