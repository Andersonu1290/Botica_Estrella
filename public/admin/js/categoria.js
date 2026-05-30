document.addEventListener("DOMContentLoaded", async () => {
    // 1. Vincular el formulario de registro
    const frmCategoria = document.getElementById('frmCategoria');
    if (frmCategoria) {
        frmCategoria.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarCategoria();
        });
    }

    // 2. Vincular el buscador
    const buscador = document.getElementById('buscadorCat');
    if (buscador) {
        buscador.addEventListener('keyup', filtrarCategorias);
    }

    // 3. Carga inicial
    await cargarCategorias();
});

async function cargarCategorias() {
    const tbody = document.getElementById("tbodyCategorias");
    if (!tbody) return;

    try {
        const categorias = await API.get('/categorias');

        if (!categorias || categorias.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center p-30 text-muted">No hay categorías registradas.</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        categorias.forEach(cat => {
            tbody.innerHTML += `
                <tr>
                    <td>#${String(cat.idCategoria).padStart(3, '0')}</td>
                    <td>${cat.nombre}</td>
                    <td class="text-center">
                        <button onclick="eliminarCategoria(${cat.idCategoria}, '${cat.nombre}')" class="btn-action btn-delete">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

async function guardarCategoria() {
    const txtNombre = document.getElementById('txtNombreCat');
    const nombre = txtNombre.value.trim();

    if (!nombre) return;

    try {
        // Asegúrate de enviar un objeto que coincida con el modelo Java { "nombre": "..." }
        const data = { nombre: nombre };
        
        await API.post('/categorias', data);
        
        txtNombre.value = ""; 
        mostrarNotificacion("Categoría registrada correctamente", "success");
        await cargarCategorias();
    } catch (error) {
        console.error("Error al guardar:", error);
        mostrarNotificacion("Error al guardar la categoría. Revisa la consola.", "error");
    }
}

async function eliminarCategoria(id, nombre) {
    if (!confirm(`¿Está seguro de eliminar la categoría: ${nombre}?`)) return;

    try {
        await API.delete(`/categorias/${id}`);
        mostrarNotificacion("Categoría eliminada", "success");
        await cargarCategorias();
    } catch (error) {
        mostrarNotificacion(error.message || "Error al eliminar", "error");
    }
}

function filtrarCategorias() {
    const filtro = document.getElementById('buscadorCat').value.toLowerCase();
    const filas = document.querySelectorAll('#tbodyCategorias tr');
    
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        fila.style.display = texto.includes(filtro) ? '' : 'none';
    });
}