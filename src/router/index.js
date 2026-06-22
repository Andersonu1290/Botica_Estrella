import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '@/store/auth'
import {
  esSesionAdminValida,
  esSesionClienteValida,
  obtenerAdminSesion
} from '@/utils/auth'

// Layouts
import AdminLayout from '../layouts/AdminLayout.vue'
import PublicLayout from '../layouts/PublicLayout.vue'

// Vistas Públicas (Tienda)
import HomeView from '../views/public/HomeView.vue'
import CatalogoView from '../views/public/CatalogoView.vue'
import DetalleView from '../views/public/DetalleView.vue'
import CarritoView from '../views/public/CarritoView.vue'
import PerfilView from '../views/public/PerfilView.vue'
import NosotrosView from '../views/public/NosotrosView.vue'
import CheckoutView from '../views/public/CheckoutView.vue'
import ConfirmacionView from '../views/public/ConfirmacionView.vue'
import LoginPublicoView from '@/views/public/LoginPublicoView.vue'
import LibroReclamacionesView from '../views/public/LibroReclamacionesView.vue' 
import SeguimientoView from '../views/public/SeguimientoView.vue'
import Politicas_Privacidad_View from '@/views/public/Politicas_Privacidad_View.vue'
import TerminosCondicionesView from '../views/public/TerminosCondicionesView.vue'

// Vistas del Admin
import Login from '../views/admin/Login.vue'
import Inventario from '../views/admin/Inventario.vue'
import Venta from '../views/admin/Venta.vue'
import Categorias from '../views/admin/Categorias.vue'
import ConfirmacionVenta from '../views/admin/ConfirmacionVenta.vue'
import HistorialVentas from '../views/admin/HistorialVentas.vue'
import Kardex from '../views/admin/Kardex.vue'
import Mermas from '../views/admin/Mermas.vue'
import ProductoForm from '../views/admin/ProductoForm.vue'
import Reportes from '../views/admin/Reportes.vue'
import Usuarios from '../views/admin/Usuarios.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ================= RUTAS PÚBLICAS (CLIENTES) =================
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'productos', name: 'catalogo', component: CatalogoView },
        { path: 'producto/:id', name: 'detalleProducto', component: DetalleView },
        { path: 'carrito', name: 'carrito', component: CarritoView },
        { path: 'perfil', name: 'perfil', component: PerfilView, meta: { requiresClientAuth: true } },
        { path: 'nosotros', name: 'nosotros', component: NosotrosView },
        { path: 'checkout', name: 'checkout', component: CheckoutView, meta: { requiresClientAuth: true } },
        { path: 'login', name: 'loginPublico', component: LoginPublicoView },
        { path: 'confirmacion', name: 'confirmacion', component: ConfirmacionView },
        { path: 'libro-reclamaciones', name: 'libroReclamaciones', component: LibroReclamacionesView },
        { path: 'politicas-privacidad', name: 'politicasPrivcadidad', component: Politicas_Privacidad_View},
        { path: 'seguimiento', name: 'seguimiento', component: SeguimientoView },
        { path: 'terminos-condiciones', name: 'terminosCondiciones', component: TerminosCondicionesView }
      ]
    },

    // ================= RUTAS DEL ADMINISTRADOR =================
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'adminLogin', component: Login, alias: 'login', meta: { public: true } },
        { path: 'inventario', name: 'inventario', component: Inventario, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'venta', name: 'venta', component: Venta, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'categorias', name: 'categorias', component: Categorias, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'confirmacion-venta', name: 'confirmacionVenta', component: ConfirmacionVenta, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'historial-ventas', name: 'historialVentas', component: HistorialVentas, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'kardex', name: 'kardex', component: Kardex, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'mermas', name: 'mermas', component: Mermas, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'producto-form', name: 'productoForm', component: ProductoForm, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'reportes', name: 'reportes', component: Reportes, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } },
        { path: 'usuarios', name: 'usuarios', component: Usuarios, meta: { requiresAdminAuth: true, roles: ['ADMIN', 'ALMACEN'] } }
      ]
    }
  ],
})

router.beforeEach((to) => {
  const requiereAdmin = to.matched.some((record) => record.meta.requiresAdminAuth);
  const requiereCliente = to.matched.some((record) => record.meta.requiresClientAuth);
  const esAdminSesionValida = esSesionAdminValida();
  const esClienteSesionValida = esSesionClienteValida();

  if (requiereAdmin) {
    const rolesPermitidos = to.matched
      .flatMap((record) => record.meta.roles || [])
      .filter(Boolean);

    const rolActual = String(obtenerAdminSesion()?.rol || '').toUpperCase();
    const rolPermitido = rolesPermitidos.length === 0 || rolesPermitidos.includes(rolActual);

    if (!esAdminSesionValida || !rolPermitido) {
      return {
        path: '/admin/login',
        query: to.fullPath !== '/admin/login' ? { redirect: to.fullPath } : undefined
      };
    }
  }

  if (requiereCliente && !esClienteSesionValida) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    };
  }

  if (to.path === '/login' && esClienteSesionValida && String(authStore.usuarioActual?.rol || '').toUpperCase() === 'CLIENTE') {
    return { path: '/' };
  }

  if ((to.path === '/admin' || to.path === '/admin/login') && esAdminSesionValida) {
    return { path: '/admin/inventario' };
  }
})

export default router
