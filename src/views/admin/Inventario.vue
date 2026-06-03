<template>
  <div class="dashboard-container">
        
        <div class="header-tech">
            <div class="header-title">
                <img src="../../../public/admin/img/logo_boticaestrella.png" alt="boticaestrella" class="logo-img" onerror="this.src='https://via.placeholder.com/150x45/111827/E63946?text=boticaestrella'">
                <h2 class="text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" class="text-blue">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    Stock y Componentes
                </h2>
            </div>
            
            <div class="nav-links">
                <div class="user-badge" id="infoOperador">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Operador: <strong id="lblNombreUsuario">Cargando...</strong> (<span id="lblRolUsuario">-</span>)
                </div>
                
                <a href="/admin/producto-form" class="btn-tech btn-success-tech">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Añadir Producto
                </a>
                
                <button onclick="cargarInventario()" class="btn-tech" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    Sincronizar
                </button>
                
                <button onclick="cerrarSesion()" class="btn-tech btn-danger-tech" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Desconectar
                </button>
            </div>
        </div>

        <div class="main-nav">
            <a href="/admin/inventario" class="nav-btn nav-active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Inventario General
            </a>
            <a href="/admin/venta" class="nav-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Punto de Venta / Salida
            </a>
            <a href="/admin/mermas" class="nav-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Gestión de Mermas
            </a>
            <a href="/admin/kardex" class="nav-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Auditar Kardex
            </a>
            <a href="/admin/usuarios" class="nav-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Usuarios
            </a>
            <a href="/admin/reportes" class="nav-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Reportes Gerenciales
            </a>
        </div>

        <div class="kpi-container">
            <div class="kpi-card">
                <div class="kpi-icon-wrapper kpi-icon-blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div>
                    <p class="kpi-title">Volumen Físico</p>
                    <h3 class="kpi-value text-white"><span id="kpiTotalStock">0</span> <span class="kpi-unit">Unidades</span></h3>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-wrapper kpi-icon-red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div>
                    <p class="kpi-title">Estado Crítico</p>
                    <h3 class="kpi-value text-danger"><span id="kpiAlertas">0</span> <span class="kpi-unit">SKUs en Riesgo</span></h3>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-wrapper kpi-icon-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div>
                    <p class="kpi-title">Valorización (Activos)</p>
                    <h3 class="kpi-value text-success" id="kpiValorizacion">S/ 0.00</h3>
                </div>
            </div>
        </div>

        <div class="search-box-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="buscadorInventario" placeholder="Buscar por SKU, Especificación o Estado..." class="input-tech">
        </div>

        <div class="table-panel" style="max-height: none;">
            <table class="tech-table" id="tablaInventario">
                <thead>
                    <tr>
                        <th width="60">ID</th>
                        <th width="15%">CÓDIGO SKU</th>
                        <th class="text-center" width="120">FOTO</th>
                        <th width="30%">ESPECIFICACIÓN DE COMPONENTE</th>
                        <th class="text-center">STOCK ACTUAL</th>
                        <th class="text-center">UMBRAL MÍN.</th>
                        <th>PRECIO UNIT.</th>
                        <th>ESTADO</th>
                        <th class="text-center">ACCIONES</th>
                    </tr>
                </thead>
                <tbody id="tbodyInventario">
                    </tbody>
            </table>
        </div>
                
    </div>
</template>

<script>
export default {
  name: 'InventarioView',
  mounted() {

    console.log("INVENTARIO MOUNTED");
    // 1. Inyectamos la variable de entorno en memoria global para api.js
    window.VITE_API_URL = import.meta.env.VITE_API_URL;

    // 2. Carga secuencial y segura de scripts sin duplicados
    this.cargarScript('/admin/js/api.js')
      .then(() => this.cargarScript('/admin/js/utils.js'))
      .then(() => this.cargarScript('/admin/js/inventario.js'))
      .then(() => {
        // 3. Lanzamos el chispazo para inicializar la lógica nativa de tus scripts
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
      })
      .catch(err => console.error("Error al inyectar la capa lógica:", err));
  },
  methods: {
    cargarScript(ruta) {
      return new Promise((resolve, reject) => {
        const scriptExistente = document.querySelector(`script[src="${ruta}"]`);
        if (scriptExistente) { resolve(); return; }

        const script = document.createElement('script');
        script.src = ruta;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  }
}
</script>

<style scoped>
/* Espacio reservado para estilos específicos del componente si fuera necesario */
</style>