<script setup>
// Iconos de trazo (24x24). Uso: <Icono nombre="pastilla" class="h-5 w-5" />
defineProps({
  nombre: { type: String, required: true },
});

const ICONOS = {
  pastilla: [
    'm10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z',
    'm8.5 8.5 7 7',
  ],
  reloj: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 6v6l4 2'],
  check: ['M20 6 9 17l-5-5'],
  mas: ['M12 5v14', 'M5 12h14'],
  flechaIzq: ['m12 19-7-7 7-7', 'M19 12H5'],
  alerta: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 8v4', 'M12 16h.01'],
  info: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 16v-4', 'M12 8h.01'],
  bolsa: [
    'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z',
    'M3 6h18',
    'M16 10a4 4 0 0 1-8 0',
  ],
  candado: ['M5 11h14v10H5Z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  camara: [
    'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z',
    'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  ],
  resumen: ['M3 3h7v9H3Z', 'M14 3h7v5h-7Z', 'M14 12h7v9h-7Z', 'M3 16h7v5H3Z'],
  receta: [
    'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z',
    'M14 2v6h6',
    'M16 13H8',
    'M16 17H8',
    'M10 9H8',
  ],
  calendario: [
    'M8 2v4',
    'M16 2v4',
    'M3 10h18',
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  ],
  casa: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z', 'M9 22V12h6v10'],
  cerrar: ['M18 6 6 18', 'M6 6l12 12'],
  chevronDer: ['m9 18 6-6-6-6'],
  chevronAbajo: ['m6 9 6 6 6-6'],
  chispa: ['M13 2 3 14h9l-1 8 10-12h-9Z'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
};
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="(d, i) in ICONOS[nombre] || []" :key="i" :d="d" />
  </svg>
</template>