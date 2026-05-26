/**
 * LÓGICA DE FILTRADO AVANZADO - BOTICA ESTRELLA 2026
 * Powered by Wansd System
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Capturar todos los elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const categoriaSelect = document.getElementById('categoriaSelect');
    const priceRange = document.getElementById('priceRange');
    const priceLabel = document.getElementById('priceLabel');
    const checkboxesFormato = document.querySelectorAll('.filtro-formato');
    const botonesMarca = document.querySelectorAll('.filtro-marca');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const noResults = document.getElementById('noResults');
    const resultadosTexto = document.getElementById('resultadosTexto');
    const cards = document.querySelectorAll('.catalog-card');

    // 2. Estado de los filtros múltiples
    let filtrosActivos = {
        busqueda: '',
        categoria: 'todos',
        precioMax: 100, // Empieza en 100 (El tope del slider)
        formatos: [],   // Arreglo para guardar si marcaron 'jarabe', 'tableta'
        marcas: []      // Arreglo para guardar marcas seleccionadas
    };

    // 3. Función maestra que evalúa cada tarjeta
    function aplicarFiltrosMultiples() {
        let visibles = 0;

        cards.forEach(card => {
            // Extraer la "Base de Datos" desde el HTML (data-attributes)
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const category = card.getAttribute('data-categoria');
            const price = parseFloat(card.getAttribute('data-precio'));
            const formato = card.getAttribute('data-formato');
            const marca = card.getAttribute('data-marca');

            // Comprobar cada filtro paso a paso
            const pasaBusqueda = title.includes(filtrosActivos.busqueda);
            const pasaCategoria = (filtrosActivos.categoria === 'todos' || category === filtrosActivos.categoria);
            const pasaPrecio = (price <= filtrosActivos.precioMax);
            const pasaFormato = (filtrosActivos.formatos.length === 0 || filtrosActivos.formatos.includes(formato));
            const pasaMarca = (filtrosActivos.marcas.length === 0 || filtrosActivos.marcas.includes(marca));

            // Si la tarjeta pasa TODOS los filtros, se muestra
            if (pasaBusqueda && pasaCategoria && pasaPrecio && pasaFormato && pasaMarca) {
                card.style.display = 'flex';
                visibles++;
            } else {
                card.style.display = 'none';
            }
        });

        // 4. Lógica de UI (Mensajes)
        noResults.style.display = visibles === 0 ? 'flex' : 'none';
        
        if (filtrosActivos.busqueda !== '') {
            resultadosTexto.innerHTML = `Mostrando <strong>${visibles}</strong> resultados para: <span class="text-medical-blue">"${filtrosActivos.busqueda}"</span>`;
        } else {
            resultadosTexto.innerHTML = `Mostrando <strong>${visibles}</strong> productos en el catálogo`;
        }
    }

    // ============================================
    // LISTENERS (Escuchar las acciones del usuario)
    // ============================================

    // Buscar escribiendo
    searchInput.addEventListener('input', (e) => {
        filtrosActivos.busqueda = e.target.value.toLowerCase().trim();
        aplicarFiltrosMultiples();
    });

    // Cambiar Categoría
    categoriaSelect.addEventListener('change', (e) => {
        filtrosActivos.categoria = e.target.value;
        aplicarFiltrosMultiples();
    });

    // Mover barra de precio
    priceRange.addEventListener('input', (e) => {
        filtrosActivos.precioMax = parseFloat(e.target.value);
        priceLabel.textContent = `S/. ${filtrosActivos.precioMax.toFixed(2)}`;
        aplicarFiltrosMultiples();
    });

    // Checkboxes de Formatos
    checkboxesFormato.forEach(check => {
        check.addEventListener('change', () => {
            // Rehacer el array de formatos seleccionados
            filtrosActivos.formatos = Array.from(checkboxesFormato)
                                           .filter(c => c.checked)
                                           .map(c => c.value);
            aplicarFiltrosMultiples();
        });
    });

    // Botones de Marca (Actúan como toggles)
    botonesMarca.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const marcaSeleccionada = e.target.getAttribute('data-marca');
            
            // Cambiar estilos del botón (Activo/Inactivo)
            e.target.classList.toggle('bg-medical-blue');
            e.target.classList.toggle('text-white');
            e.target.classList.toggle('bg-slate-100');
            e.target.classList.toggle('text-slate-600');

            // Agregar o quitar de la lista
            if (filtrosActivos.marcas.includes(marcaSeleccionada)) {
                filtrosActivos.marcas = filtrosActivos.marcas.filter(m => m !== marcaSeleccionada);
            } else {
                filtrosActivos.marcas.push(marcaSeleccionada);
            }
            aplicarFiltrosMultiples();
        });
    });

    // Botón de Limpiar Todo
    btnLimpiar.addEventListener('click', () => {
        // Reset UI
        searchInput.value = '';
        categoriaSelect.value = 'todos';
        priceRange.value = 100;
        priceLabel.textContent = 'S/. 100.00';
        
        checkboxesFormato.forEach(c => c.checked = false);
        
        botonesMarca.forEach(btn => {
            btn.classList.remove('bg-medical-blue', 'text-white');
            btn.classList.add('bg-slate-100', 'text-slate-600');
        });

        // Reset Estado Interno
        filtrosActivos = {
            busqueda: '',
            categoria: 'todos',
            precioMax: 100,
            formatos: [],
            marcas: []
        };

        aplicarFiltrosMultiples();
    });
});