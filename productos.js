// ================= MASTER DE PRODUCTOS =================
const productos = {
    paracetamol: { nombre: "Paracetamol 120mg/5ml Jarabe", precio: "S/. 2.00", descripcion: "Alivia fiebre y dolor leve.", imagen: "img/paracetamol.png" },
    naproxeno: { nombre: "Naproxeno Sodico 550 Mg", precio: "S/. 4.00", descripcion: "Antiinflamatorio para dolores musculares.", imagen: "img/naproxeno.webp" },
    clorfenamina: { nombre: "Clorfenamina 4mg", precio: "S/. 5.00", descripcion: "Antialérgico para resfriados.", imagen: "img/clorfenamina.jpg" },
    prednisona: { nombre: "Prednisona 50mg", precio: "S/. 10.00", descripcion: "Reducir inflamaciones severas y alergias.", imagen: "img/prednisona.jpg" },
    dexametasona: { nombre: "Dexametasona 4mg", precio: "S/. 10.00", descripcion: "Suprimir el sistema inmunológico y tratar reacciones alérgicas graves.", imagen: "img/dexametasona.webp" },
    ibuprofeno: { nombre: "Ibuprofeno 800mg", precio: "S/. 15.00", descripcion: "Antiinflamatorio no esteroideo utilizado para tratar el dolor intenso y la fiebre.", imagen: "img/ibuprofeno.jpg" },
    alcoholGel: { nombre: "Alcohol en gel 70% 250ml", precio: "S/. 8.50", descripcion: "Desinfectante para manos con alcohol.", imagen: "img/Alcohol en Gel.webp" },
    termometroDigital: { nombre: "Termómetro digital", precio: "S/. 25.00", descripcion: "Medición precisa de temperatura corporal.", imagen: "img/termometro digital.webp" },
    vitaminaC: { nombre: "Vitaminas C 500 mg", precio: "S/. 12.00", descripcion: "Refuerza el sistema inmunológico.", imagen: "img/vitamina c.avif" },
    vendas: { nombre: "Vendas elásticas 5m", precio: "S/. 6.00", descripcion: "Soporte para lesiones musculares.", imagen: "img/vendas elasticas.jpg" },
    cremaHeridas: { nombre: "Crema para heridas y quemaduras", precio: "S/. 9.00", descripcion: "Ayuda a cicatrizar y regenerar la piel.", imagen: "img/creama quemaduras.avif" },
    aspirina: { nombre: "Aspirina 500 mg", precio: "S/. 7.00", descripcion: "Alivia dolor y fiebre.", imagen: "img/aspirina.avif" },
    omeprazol: { nombre: "Omeprazol 20 mg", precio: "S/. 18.00", descripcion: "Protector gástrico.", imagen: "img/omeprazol.png" },
    loratadina: { nombre: "Loratadina 10 mg", precio: "S/. 14.00", descripcion: "Antialérgico.", imagen: "img/loratadina.jpg" },
    suero: { nombre: "Suero oral 500 ml", precio: "S/. 11.00", descripcion: "Hidratación rápida y efectiva.", imagen: "img/suero oral.jpg" },
    gelAntiinflamatorio: { nombre: "Gel antiinflamatorio 100 g", precio: "S/. 13.00", descripcion: "Alivia dolor muscular y articular.", imagen: "img/gel antiflamatorio.jpg" },
    termometroInfrarrojo: { nombre: "Termómetro infrarrojo", precio: "S/. 55.00", descripcion: "Medición de temperatura sin contacto.", imagen: "img/termometro infrarojo.webp" },
    algodon: { nombre: "Algodón 100 g", precio: "S/. 4.50", descripcion: "Uso médico y limpieza.", imagen: "img/algodon.jpg" },
    curitas: { nombre: "Curitas adhesivas surtidas", precio: "S/. 5.00", descripcion: "Protección para heridas pequeñas.", imagen: "img/curitas.png" },
    mascarillas: { nombre: "Mascarillas quirúrgicas 10 uds", precio: "S/. 20.00", descripcion: "Protección respiratoria.", imagen: "img/mascarilla.jpg" },
    guantes: { nombre: "Guantes desechables 50 uds", precio: "S/. 18.00", descripcion: "Higiene y protección para las manos.", imagen: "img/guantes.jpg" },
    antiseptico: { nombre: "Antiséptico para piel 120 ml", precio: "S/. 10.50", descripcion: "Limpieza y desinfección profunda.", imagen: "img/antiseptico.jpg" },
    jeringas: { nombre: "Jeringas desechables 5 ml", precio: "S/. 9.50", descripcion: "Uso médico esterilizado.", imagen: "img/jeringas.jpg" },
    colirio: { nombre: "Colirio lubricante 10 ml", precio: "S/. 16.00", descripcion: "Hidratación ocular.", imagen: "img/colirio.jpg" },
    protectorSolar: { nombre: "Protector solar SPF 50", precio: "S/. 22.00", descripcion: "Protección contra rayos UV.", imagen: "img/protector solar.webp" },
    probioticos: { nombre: "Probióticos 30 cápsulas", precio: "S/. 28.00", descripcion: "Mejora y protege tu salud digestiva.", imagen: "img/probioticos.jpg" },
    bandas: { nombre: "Banditas de resistencia", precio: "S/. 19.00", descripcion: "Ejercicio y rehabilitación.", imagen: "img/bandas de resistencia.png" },
    cremaDental: { nombre: "Crema dental protectora", precio: "S/. 8.00", descripcion: "Higiene bucal y protección anticaries.", imagen: "img/crema dental.webp" },
    shampoo: { nombre: "Shampoo antibacterial 250 ml", precio: "S/. 17.00", descripcion: "Limpieza profunda del cabello.", imagen: "img/shampoo.avif" },
    oldSpice: { nombre: "Pack 2 Desodorantes Old Spice", precio: "S/. 31.00", descripcion: "Fragancia legendaria y protección duradera contra el sudor.", imagen: "img/old_pieces.png" },
    toallitas: { nombre: "Toallitas Húmedas Ninet Plus", precio: "S/. 8.90", descripcion: "Limpieza suave y efectiva para el cuidado diario de la piel.", imagen: "img/toallitas.png" },
    
    // --- PRODUCTOS NUEVOS AÑADIDOS AL CATÁLOGO ---
    amoxicilina: { nombre: "Amoxicilina 500 mg", precio: "S/. 14.00", descripcion: "Antibiótico de amplio espectro para tratar infecciones bacterianas.", imagen: "img/amoxicilina.webp" },
    panadol: { nombre: "Panadol Extra", precio: "S/. 9.50", descripcion: "Alivio rápido y eficaz del dolor fuerte y la fiebre.", imagen: "img/panadol.png" },
    diclofenaco: { nombre: "Diclofenaco 50 mg", precio: "S/. 11.00", descripcion: "Antiinflamatorio y analgésico para dolores articulares.", imagen: "img/diclofenaco.jpg" },
    salDeFrutas: { nombre: "Sal de Frutas", precio: "S/. 6.50", descripcion: "Alivio rápido de la acidez estomacal e indigestión.", imagen: "img/sal de frutas.jpg" },
    vitaminaD: { nombre: "Vitamina D 1000 UI", precio: "S/. 18.00", descripcion: "Suplemento para fortalecer los huesos y el sistema inmunológico.", imagen: "img/vitamina d.webp" },
    calcio: { nombre: "Calcio + Magnesio", precio: "S/. 22.00", descripcion: "Suplemento esencial para la salud ósea y muscular.", imagen: "img/calcio.avif" },
    multivitaminico: { nombre: "Multivitamínico Adulto", precio: "S/. 24.00", descripcion: "Complejo de vitaminas y minerales para tu día a día.", imagen: "img/multivitaminico.webp" },
    jaraVick: { nombre: "Jarabe para la tos Vick 44", precio: "S/. 19.00", descripcion: "Alivio efectivo de la tos seca y con flema.", imagen: "img/jarabevick44.webp" },
    sprayNasal: { nombre: "Spray Nasal Descongestionante", precio: "S/. 15.50", descripcion: "Alivio rápido de la congestión nasal y alergias.", imagen: "img/spray nasal.jpg" },
    aguaOxigenada: { nombre: "Agua Oxigenada 120 ml", precio: "S/. 5.50", descripcion: "Antiséptico de uso externo para desinfección de heridas.", imagen: "img/agua oxigenada.jpg" },
    gasaEsteril: { nombre: "Gasas Estériles 10 uds", precio: "S/. 4.00", descripcion: "Ideales para limpieza y cobertura segura de heridas.", imagen: "img/gasa esteril 10 u.webp" },
    glucometro: { nombre: "Glucómetro Digital", precio: "S/. 65.00", descripcion: "Equipo médico para el monitoreo preciso de la glucosa en sangre.", imagen: "img/glucometro digital.webp" },
    bloqueadorLabial: { nombre: "Protector Labial SPF 30", precio: "S/. 7.50", descripcion: "Hidrata y protege tus labios contra los rayos solares.", imagen: "img/protector labial.png" },
    jabonMedicinal: { nombre: "Jabón Medicinal Antibacterial", precio: "S/. 9.00", descripcion: "Elimina bacterias y protege la salud de tu piel.", imagen: "img/jabon antibacterial.webp" },
    aceiteBebe: { nombre: "Aceite para Bebé 200 ml", precio: "S/. 16.00", descripcion: "Hidratación suave para la piel delicada del bebé.", imagen: "img/aceite para bebe 200ml.webp" },
    pañales: { nombre: "Pañales Huggies Pack", precio: "S/. 54.00", descripcion: "Máxima absorción y comodidad para el cuidado de tu bebé.", imagen: "img/pañales huggies.webp" },
    enjuagueBucal: { nombre: "Enjuague Bucal Listerine 500 ml", precio: "S/. 14.50", descripcion: "Protección intensiva contra la placa y el mal aliento.", imagen: "img/enjuage bucal listerine.webp" }
};

