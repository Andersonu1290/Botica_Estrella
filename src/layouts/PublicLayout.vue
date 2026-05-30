<template>
  <div class="min-h-screen flex flex-col bg-slate-50 selection:bg-medical-blue selection:text-white">
    
    <header class="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all">
      <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20 gap-4">
          
          <router-link to="/" class="flex items-center gap-3 flex-shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-medical-blue to-blue-400 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">★</div>
            <span class="text-xl md:text-2xl font-black text-medical-dark tracking-tight hidden sm:block">Botica Estrella</span>
          </router-link>

          <div class="flex-1 max-w-3xl w-full">
            <div class="relative group flex items-center">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400 group-focus-within:text-medical-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="search" v-model="filtrosStore.busqueda" placeholder="Buscar paracetamol, ibuprofeno..." class="block w-full pl-12 pr-4 py-3 border-2 border-slate-100 rounded-full bg-slate-50 focus:bg-white focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all font-medium">
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <router-link to="/" class="hidden lg:block text-slate-500 hover:text-medical-blue font-bold px-3 py-2 transition-colors">Inicio</router-link>
            <router-link to="/productos" class="hidden lg:block text-slate-500 hover:text-medical-blue font-bold px-3 py-2 transition-colors">Catálogo</router-link>
            <router-link to="/nosotros" class="hidden lg:block text-slate-500 hover:text-medical-blue font-bold px-3 py-2 transition-colors">Nosotros</router-link>
            
            <router-link to="/carrito" class="relative p-2 text-slate-500 hover:text-medical-blue transition-colors group">
              <svg class="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
                <span v-if="carritoStore.totalArticulos > 0" class="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full">
                  {{ carritoStore.totalArticulos }}
                </span>            </router-link>
            <router-link to="/perfil" class="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full text-white bg-slate-900 hover:bg-medical-blue shadow-lg hover:shadow-medical-blue/30 font-bold transition-all active:scale-95 gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Mi Cuenta
            </router-link>
          </div>

        </div>
      </div>
    </header>

    <main class="flex-grow w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <footer class="bg-medical-dark text-white pt-16 pb-8 mt-12 border-t-[6px] border-medical-blue">
      <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-medical-blue font-black text-xl">★</div>
            <span class="text-2xl font-black tracking-tight">Botica Estrella</span>
          </div>
          <p class="text-blue-200/80 leading-relaxed text-sm">Plataforma e-commerce farmacéutica de última generación. Cuidando tu salud con tecnología, rapidez y confianza.</p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-6 text-white tracking-wide">Navegación</h3>
          <ul class="space-y-3">
            <li><router-link to="/" class="text-blue-200 hover:text-white hover:underline transition-all text-sm">Inicio</router-link></li>
            <li><router-link to="/productos" class="text-blue-200 hover:text-white hover:underline transition-all text-sm">Catálogo de Productos</router-link></li>
            <li><router-link to="/nosotros" class="text-blue-200 hover:text-white hover:underline transition-all text-sm">Sobre Nosotros</router-link></li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-6 text-white tracking-wide">Legal y Ayuda</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-blue-200 hover:text-white hover:underline transition-all text-sm">Términos y Condiciones</a></li>
            <li><a href="#" class="text-blue-200 hover:text-white hover:underline transition-all text-sm">Políticas de Privacidad</a></li>
            <li><a href="#" class="text-blue-200 hover:text-white hover:underline transition-all text-sm">Libro de Reclamaciones</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-6 text-white tracking-wide">Contáctanos</h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-medical-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <div>
                <p class="text-sm text-blue-200 block">Llámanos</p>
                <p class="font-bold text-white">+51 924 412 183</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-medical-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <div>
                <p class="text-sm text-blue-200 block">Correo de soporte</p>
                <p class="font-bold text-white">soporte@estrella.com</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-slate-400 text-sm">© 2026 Botica Estrella. Todos los derechos reservados.</div>
        <div class="text-slate-400 text-sm font-medium flex items-center gap-2">
          <span>Desarrollado por</span>
          <span class="bg-white text-medical-dark px-2 py-0.5 rounded font-black text-xs tracking-wider">Grupo 7</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
// 🌟 Importamos el store de filtros para que el v-model del input funcione
import { filtrosStore } from '@/store/filtros';

import { carritoStore } from '@/store/carrito';
</script>

<style>
/* No importamos estilos.css aquí, por lo que Tailwind funcionará limpio */
</style>