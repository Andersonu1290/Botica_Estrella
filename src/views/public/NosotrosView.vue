<template>
  <main class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-20">
    
    <section class="relative w-full h-[450px] rounded-[2rem] overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group flex items-center">
      <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" alt="Fondo Hero" />
      
      <div class="absolute inset-0 bg-gradient-to-r from-medical-dark/90 via-medical-dark/70 to-transparent pointer-events-none z-10"></div>

      <div class="relative z-20 p-8 md:p-16 max-w-3xl text-white">
        <h1 class="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg leading-tight">Salud cercana, <br/> atención moderna</h1>
        <p class="text-blue-100 mb-8 text-lg md:text-xl drop-shadow-md">Combinamos experiencia farmacéutica, productos confiables y canales digitales para cuidar a tu familia con rapidez y calidez.</p>
        
        <div class="flex flex-wrap gap-4 mb-10">
          <router-link to="/productos" class="bg-medical-accent hover:bg-green-500 text-white font-black py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg">Explorar catálogo</router-link>
          <a href="#valores" class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-3 px-8 rounded-full transition-all">Conocer valores</a>
        </div>

        <div class="grid grid-cols-3 gap-6 border-t border-white/20 pt-6">
          <div>
            <strong class="block text-2xl md:text-3xl font-black text-medical-accent">+1k</strong>
            <span class="text-xs md:text-sm text-blue-100">Clientes atendidos</span>
          </div>
          <div>
            <strong class="block text-2xl md:text-3xl font-black text-medical-accent">24/7</strong>
            <span class="text-xs md:text-sm text-blue-100">Canal digital</span>
          </div>
          <div>
            <strong class="block text-2xl md:text-3xl font-black text-medical-accent">100%</strong>
            <span class="text-xs md:text-sm text-blue-100">Productos verificados</span>
          </div>
        </div>
      </div>
    </section>

    <section class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <span class="text-medical-blue font-bold tracking-widest uppercase text-sm">Nuestra Historia</span>
        <h2 class="text-4xl font-black text-slate-800 leading-tight">Comprometidos con el Perú</h2>
        <p class="text-slate-600 text-lg leading-relaxed">Botica Estrella nació con la visión de hacer que la salud sea accesible para todos. Desde nuestras raíces en Lima, hemos crecido manteniendo la misma calidez humana y profesionalismo que nos caracteriza.</p>
        <p class="text-slate-600 text-lg leading-relaxed">Entendemos que detrás de cada receta hay una persona y una familia que busca tranquilidad. Por eso, no solo vendemos productos, ofrecemos asesoría experta de confianza.</p>
        
        <div class="bg-blue-50 border-l-4 border-medical-blue p-6 rounded-r-2xl mt-6">
            <h3 class="font-bold text-slate-800 text-lg mb-2">Atención Segura</h3>
            <p class="text-sm text-slate-600">Disponibilidad, orientación y soporte para compras farmacéuticas sin complicaciones, en cada paso de tu pedido.</p>
        </div>
      </div>
      <div class="relative rounded-[2rem] overflow-hidden shadow-2xl h-[500px]">
        <img src="https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=2069&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover" alt="Local Botica Estrella" />
      </div>
    </section>

    <section id="valores" class="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-200 text-center">
      <h2 class="text-3xl font-black text-medical-dark mb-4">Nuestros Valores Pilares</h2>
      <p class="text-slate-500 mb-12 max-w-2xl mx-auto">Los principios que guían nuestro trabajo diario para brindarte el mejor servicio posible.</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-shadow group">
          <div class="w-14 h-14 bg-blue-50 text-medical-blue rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-3">Confianza</h3>
          <p class="text-sm text-slate-500">Tu salud está en las mejores manos. Seguridad garantizada en cada compra.</p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-shadow group">
          <div class="w-14 h-14 bg-blue-50 text-medical-blue rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.091-3.091L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.091-3.091L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.091 3.091L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.091 3.091ZM18.25 7.5 18 8.25l-.25-.75a2.25 2.25 0 0 0-1.5-1.5L15.5 5.75l.75-.25a2.25 2.25 0 0 0 1.5-1.5L18 3.25l.25.75a2.25 2.25 0 0 0 1.5 1.5l.75.25-.75.25a2.25 2.25 0 0 0-1.5 1.5Z" /></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-3">Calidad</h3>
          <p class="text-sm text-slate-500">Solo trabajamos con laboratorios certificados y productos originales.</p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-shadow group">
          <div class="w-14 h-14 bg-blue-50 text-medical-blue rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-3">Empatía</h3>
          <p class="text-sm text-slate-500">Entendemos tus necesidades y te atendemos con calidez humana.</p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-shadow group">
          <div class="w-14 h-14 bg-blue-50 text-medical-blue rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41m5.96 5.96A14.93 14.93 0 0 1 9.63 8.41m0 0A6 6 0 0 0 2.25 14.25h4.8m2.58-5.84a14.93 14.93 0 0 0-2.58 5.84m2.58-5.84 5.96 5.96M4.5 19.5l2.25-2.25" /></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-3">Innovación</h3>
          <p class="text-sm text-slate-500">Mejoramos nuestros procesos para darte la atención más rápida.</p>
        </div>
      </div>
    </section>

    <section>
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="text-medical-blue font-bold tracking-widest uppercase text-sm">Equipo</span>
        <h2 class="text-3xl font-black text-slate-800 mt-2 mb-4">Personas detrás de tu atención</h2>
        <p class="text-slate-500">Un equipo cercano que combina experiencia farmacéutica, soporte al cliente y gestión digital para ayudarte mejor.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
          <div class="h-64 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=900&auto=format&fit=crop" alt="Dra. Valeria Ramos" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div class="p-6 text-center">
            <span class="text-xs font-bold text-medical-blue uppercase tracking-wider block mb-2">Dirección Farmacéutica</span>
            <h3 class="text-xl font-black text-slate-800 mb-2">Dra. Valeria Ramos</h3>
            <p class="text-sm text-slate-500 mb-4">Supervisa la calidad de los productos y la orientación segura al cliente.</p>
          </div>
        </article>

        <article class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
          <div class="h-64 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=900&auto=format&fit=crop" alt="Camila Torres" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div class="p-6 text-center">
            <span class="text-xs font-bold text-medical-blue uppercase tracking-wider block mb-2">Atención al Cliente</span>
            <h3 class="text-xl font-black text-slate-800 mb-2">Camila Torres</h3>
            <p class="text-sm text-slate-500 mb-4">Acompaña pedidos, dudas frecuentes y seguimiento de consultas digitales.</p>
          </div>
        </article>

        <article class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
          <div class="h-64 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=900&auto=format&fit=crop" alt="Marco Salazar" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div class="p-6 text-center">
            <span class="text-xs font-bold text-medical-blue uppercase tracking-wider block mb-2">Operaciones</span>
            <h3 class="text-xl font-black text-slate-800 mb-2">Marco Salazar</h3>
            <p class="text-sm text-slate-500 mb-4">Organiza inventario, despachos y disponibilidad para una compra fluida.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="text-center max-w-5xl mx-auto">
      <h2 class="text-3xl font-black text-slate-800 mb-4">Nuestra Ubicación Principal</h2>
      <p class="text-slate-500 mb-8">Visítanos en nuestra sede central y recibe la mejor atención farmacéutica.</p>
      
      <div class="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white w-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.388072498456!2d-76.884474!3d-12.016782500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c3c608bfd58f%3A0x33621d66d8e789ef!2sBotica%20Estrella!5e0!3m2!1ses-419!2spe!4v1780081784537!5m2!1ses-419!2spe" 
          class="w-full h-[300px] md:h-[450px]" 
          style="border:0;" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </section>

    <section class="bg-gradient-to-r from-medical-blue to-blue-500 rounded-[2rem] p-10 md:p-16 text-center shadow-xl">
      <span class="text-blue-200 font-bold uppercase tracking-widest text-sm block mb-4">Siguiente paso</span>
      <h2 class="text-3xl md:text-4xl font-black text-white mb-6">Encuentra lo que necesitas para cuidar tu bienestar</h2>
      <p class="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">Explora nuestro catálogo o comunícate con nosotros para recibir orientación sobre disponibilidad y compras.</p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link to="/productos" class="bg-white text-medical-blue font-black py-4 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">Ver productos</router-link>
        <router-link to="/carrito" class="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white/10 transition-colors">Ir al carrito</router-link>
      </div>
    </section>

  </main>
</template>