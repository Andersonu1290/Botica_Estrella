import { describe, it, expect, beforeEach } from 'vitest';
import { filtrosStore } from '../src/store/filtros.js';

beforeEach(() => {
  filtrosStore.busqueda = '';
  filtrosStore.categoria = 'todos';
});

describe('Filtros Store Logic', () => {
  
  it('Debe actualizar el criterio de búsqueda', () => {
    filtrosStore.busqueda = 'Paracetamol';
    expect(filtrosStore.busqueda).toBe('Paracetamol');
  });

  it('Debe cambiar la categoría seleccionada', () => {
    filtrosStore.categoria = 'analgesicos';
    expect(filtrosStore.categoria).toBe('analgesicos');
  });
});