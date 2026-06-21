const BASE_URL = (import.meta.env.VITE_API_URL || '/api') + '/v1';

export const apiClient = {
  
  async obtenerProductos() {
    try {
      const respuesta = await fetch(`${BASE_URL}/productos`);
      if (!respuesta.ok) throw new Error('Error al obtener el inventario');
      return await respuesta.json();
    } catch (error) {
      console.error("Error en apiClient:", error);
      return []; 
    }
  },

  async obtenerProductoPorId(id) {
    try {
      const respuesta = await fetch(`${BASE_URL}/productos/${id}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoPayload)
      });
      
      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null);
        throw new Error(errorData?.error || `Error del servidor: ${respuesta.status}`);
      }
      
      return await respuesta.json(); 
    } catch (error) {
      console.error("Error crítico procesando pedido de cliente:", error);
      throw error; 
    }
  },

  async obtenerMisCompras(idUsuario) {
    try {
      const respuesta = await fetch(`${BASE_URL}/pedidos/cliente/${idUsuario}`);
      if (!respuesta.ok) throw new Error('No se pudo cargar el historial de compras.');
      const data = await respuesta.json();
      return data.pedidos || []; 
    } catch (error) {
      console.error("Error en apiClient al traer compras:", error);
      return [];
    }
  },

  async obtenerCategorias() {
    try {
      const respuesta = await fetch(`${BASE_URL}/categorias`);
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
      const respuesta = await fetch(`${BASE_URL}/ventas/historial`);
      if (!respuesta.ok) throw new Error('Error al obtener ventas locales');
      return await respuesta.json();
    } catch (error) {
      console.error("Error cargando POS:", error);
      return [];
    }
  },

  async obtenerTodosLosPedidosWeb() {
    try {
      const respuesta = await fetch(`${BASE_URL}/pedidos/admin/todos`);
      if (!respuesta.ok) throw new Error('Error al obtener pedidos web');
      const data = await respuesta.json();
      return data.pedidos || [];
    } catch (error) {
      console.error("Error cargando pedidos web:", error);
      return [];
    }
  },

  async actualizarEstadoPedidoWeb(idVentaCliente, nuevoEstado) {
    try {
      const respuesta = await fetch(`${BASE_URL}/pedidos/${idVentaCliente}/estado?nuevoEstado=${nuevoEstado}`, {
        method: 'PUT'
      });
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
        method: 'PUT'
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