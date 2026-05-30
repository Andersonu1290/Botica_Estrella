const techPalette = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'
];

document.addEventListener("DOMContentLoaded", async function() {
    // 1. Verificación de seguridad
    if (!sessionStorage.getItem('usuarioActivo')) {
        window.location.href = 'Login';
        return;
    }

    // 2. Disparar la carga total del Dashboard
    await cargarDatosDashboard();
});

async function cargarDatosDashboard() {
    try {
        // En el backend (ReporteController), todo está unificado en una sola petición a este endpoint:
        const dashboardInfo = await API.get('/reportes/dashboard');

        // --- A. ACTUALIZAR KPIs NUMÉRICOS ---
        document.getElementById('kpiIngresos').textContent = formatMoneda(dashboardInfo.ingresosTotales);
        document.getElementById('kpiTotalStock').textContent = dashboardInfo.kpis.totalStock;
        document.getElementById('kpiTotalVentas').textContent = dashboardInfo.kpis.totalVentas;
        document.getElementById('kpiTotalMermas').textContent = dashboardInfo.kpis.totalMermas;
        document.getElementById('kpiStockCritico').textContent = dashboardInfo.kpis.stockCritico;

        // --- B. RENDERIZAR TABLA DE AUDITORÍA EN VIVO ---
        renderizarTablaVentas(dashboardInfo.ultimasVentas);

        // --- C. PROCESAR DATOS Y RENDERIZAR GRÁFICOS ---
        // CORRECCIÓN: Usar los nombres exactos definidos en ReporteDashboardDTO.java
        const topProd = dashboardInfo.topProd || []; 
        const catStock = dashboardInfo.catStock || []; 
            
        const topLabels = topProd.map(str => str.split(' (Vendidos:')[0]);
        const topData = topProd.map(str => parseInt(str.match(/\d+/)?.[0] || 0));
            
        const catLabels = catStock.map(str => str.split(':')[0]);
        const catData = catStock.map(str => parseInt(str.split(':')[1] || 0));
            
        inicializarGraficos(topLabels, topData, catLabels, catData);

    } catch (error) {
        console.error("Error al cargar las métricas del dashboard:", error);
        mostrarNotificacion("Error al obtener los datos del Dashboard.", "error");
    }
}

function renderizarTablaVentas(ventas) {
    const tbody = document.getElementById('tbodyAuditoriaVentas');
    if (!tbody) return;

    if (!ventas || ventas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center p-30 text-muted">
                    No hay transacciones recientes para mostrar en la auditoría.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = "";
    
    // Solo tomamos las primeras 5 ventas para la vista rápida
    const ultimas = ventas.slice(0, 5);

    ultimas.forEach(v => {
        const anulada = v.estado === 'ANULADA';
        const rowClass = anulada ? "row-disabled" : "";
        const badge = anulada 
            ? '<span class="badge badge-alert">ANULADA</span>' 
            : '<span class="badge badge-optimal">COMPLETADA</span>';

        tbody.innerHTML += `
            <tr class="${rowClass}">
                <td class="text-muted text-xs">${formatFecha(v.fecha)}</td>
                <td class="font-mono text-sm">${v.nroComprobante}</td>
                <td class="td-nombre">${v.nombreCliente}</td>
                <td class="text-sm">${v.nombreProducto}</td>
                <td class="font-mono text-success font-bold">${formatMoneda(v.total)}</td>
                <td class="text-center">${badge}</td>
            </tr>
        `;
    });
}

function inicializarGraficos(topLabels, topData, catLabels, catData) {
    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Destruir gráficos anteriores si existen (útil si hay un botón de refresh)
    if (window.miBarChart) window.miBarChart.destroy();
    if (window.miDoughnutChart) window.miDoughnutChart.destroy();

    // --- GRÁFICO DE BARRAS ---
    const ctxBar = document.getElementById('barChart');
    if (ctxBar) {
        window.miBarChart = new Chart(ctxBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: topLabels,
                datasets: [{
                    label: 'Unidades Vendidas',
                    data: topData,
                    backgroundColor: techPalette,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#374151' }, ticks: { stepSize: 1 } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- GRÁFICO DE DONA ---
    const ctxDoughnut = document.getElementById('doughnutChart');
    if (ctxDoughnut) {
        window.miDoughnutChart = new Chart(ctxDoughnut.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: catLabels,
                datasets: [{
                    data: catData,
                    backgroundColor: techPalette,
                    borderColor: '#1f2937',
                    borderWidth: 2,
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#d1d5db', padding: 15, boxWidth: 12 } }
                },
                cutout: '65%'
            }
        });
    }
}