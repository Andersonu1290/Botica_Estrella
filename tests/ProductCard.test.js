import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductCard from '../src/components/public/ProductCard.vue';
import { carritoStore } from '../src/store/carrito';
import { authStore } from '../src/store/auth'; 

describe('ProductCard Component', () => {
  it('Debe disparar la función agregarBD al hacer clic en el botón (+)', async () => {
    // 1. Espiamos la función
    const spy = vi.spyOn(carritoStore, 'agregarBD').mockImplementation(() => {});
    
    // 🌟 2. CORRECCIÓN: Simulamos la sesión alimentando las variables reales
    // Al darle un token, el getter "estaLogueado" automáticamente devolverá "true"
    authStore.token = 'token-falso-123';
    authStore.usuarioActual = { idUsuario: 1 };

    // Evitamos que los alert() nativos ensucien la consola de Vitest
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    // 3. Montamos el componente
    const wrapper = mount(ProductCard, {
      props: {
        // AGREGAMOS STOCK para que pase la validación de "Agotado"
        producto: { idProducto: 1, nombre: 'Paracetamol', precio: 5.00, codigoSKU: 'MED-001', stock: 10 }
      },
      global: {
        stubs: {
          'router-link': true
        }
      }
    });

    // 4. Buscamos el botón y simulamos el clic
    const boton = wrapper.find('button');
    await boton.trigger('click');

    // 5. Verificamos que se haya llamado a la función
    expect(spy).toHaveBeenCalled();

    // 6. Limpieza al terminar la prueba para no afectar a las demás
    spy.mockRestore();
    authStore.token = null;
    authStore.usuarioActual = null;
  });
});