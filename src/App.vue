<template>
  <!-- ⚠️ Esto le dice a Vue que renderice la ruta actual (el Login) -->
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'

export default {
  name: 'App'
}
</script>

<style>
/* Estilos globales de reseteo si los necesitas, si no, déjalo vacío */
body {
  margin: 0;
  padding: 0;
}
</style>
