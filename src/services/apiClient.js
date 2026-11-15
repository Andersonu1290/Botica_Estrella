import { authStore } from '@/store/auth';
import { esJwtExpirado, obtenerTokenCliente } from '@/utils/auth';

const BASE_URL = (import.meta.env.VITE_API_URL || '/api') + '/v1';

const buildHeaders = (isMultipart = false, incluirAuth = true) => {
  const headers = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (incluirAuth) {
    // 🔥 1. Buscamos el token del administrador en la sesión de navegación
    let tokenAdmin = sessionStorage.getItem('token');
    
    // (Respaldo técnico por si guardaste el token dentro del objeto usuarioActivo)
    if (!tokenAdmin && sessionStorage.getItem('usuarioActivo')) {
        try {
            tokenAdmin = JSON.parse(sessionStorage.getItem('usuarioActivo')).token;
        } catch(e) {}
    }

    // 🔥 2. Unimos los mundos: Usa el token del Admin si existe; si no, usa el del cliente E-commerce
    const token = tokenAdmin || localStorage.getItem('token') || obtenerTokenCliente();

    if (token && !esJwtExpirado(token)) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const manejarRespuesta = async (respuesta) => {
  // 🔥 CORRECCIÓN: Agregamos el 403 para atrapar tokens caducados o inválidos
  if (respuesta.status === 401 || respuesta.status === 403) {
    authStore.cerrarSesion(); // Esto destruye el token guardado
    throw new Error('Tu sesión ha expirado o no tienes permisos. Inicia sesión nuevamente.');
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
  },

  // ====================================================================
  //   MÓDULO SMARTCARE (HITL + OCR)
  // ====================================================================
  async procesarRecetaOcr(archivo) {
    try {
      const formData = new FormData();
      formData.append('imagen', archivo);

      // Pasamos 'true' en el primer parámetro de buildHeaders para indicar que es Multipart
      // Esto evita que setee 'application/json' y deja que el navegador calcule el Boundary de la imagen
      const respuesta = await fetch(`${BASE_URL}/smartcare/procesar-ocr`, {
        method: 'POST',
        headers: buildHeaders(true, true),
        body: formData
      });
      return await manejarRespuesta(respuesta);
    } catch (error) {
      console.error("Error al procesar el OCR:", error);
      throw error;
    }
  },

  async registrarTratamiento(datosTratamiento) {
    try {
      const respuesta = await fetch(`${BASE_URL}/smartcare/tratamientos`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(datosTratamiento)
      });
      return await manejarRespuesta(respuesta);
    } catch (error) {
      console.error("Error guardando el tratamiento:", error);
      throw error;
    }
  },

  async obtenerHistorialSmartCare(idUsuario) {
    try {
      const respuesta = await fetch(`${BASE_URL}/smartcare/tratamientos/usuario/${idUsuario}`, {
        method: 'GET',
        headers: buildHeaders()
      });
      return await manejarRespuesta(respuesta);
    } catch (error) {
      console.error("Error cargando historial de SmartCare:", error);
      throw error;
    }
  },

  async registrarTomaDosis(idTratamiento, idUsuario) {
    try {
      const respuesta = await fetch(`${BASE_URL}/smartcare/tratamientos/${idTratamiento}/tomar-dosis?idUsuario=${idUsuario}`, {
        method: 'PUT',
        headers: buildHeaders()
      });
      return await manejarRespuesta(respuesta);
    } catch (error) {
      console.error("Error al registrar la toma:", error);
      throw error;
    }
  },

  async eliminarTratamiento(idTratamiento, idUsuario) {
    try {
      const respuesta = await fetch(`${BASE_URL}/smartcare/tratamientos/${idTratamiento}?idUsuario=${idUsuario}`, {
        method: 'DELETE',
        headers: buildHeaders()
      });
      return await manejarRespuesta(respuesta);
    } catch (error) {
      console.error("Error al eliminar el tratamiento:", error);
      throw error;
    }
  },

  async actualizarTratamiento(idTratamiento, datosNuevos, idUsuario) {
    try {
      const respuesta = await fetch(`${BASE_URL}/smartcare/tratamientos/${idTratamiento}?idUsuario=${idUsuario}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(datosNuevos)
      });
      return await manejarRespuesta(respuesta);
    } catch (error) {
      console.error("Error al actualizar el tratamiento:", error);
      throw error;
    }
  },

  // Consultar cuántas pastillas reales tiene el paciente en su historial de compras
  async consultarStockBotiquin(idUsuario, idProducto) {
    try {
      const respuesta = await fetch(`${BASE_URL}/smartcare/botiquin/stock?idUsuario=${idUsuario}&idProducto=${idProducto}`, {
        method: 'GET',
        headers: buildHeaders()
      });
      
      if (!respuesta.ok) return 0;
      
      const stockText = await respuesta.text();
      return Number(stockText) || 0;
    } catch (error) {
      console.error("Error al consultar el botiquín virtual:", error);
      return 0; // En caso de fallo de red, asumimos 0 para obligar a comprar
    }
  },

};
