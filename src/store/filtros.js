import { reactive } from 'vue';

export const filtrosStore = reactive({
  busqueda: '',
  categoria: 'todos',
  precioMaximo: 200,
  orden: 'defecto', // 'menor-precio', 'mayor-precio', 'a-z'
  soloStock: false  // Switch para mostrar solo lo que hay en el Kardex
});