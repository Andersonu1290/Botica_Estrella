import { reactive } from 'vue';

const BASE_URL = (import.meta.env.VITE_API_URL || '/api') + '/v1';

export const carritoStore = reactive({
  items: [],
  cargando: false,

  get totalArticulos() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  },

  get subtotalPrecio() {
    return this.items.reduce((total, item) => {
      if (!item.producto) return total;
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  },

  // 1. Cargar el carrito desde MySQL
  async cargarCarritoBD(idUsuario) {
    if (!idUsuario) return;
    this.cargando = true;
    try {
      const res = await fetch(`${BASE_URL}/carrito/${idUsuario}`);
      if (res.ok) {
        this.items = await res.json();
      }
    } catch (error) {
      console.error("Error cargando carrito de BD:", error);
    } finally {
      this.cargando = false;
    }
  },

  // 2. Agregar o actualizar cantidad en MySQL
  async agregarBD(idUsuario, producto, cantidadAñadida) {
    if (!idUsuario) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    // 🔥 NUEVA VALIDACIÓN: Control de Stock Estricto
    const stockDisponible = producto.stockActual ?? producto.stock ?? 0;
    
    // Buscamos si el producto ya está en nuestro carrito local para saber la cantidad actual
    const itemExistente = this.items.find(i => i.producto && i.producto.idProducto === producto.idProducto);
    const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;

    // Solo bloqueamos si estamos sumando (+1). Si cantidadAñadida es negativa (-1), dejamos pasar para que pueda restar
    if (cantidadAñadida > 0 && (cantidadActualEnCarrito + cantidadAñadida > stockDisponible)) {
      alert(`Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles de ${producto.nombre}.`);
      return; // 🛑 Bloqueamos la petición a Spring Boot / MySQL
    }

    try {
      await fetch(`${BASE_URL}/carrito/agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: idUsuario,
          idProducto: producto.idProducto,
          cantidad: cantidadAñadida
        })
      });
      // Recargamos el carrito para sincronizar
      await this.cargarCarritoBD(idUsuario);
    } catch (error) {
      console.error("Error agregando a BD:", error);
    }
  },

  // 3. Eliminar una fila (item) de MySQL
  async eliminarProductoBD(idUsuario, idItem) {
    try {
      await fetch(`${BASE_URL}/carrito/item/${idItem}`, { method: 'DELETE' });
      await this.cargarCarritoBD(idUsuario);
    } catch (error) {
      console.error("Error eliminando de BD:", error);
    }
  },

  // 4. Limpiar todo tras pagar
  async vaciarBD(idUsuario) {
    try {
      const res = await fetch(`${BASE_URL}/carrito/vaciar/${idUsuario}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      this.items = [];
    } catch (error) {
      console.error("Error vaciando BD:", error);
      throw error;
    }
  }
});