# 🌟 Botica Estrella - E-commerce Farmacéutico

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

Botica Estrella es una plataforma web desarrollada como proyecto final para el curso de **Herramientas de Desarrollo** de la **Universidad Tecnológica del Perú (UTP)**. El proyecto simula una tienda virtual de productos farmacéuticos, destacando por su diseño responsivo, modularidad en el código y una experiencia de usuario (UX/UI) fluida y moderna.

## 🚀 Funcionalidades Principales

El proyecto ha sido construido íntegramente con tecnologías Frontend (Vanilla JS), implementando lógica avanzada sin depender de un Backend:

* **Catálogo Dinámico:** Los productos se cargan y renderizan dinámicamente desde un módulo centralizado (`productos.js`).
* **Buscador y Filtros en Tiempo Real:** Filtrado interactivo por texto y categorías (Medicamentos, Cuidado Personal, Primeros Auxilios).
* **Carrito de Compras Persistente:** Uso de la API `localStorage` para mantener los productos seleccionados y calcular subtotales/totales incluso si el usuario recarga la página.
* **Generador de Detalles (Plantilla Única):** La página `detalle.html` utiliza parámetros de URL (`window.location.search`) para inyectar la información del producto correspondiente, evitando la duplicación de código HTML.
* **Asistente Virtual (IA):** Integración de un chatbot interactivo desarrollado con **n8n** para atención automatizada al cliente.
* **Seguimiento de Pedidos:** Modal interactivo tipo *Timeline* que simula el estado logístico de una compra.

## 🏗️ Arquitectura del Proyecto

Para mantener el código limpio y escalable, se aplicó el principio de "Separación de Preocupaciones" (Separation of Concerns):

```text
📦 Botica_Estrella
 ┣ 📂 img/                # Recursos gráficos optimizados (.webp, .png, .avif)
 ┣ 📂 logo/               # Favicon corporativo (.ico)
 ┣ 📜 index.html          # Landing page y promociones destacadas
 ┣ 📜 productos.html      # Catálogo interactivo
 ┣ 📜 carrito.html        # Gestión de compras y tracking
 ┣ 📜 detalle.html        # Plantilla dinámica para visualizar items
 ┣ 📜 nosotros.html       # Historia corporativa y Google Maps integrado
 ┣ 📜 perfil.html         # Simulación de dashboard de usuario
 ┣ 📜 styles.css          # Hoja de estilos centralizada (CSS3 Variables, Flexbox, Grid)
 ┣ 📜 script.js           # Lógica global (Modales, Navbar, Carrito)
 ┗ 📜 productos.js        # Base de datos JSON exportable y auto-ejecutable