// ================= LÓGICA DE DETALLE =================
function cargarDetalle() {
    // 1. Obtener la variable "?producto=xxx" de la URL
    const params = new URLSearchParams(window.location.search);
    const productoKey = params.get("producto");
    const data = productos[productoKey];

    // 2. Comprobar si estamos en la página correcta
    const nombreElem = document.getElementById("nombre");
    if (!nombreElem) return; // Si no estamos en detalle.html, sale de la función

    // 3. Si el producto existe en nuestro objeto "productos"
    if (data) {
        nombreElem.textContent = data.nombre;
        document.getElementById("precio").textContent = data.precio;
        document.getElementById("descripcion").textContent = data.descripcion;
        document.getElementById("imagen").src = data.imagen;
    } 
    // 4. Si el producto NO existe o la URL está mal escrita
    else {
        nombreElem.textContent = "Producto no encontrado";
        nombreElem.style.color = "#ef4444"; // Color rojo de Tailwind (red-500)
        document.getElementById("precio").textContent = "S/. 0.00";
        document.getElementById("descripcion").innerHTML = `
            Lo sentimos, el producto que buscas no existe en nuestra base de datos o el enlace es incorrecto. 
            <br><br>
            <a href="productos.html" style="color: #0d4d8b; font-weight: bold; text-decoration: underline;">&larr; Volver al catálogo</a>
        `;
        document.getElementById("imagen").src = "img/Botica.png"; // Imagen por defecto
        
        // Ocultar botones de agregar al carrito y el badge de "Disponible"
        const btnAgregar = document.getElementById("btn-agregar");
        if(btnAgregar) btnAgregar.style.display = "none";
        
        const badge = nombreElem.previousElementSibling;
        if(badge) badge.style.display = "none";
    }
}

// INVOCACIÓN AUTOMÁTICA
// Cuando la página (detalle.html) termine de cargar, esta función se ejecutará sola.
document.addEventListener("DOMContentLoaded", cargarDetalle);