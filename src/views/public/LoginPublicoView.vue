<template>
  <div class="max-w-md mx-auto py-16 px-4">
    <div class="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
      
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-medical-blue to-blue-400 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg">★</div>
        <h1 class="text-2xl font-black text-slate-800">{{ esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión' }}</h1>
        <p class="text-slate-500 mt-2">Accede para gestionar tus compras y carrito.</p>
      </div>

      <form @submit.prevent="procesarFormulario" class="space-y-5">
        <div>
          <label class="block text-xs font-black text-slate-400 uppercase mb-2">Usuario</label>
          <input v-model="form.username" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium">
        </div>
        
        <div>
          <label class="block text-xs font-black text-slate-400 uppercase mb-2">Contraseña</label>
          <input v-model="form.password" type="password" required class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-blue outline-none transition-all font-medium">
        </div>

        <button type="submit" :disabled="procesando" class="w-full bg-medical-blue hover:bg-medical-dark text-white py-4 rounded-xl font-black transition-all shadow-lg active:scale-95 disabled:opacity-50">
          {{ procesando ? 'Cargando...' : (esRegistro ? 'Registrarme' : 'Ingresar') }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <button @click="esRegistro = !esRegistro" type="button" class="text-sm font-bold text-slate-500 hover:text-medical-blue transition-colors">
          {{ esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí' }}
        </button>
      </div>

      <div v-if="mensajeError" class="mt-4 p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-bold text-center">
        {{ mensajeError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authStore } from '@/store/auth';
import { carritoStore } from '@/store/carrito';

const router = useRouter();
const route = useRoute();
const esRegistro = ref(false);
const procesando = ref(false);
const mensajeError = ref('');

const form = reactive({ username: '', password: '' });
const BASE_URL = (import.meta.env.VITE_API_URL || '/api') + '/v1'; // ✅ CORREGIDO

const procesarFormulario = async () => {
  procesando.value = true;
  mensajeError.value = '';

  try {
    if (esRegistro.value) {
      // Flujo Registro (Llama al nuevo endpoint que forzará el rol CLIENTE)
      const res = await fetch(`${BASE_URL}/usuarios/registro-tienda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      if (!res.ok) throw new Error("El usuario ya existe o hubo un error.");
      
      alert("Cuenta creada. Ahora inicia sesión.");
      esRegistro.value = false;
      form.password = '';
    } else {
      // Flujo Login
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Credenciales incorrectas.");
      
      const data = await res.json();
      
      // Seguridad: Verificamos que sea un CLIENTE, no un Admin
      if (data.rol !== 'CLIENTE') {
         throw new Error("Acceso denegado. Utilice el panel administrativo.");
      }

      authStore.iniciarSesion(data);
      await carritoStore.cargarCarritoBD(data.idUsuario); // Cargamos su carrito
      
      const redireccion = route.query.redirect || '/';
      router.push(redireccion);
    }
  } catch (error) {
    mensajeError.value = error.message;
  } finally {
    procesando.value = false;
  }
};
</script>
