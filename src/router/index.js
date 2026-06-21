import { createRouter, createWebHistory } from 'vue-router'

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
        { path: 'perfil', name: 'perfil', component: PerfilView },
        { path: 'nosotros', name: 'nosotros', component: NosotrosView },
        { path: 'checkout', name: 'checkout', component: CheckoutView },
        { path: 'login', name: 'loginPublico', component: LoginPublicoView },
        { path: 'confirmacion', name: 'confirmacion', component: ConfirmacionView },
        { path: 'libro-reclamaciones', name: 'libroReclamaciones', component: LibroReclamacionesView },
        { path: 'seguimiento', name: 'seguimiento', component: SeguimientoView }
      ]
    },

    // ================= RUTAS DEL ADMINISTRADOR =================
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'login', component: Login, alias: 'login' },
        { path: 'inventario', name: 'inventario', component: Inventario },
        { path: 'venta', name: 'venta', component: Venta },
        { path: 'categorias', name: 'categorias', component: Categorias },
        { path: 'confirmacion-venta', name: 'confirmacionVenta', component: ConfirmacionVenta },
        { path: 'historial-ventas', name: 'historialVentas', component: HistorialVentas },
        { path: 'kardex', name: 'kardex', component: Kardex },
        { path: 'mermas', name: 'mermas', component: Mermas },
        { path: 'producto-form', name: 'productoForm', component: ProductoForm },
        { path: 'reportes', name: 'reportes', component: Reportes },
        { path: 'usuarios', name: 'usuarios', component: Usuarios }
      ]
    }
  ],
})

export default router