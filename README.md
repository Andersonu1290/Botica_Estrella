## 📖 Descripción del Proyecto.

**Botica Estrella** es una plataforma web dual que combina una **tienda virtual (e-commerce)** para el cliente final y un **panel administrativo (backoffice)** para la gestión interna de la farmacia. El sistema permite realizar compras en línea, visualizar catálogos, y administrar de manera centralizada el inventario, el Kardex, las mermas, los reportes y las ventas físicas.

Este proyecto ha sido estructurado con una arquitectura modular y escalable, enfocándose en la separación de responsabilidades entre el entorno público y el entorno de administración.

---

## 🚀 Tecnologías Utilizadas

* **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Enrutamiento:** Vue Router
* **Estilos:** Tailwind CSS y CSS personalizado.
* **Gestión de Estado:** Tiendas reactivas modulares (`auth.js`, `carrito.js`, `filtros.js`)
* **Integración API:** Configuración centralizada vía `apiClient.js`

---

## 📂 Estructura del Proyecto

El proyecto está organizado en las siguientes carpetas principales dentro de `src/`:

```text
📦 src
 ┣ 📂 assets          # Estilos globales y Tailwind (tailwind.css)
 ┣ 📂 components      # Componentes reutilizables (públicos y privados)
 ┣ 📂 layouts         # Plantillas base (AdminLayout.vue, PublicLayout.vue)
 ┣ 📂 router          # Definición de rutas de la aplicación
 ┣ 📂 services        # Cliente para peticiones HTTP (apiClient.js)
 ┣ 📂 store           # Estado global (auth, carrito, filtros)
 ┣ 📂 views
 ┃ ┣ 📂 admin         # Vistas del Backoffice (Kardex, Inventario, Reportes, etc.)
 ┃ ┗ 📂 public        # Vistas del E-commerce (Catálogo, Checkout, Perfil, etc.)
 ┣ 📜 App.vue         # Componente raíz
 ┗ 📜 main.js         # Punto de entrada de la aplicación

```

---

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
```bash
git clone <URL_DEL_REPOSITORIO>
cd Botica_Estrella

```


2. **Instalar las dependencias:**
```bash
npm install

```


3. **Configurar variables de entorno:**
Revisa los archivos `.env.development` y `.env.production` en la raíz del proyecto para asegurar que las variables y endpoints de la API backend estén correctamente direccionados.
4. **Levantar el servidor de desarrollo:**
```bash
npm run dev

```


*El servidor se iniciará generalmente en `http://localhost:5173/`.*
5. **Construir para producción:**
```bash
npm run build

```



---

## 🔑 Funcionalidades Principales

### Entorno Público (E-commerce)

* **Catálogo de Productos:** Exploración y filtrado interactivo de medicamentos y productos.
* **Carrito de Compras:** Gestión reactiva del estado del carrito.
* **Checkout:** Flujo de confirmación de venta y detalle de pedido.
* **Autenticación:** Login público y gestión de perfil de usuario.

### Panel de Administración (Backoffice)

* **Punto de Venta (POS):** Módulo ágil para registrar transacciones físicas en mostrador.
* **Gestión de Inventario y Kardex:** Control detallado de entradas, salidas y existencias.
* **Control de Mermas:** Registro de productos defectuosos o vencidos.
* **Reportes:** Historial de ventas y analíticas del negocio.
* **Administración:** Gestión de usuarios y categorías.

---

> Proyecto desarrollado priorizando buenas prácticas, limpieza de código y un correcto control de versionado.
