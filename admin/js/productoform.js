document.addEventListener("DOMContentLoaded", async function() {
    // FASE 2: Protección de ruta básica (Verificar autenticación)
    if (!sessionStorage.getItem('usuarioActivo')) {
        window.location.href = 'Login';
        return;
    }

    const frmProducto = document.getElementById("frmProducto");
    const txtId = document.getElementById("txtId");
    const formTitulo = document.getElementById("formTitulo");
    const btnGuardar = document.getElementById("btnGuardar");

    // 1. Detectar si estamos en modo EDICIÓN leyendo los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idProductoEdicion = urlParams.get('id');
    const esEdicion = idProductoEdicion !== null;

    // 2. FASE 4: Carga asíncrona de Categorías en el Combobox
    await cargarCategoriasForm();

    // 3. Si es edición, mutar el formulario y precargar los datos del Producto
    if (esEdicion) {
        formTitulo.textContent = "Modificar Producto";
        btnGuardar.textContent = "Actualizar Datos de Producto";
        txtId.value = idProductoEdicion;
        await precargarDatosProducto(idProductoEdicion);
    }

    // 4. Interceptar el envío del formulario (FASE 3 y 5)
    if (frmProducto) {
        frmProducto.addEventListener("submit", async function(e) {
            e.preventDefault(); // Detiene la recarga tradicional de la página

            // Deshabilitar botón para evitar clics repetidos durante la subida
            btnGuardar.disabled = true;
            const textoOriginal = btnGuardar.textContent;
            btnGuardar.textContent = "Procesando transferencia binaria...";

            // FASE 5: Estrategia FormData nativa para agrupar textos y archivos binarios
            const formData = new FormData();
            
            // Recolectamos los campos con los nombres exactos que espera el Multipart de Spring Boot
            formData.append("codigoSKU", document.getElementById("txtSku").value.trim());
            formData.append("nombre", document.getElementById("txtNombre").value.trim());
            formData.append("idCategoria", document.getElementById("cboCategoria").value);
            formData.append("stockActual", document.getElementById("txtStock").value);
            formData.append("stockMinimo", document.getElementById("txtMinimo").value);
            formData.append("precio", document.getElementById("txtPrecio").value);

            const inputImagen = document.getElementById("txtImagen");
            if (inputImagen && inputImagen.files.length > 0) {
                formData.append("imagen", inputImagen.files[0]); // Archivo binario real
            }

            try {
                // En edición enviamos también el ID
                if (esEdicion) {
                    formData.append("idProducto", idProductoEdicion);
                }

                // Siempre usamos POST porque el backend ya maneja crear/editar
                await API.postMultipart('/productos', formData);

                mostrarNotificacion(
                    esEdicion
                        ? "¡Producto actualizado correctamente!"
                        : "¡Nuevo Producto registrado en almacén!",
                    "success"
                );

                // Redirección inmediata tras el éxito a la grilla principal
                setTimeout(() => {
                    window.location.href = "Inventario";
                }, 1500);

            } catch (error) {
                console.error("Error al guardar el producto:", error);
                mostrarNotificacion("Falla en el registro: " + error.message, "error");
                
                // Restaurar botón si ocurre un error de red o validación
                btnGuardar.disabled = false;
                btnGuardar.textContent = textoOriginal;
            }
        });
    }
});

/**
 * FASE 4: Consume las familias desde la API e inyecta las opciones en el SELECT
 */
async function cargarCategoriasForm() {
    const cboCategoria = document.getElementById("cboCategoria");
    if (!cboCategoria) return;

    try {
        const categorias = await API.get('/categorias'); // Ajusta a tu endpoint real de Spring Boot
        
        cboCategoria.innerHTML = '<option value="" disabled selected>-- Seleccione una Familia --</option>';
        categorias.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.idCategoria;
            opt.textContent = cat.nombre;
            cboCategoria.appendChild(opt);
        });
    } catch (error) {
        console.error("Error al cargar combo de categorías:", error);
        cboCategoria.innerHTML = '<option value="" disabled selected>-- Error al cargar familias --</option>';
    }
}

/**
 * Precarga los inputs del formulario con la información actual del producto
 */
async function precargarDatosProducto(id) {
    try {
        const p = await API.get(`/productos/${id}`); // Trae el DTO del producto por su ID

        // Mapeamos los datos recibidos a los cuadros de texto estáticos
        document.getElementById("txtSku").value = p.codigoSKU || p.sku || "";
        document.getElementById("txtNombre").value = p.nombre || "";
        document.getElementById("cboCategoria").value = p.idCategoria || "";
        document.getElementById("txtStock").value = p.stockActual ?? 0;
        document.getElementById("txtMinimo").value = p.stockMinimo ?? 5;
        document.getElementById("txtPrecio").value = p.precio || "";

        // Renderizar la vista previa de la imagen si el backend provee la cadena Base64
        if (p.base64Imagen) {
            const previewContainer = document.getElementById("previewContainer");
            const imgPreview = document.getElementById("imgProductoPreview");
            
            if (previewContainer && imgPreview) {
                imgPreview.src = `data:image/jpeg;base64,${p.base64Imagen}`;
                previewContainer.style.display = "flex"; // Se vuelve visible de forma reactiva
            }
        }
    } catch (error) {
        console.error("Error al precargar la ficha del producto:", error);
        mostrarNotificacion("No se pudo obtener la información del producto.", "error");
    }
}
