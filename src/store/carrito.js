import { reactive } from 'vue';

export const carritoStore = reactive({
  // Arreglo principal que guarda los productos seleccionados
  items: [],

  // Getter: Calcula cuántos artículos hay en total (para la burbuja roja del Navbar)
  get totalArticulos() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  },

  // Getter: Calcula el costo total en dinero
  get subtotalPrecio() {
    return this.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  },

  // Acción: Agregar al carrito
  agregar(producto, cantidad) {
    // 1. Buscamos si el cliente ya había agregado este producto antes
    const itemExistente = this.items.find(item => item.producto.idProducto === producto.idProducto);
    
    // 2. Extraemos el stock real para que no pase del límite
    const stockReal = producto.stockActual ?? producto.stock ?? 0;

    if (itemExistente) {
      // Si ya estaba, sumamos la cantidad nueva a la anterior, sin pasarnos del stock
      const nuevoTotal = itemExistente.cantidad + cantidad;
      itemExistente.cantidad = nuevoTotal > stockReal ? stockReal : nuevoTotal;
    } else {
      // Si es nuevo, lo metemos al arreglo
      this.items.push({
        producto: producto,
        cantidad: cantidad
      });
    }
  },

  // Acción: Eliminar una fila del carrito
  eliminarProducto(idProducto) {
    this.items = this.items.filter(item => item.producto.idProducto !== idProducto);
  },

  // Acción: Limpiar todo el carrito (Para después de pagar)
  vaciar() {
    this.items = [];
  }
});