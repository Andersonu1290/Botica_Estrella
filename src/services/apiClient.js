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

  // 🌟 NUEVA FUNCIÓN (FASE 5): Enviar la venta a Spring Boot
  // 🌟 NUEVA FUNCIÓN: Enviar la venta a Spring Boot (Ahora extrae el error real)
  async procesarVenta(ventaPayload) {
    try {
      const respuesta = await fetch(`${BASE_URL}/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaPayload)
      });
      
      // Si Spring Boot responde con un Error 400 o 500
      if (!respuesta.ok) {
        // 🔥 Extraemos la queja exacta de Java
        const quejaDeJava = await respuesta.text(); 
        console.error("Motivo exacto del rechazo de Spring Boot:", quejaDeJava);
        throw new Error(`El servidor dice: ${quejaDeJava}`);
      }
      
      return await respuesta.json(); 
    } catch (error) {
      console.error("Error crítico procesando venta:", error);
      throw error; 
    }
  },

// 🔥 NUEVA FUNCIÓN (FASE 2): Obtener el historial del cliente logueado
  async obtenerMisCompras(idUsuario) {
    try {
      const respuesta = await fetch(`${BASE_URL}/ventas/mis-compras/${idUsuario}`);
      if (!respuesta.ok) throw new Error('No se pudo cargar el historial de compras.');
      return await respuesta.json();
    } catch (error) {
      console.error("Error en apiClient al traer compras:", error);
      return [];
    }
  },

// 🔥 NUEVA FUNCIÓN (FASE 3): Obtener listado dinámico de categorías
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
  }
};