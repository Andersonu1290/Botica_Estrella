import { describe, it, expect, vi, beforeEach } from 'vitest';
import { carritoStore } from '../src/store/carrito.js';

// Limpiamos el estado después de cada test para que no se mezclen los datos
beforeEach(() => {
  carritoStore.items = [];
});

describe('Carrito Store Logic', () => {
  
  it('Debe calcular total de artículos y subtotal correctamente', () => {
    // Simulamos items en el carrito
    carritoStore.items = [
      { producto: { precio: 10 }, cantidad: 2 }, // Total: 20
      { producto: { precio: 5 }, cantidad: 1 }   // Total: 5
    ];

    expect(carritoStore.totalArticulos).toBe(3);
    expect(carritoStore.subtotalPrecio).toBe(25);
  });

  it('Debe cargar datos correctamente al llamar a la API (Mocking)', async () => {
    // 1. Preparamos la respuesta falsa que daría el backend
    const itemsMock = [{ producto: { precio: 10 }, cantidad: 1 }];
    
    // 2. "Engañamos" al navegador con vi.stubGlobal
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => itemsMock
    }));

    // 3. Ejecutamos la función del store
    await carritoStore.cargarCarritoBD(1);

    // 4. Verificamos que el estado se actualizó
    expect(carritoStore.items).toEqual(itemsMock);
    expect(carritoStore.cargando).toBe(false);
  });

  it('Debe vaciar el carrito al llamar a vaciarBD', async () => {
    carritoStore.items = [{ id: 1 }];
    
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    
    await carritoStore.vaciarBD(1);
    expect(carritoStore.items.length).toBe(0);
  });
});