import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductCard from '../src/components/public/ProductCard.vue'; // Mantiene tu ruta exacta
import { carritoStore } from '../src/store/carrito';

describe('ProductCard Component', () => {
  it('Debe disparar la función agregarBD al hacer clic en el botón (+)', async () => {
    // 1. Espiamos la función Y evitamos que ejecute el fetch interno defectuoso en Node
    const spy = vi.spyOn(carritoStore, 'agregarBD').mockImplementation(() => {});
    
    // 2. Montamos el componente (Agregamos stubs para silenciar la alerta de router-link)
    const wrapper = mount(ProductCard, {
      props: {
        producto: { idProducto: 1, nombre: 'Paracetamol', precio: 5.00, codigoSKU: 'MED-001' }
      },
      global: {
        stubs: {
          'router-link': true
        }
      }
    });

    // 3. Buscamos el botón y simulamos el clic
    const boton = wrapper.find('button');
    await boton.trigger('click');

    // 4. Verificamos que se haya llamado a la función
    expect(spy).toHaveBeenCalled();

    // Limpieza al terminar la prueba
    spy.mockRestore();
  });
});
