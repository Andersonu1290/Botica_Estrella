<template>
  <div class="admin-container">
    <router-view />
    <footer class="admin-legal-footer">
      <router-link to="/terminos-condiciones">Términos y Condiciones</router-link>
    </footer>
  </div>
</template>

<script setup>
console.log('ADMIN LAYOUT INIT')
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-container :deep(> :first-child) {
  flex: 1;
}

.admin-legal-footer {
  background: #0a3663;
  color: #fff;
  padding: 12px 16px;
  text-align: center;
}

.admin-legal-footer a {
  color: #fff;
  font-size: 0.95rem;
  text-decoration: underline;
}

.admin-legal-footer a:hover {
  color: #bfdbfe;
}
</style>
