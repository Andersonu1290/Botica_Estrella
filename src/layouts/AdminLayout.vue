<template>
  <div class="admin-container">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// 1. CUANDO EL USUARIO ENTRA AL ADMIN: Cargamos el CSS oscuro
onMounted(() => {
  if (!document.getElementById('css-exclusivo-admin')) {
    const link = document.createElement('link');
    link.id = 'css-exclusivo-admin';
    link.rel = 'stylesheet';
    link.href = '/admin/css/estilos.css';
    document.head.appendChild(link);
  }
});

// 2. CUANDO EL USUARIO SALE A LA TIENDA PÚBLICA: Destruimos el CSS oscuro
onUnmounted(() => {
  const link = document.getElementById('css-exclusivo-admin');
  if (link) {
    link.remove(); // ¡La magia real! Borramos el rastro del admin.
  }
});
</script>