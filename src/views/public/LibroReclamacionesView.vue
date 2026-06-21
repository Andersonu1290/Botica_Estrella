<template>
  <main class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">

    <!-- Hero -->
    <section class="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-medical-blue to-blue-500 p-10 md:p-16 shadow-xl mb-12">
      <div class="relative z-10">
        <span class="text-blue-200 font-bold uppercase tracking-widest text-sm">
          Atención al Cliente
        </span>

        <h1 class="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
          Libro de Reclamaciones
        </h1>

        <p class="text-blue-100 text-lg max-w-3xl">
          Si has tenido algún inconveniente con nuestros productos o servicios,
          puedes registrar aquí tu reclamo o queja. Nuestro equipo revisará tu caso
          y te brindará una respuesta dentro de los plazos establecidos.
        </p>
      </div>
    </section>

    <!-- Formulario -->
    <section class="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-8 md:p-12">

      <div class="mb-10">
        <h2 class="text-3xl font-black text-slate-800 mb-3">
          Registrar Reclamo o Queja
        </h2>

        <p class="text-slate-500">
          Completa los siguientes datos para registrar tu solicitud.
        </p>
      </div>

      <form class="space-y-8">

        <!-- Datos Personales -->
        <div>
          <h3 class="text-xl font-bold text-medical-blue mb-6">
            Datos Personales
          </h3>

          <div class="grid md:grid-cols-2 gap-6">

            <div>
              <label class="block mb-2 font-semibold text-slate-700">
                Nombres
              </label>
              <input
                type="text"
                class="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-medical-blue"
              >
            </div>

            <div>
              <label class="block mb-2 font-semibold text-slate-700">
                Apellidos
              </label>
              <input
                type="text"
                class="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
            </div>

            <div>
              <label class="block mb-2 font-semibold text-slate-700">
                DNI
              </label>
              <input
                type="text"
                class="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
            </div>

            <div>
              <label class="block mb-2 font-semibold text-slate-700">
                Teléfono
              </label>
              <input
                type="text"
                class="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
            </div>

            <div class="md:col-span-2">
              <label class="block mb-2 font-semibold text-slate-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                class="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
            </div>

          </div>
        </div>

        <!-- Tipo -->
        <div>
          <h3 class="text-xl font-bold text-medical-blue mb-6">
            Información del Caso
          </h3>

          <div class="grid md:grid-cols-2 gap-6">

            <div>
              <label class="block mb-2 font-semibold text-slate-700">
                Tipo
              </label>

              <select
                class="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
                <option>Seleccione</option>
                <option>Reclamo</option>
                <option>Queja</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 font-semibold text-slate-700">
                Número de Pedido (Opcional)
              </label>

              <input
                type="text"
                class="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
            </div>

          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block mb-2 font-semibold text-slate-700">
            Descripción del Reclamo o Queja
          </label>

          <textarea
            rows="6"
            class="w-full border border-slate-300 rounded-xl px-4 py-3 resize-none"
            placeholder="Describe detalladamente lo ocurrido..."
          ></textarea>
        </div>

        <!-- Aviso -->
        <div class="bg-blue-50 border-l-4 border-medical-blue p-6 rounded-r-2xl">
          <p class="text-sm text-slate-600">
            La presentación de este formulario no impide acudir a otras vías de
            solución de controversias ni constituye una denuncia ante una autoridad.
          </p>
        </div>

        <!-- Botón -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-medical-blue hover:bg-blue-600 text-white font-black px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            Registrar Solicitud
          </button>
        </div>

      </form>
    </section>

  </main>
</template>

<script setup>
// La lógica se implementará posteriormente
</script>