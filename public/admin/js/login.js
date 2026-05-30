document.addEventListener("DOMContentLoaded", function() {
    const frmLogin = document.getElementById("frmLogin");
    
    if (frmLogin) {
        // Función asíncrona para manejar la comunicación con el backend sin recargar la página
        frmLogin.addEventListener("submit", async function(e) {
            // FASE 1 y 3: Evita que el navegador busque el antiguo Servlet
            e.preventDefault(); 

            const btn = document.getElementById("btnIngresar");
            const icon = document.getElementById("btnIcon");
            const text = document.getElementById("btnText");
            const msgError = document.getElementById("msgError");

            // Ocultar cualquier mensaje de error previo
            if(msgError) msgError.style.display = 'none';

            // Guardar estados visuales originales para restaurarlos si la autenticación falla
            const originalBg = btn.style.backgroundColor;
            const originalText = text.innerHTML;
            const originalIcon = icon.innerHTML;

            // 1. Efecto Visual de Carga (Bloqueo de seguridad para evitar doble clic)
            btn.disabled = true; 
            btn.style.backgroundColor = "#475569";
            btn.style.cursor = "not-allowed";
            text.innerHTML = "Autenticando...";
            icon.innerHTML = '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>';
            icon.style.animation = "spin 1s linear infinite";

            // 2. Lectura y limpieza de credenciales en las cajas de texto HTML
            const usuario = document.getElementById("txtUsuario").value.trim();
            const clave = document.getElementById("txtClave").value;

            try {
                // FASE 3: Llamada a la API acoplada a las variables de tu Spring Boot (username / password)
                const respuesta = await API.post('/auth/login', { 
                    username: usuario, 
                    password: clave 
                });

                // FASE 2: Gestión de Estado local (Guardamos el JSON con ID, Nombre y Rol del Jefe de Almacén)
                sessionStorage.setItem('usuarioActivo', JSON.stringify(respuesta));
                
                // Si tu Spring Boot ya genera Token JWT, guardamos la credencial de red:
                if (respuesta.token) {
                    sessionStorage.setItem('jwt_token', respuesta.token);
                }

                // Redirección directa a la vista estática del panel de control
                window.location.href = "Inventario";

            } catch (error) {
                // 3. Manejo de Errores: Captura credenciales incorrectas o caídas del servidor
                console.error("Error en el proceso de login:", error);
                
                if (msgError) {
                    // Inyecta el mensaje de negocio enviado desde Spring Boot
                    msgError.textContent = error.message; 
                    msgError.style.display = 'block';
                }

                // Restaurar el botón a su estado original interactivo para un nuevo intento
                btn.disabled = false;
                btn.style.backgroundColor = originalBg;
                btn.style.cursor = "pointer";
                text.innerHTML = originalText;
                icon.innerHTML = originalIcon;
                icon.style.animation = "none";
            }
        });
    }
});
