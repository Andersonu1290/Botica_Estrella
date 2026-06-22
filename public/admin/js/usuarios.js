document.addEventListener("DOMContentLoaded", async function() {
    // FASE 2: Protección de Ruta básica (Verificar autenticación)
    const usuarioSesion = sessionStorage.getItem('usuarioActivo');
    if (!usuarioSesion) {
        window.location.href = '/admin/login';
        return;
    }

    const usuarioActivo = JSON.parse(usuarioSesion);
    // Verificar si cuenta con privilegios administrativos de Jefe de Almacén
    const esAdmin = ['ADMIN', 'ALMACEN', 'JEFE_ALMACEN'].includes(String(usuarioActivo.rol || '').toUpperCase());

    const frmUsuario = document.getElementById("frmUsuario");
    const panelAccesoDenegado = document.getElementById("panelAccesoDenegado");

    // FASE 2: Seguridad Visual y Reactiva en el Cliente según el Rol
    if (esAdmin) {
        if (frmUsuario) frmUsuario.style.display = "block";
        if (panelAccesoDenegado) panelAccesoDenegado.style.display = "none";
    } else {
        if (frmUsuario) frmUsuario.style.display = "none";
        if (panelAccesoDenegado) panelAccesoDenegado.style.display = "block";
    }

    // Cargar la lista completa de personal autorizado desde el nuevo backend
    await cargarListaUsuarios();

    // Inicializar el filtro de búsqueda local en tiempo real para las cuentas (CSR)
    if (document.getElementById('buscadorUsuarios')) {
        inicializarBuscador('buscadorUsuarios', 'tablaUsuarios');
    }

    // Interceptar el envío del formulario para agregar personal (Solo si es Admin)
    if (frmUsuario && esAdmin) {
        frmUsuario.addEventListener("submit", async function(e) {
            e.preventDefault(); // FASE 3: Detiene la recarga tradicional de la página

            const txtUsername = document.getElementById("txtUsername").value.trim();
            const txtPassword = document.getElementById("txtPassword").value;
            const cboRol = document.getElementById("cboRol").value;
            const msgError = document.getElementById("msgError");

            if (msgError) msgError.style.display = 'none';

            // Estructura de payload limpia que engrana con tu Usuario DTO en Spring Boot
            const payload = {
                username: txtUsername,
                password: txtPassword,
                rol: cboRol
            };

            try {
                // Ajusta el endpoint '/usuarios' según la ruta de tu controlador de Spring Boot
                await API.post('/usuarios/registrar', payload);
                
                mostrarNotificacion("¡Credenciales del nuevo operario guardadas con éxito!", "success");
                
                // Limpiar cajas de texto tras el guardado exitoso
                frmUsuario.reset();
                
                // FASE 4: Recargar la tabla dinámicamente sin parpadeos ni recargas totales
                await cargarListaUsuarios();

            } catch (error) {
                console.error("Error al registrar usuario:", error);
                if (msgError) {
                    const txtErrorSpan = document.getElementById("txtErrorSpan");
                    if (txtErrorSpan) txtErrorSpan.textContent = error.message;
                    msgError.style.display = 'block';
                } else {
                    mostrarNotificacion("Falla en el registro: " + error.message, "error");
                }
            }
        });
    }
});

/**
 * FASE 4: Recupera el listado de personal e inyecta las filas en el <tbody> vacío
 */
async function cargarListaUsuarios() {
    const tbody = document.getElementById("tbodyUsuarios");
    if (!tbody) return;

    try {
        // Consumir el endpoint REST de personal
        const usuarios = await API.get('/usuarios');

        tbody.innerHTML = ""; // Limpiar mensaje de carga provisional

        if (!usuarios || usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center p-30 text-muted">No hay registros disponibles.</td></tr>';
            return;
        }

        // Iteración asíncrona sobre el arreglo JSON devuelto por Spring Boot
        usuarios.forEach(u => {
            // FASE 4: Asignar dinámicamente la clase CSS de la insignia según el nivel de seguridad
            const badgeClase = ['ADMIN', 'ALMACEN', 'JEFE_ALMACEN'].includes(String(u.rol || '').toUpperCase())
                ? "badge-role-admin"
                : "badge-role-user";

            // Rellenar ceros a la izquierda para mantener la estética corporativa original (ej: USR-005)
            const idFormateado = String(u.idUsuario || u.id).padStart(3, '0');

            tbody.innerHTML += `
                <tr>
                    <td class="td-id">USR-${idFormateado}</td>
                    <td class="font-bold text-white">${u.username}</td>
                    <td class="text-center">
                        <span class="badge ${badgeClase}">
                            ${u.rol}
                        </span>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al renderizar el personal autorizado:", error);
        tbody.innerHTML = `<tr><td colspan="3" class="text-center p-30 text-danger">No se pudo cargar la lista: ${error.message}</td></tr>`;
    }
}
