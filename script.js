// ================= CONFIGURACIÓN CHATBOT (n8n) =================
import { createChat } from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";

createChat({
  webhookUrl: "https://n8n-production-7867.up.railway.app/webhook/c3cef601-7dc2-43cf-bddb-3dc0047106cb/chat",
  mode: "window",
  showWelcomeScreen: true,
  initialMessages: ["Hola", "Soy el asistente de Botica Estrella, ¿en qué puedo ayudarte?"],
  i18n: {
    en: {
      title: "Hola",
      subtitle: "Escríbenos, estamos para ayudarte",
      getStarted: "Iniciar chat",
      inputPlaceholder: "Escribe tu mensaje...",
      footer: "",
    },
  },
});

// ================= MODALES =================
window.openLogin = function() {
  document.getElementById("loginModal").style.display = "flex";
  document.getElementById("registerModal").style.display = "none";
}

window.openRegister = function() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("registerModal").style.display = "flex";
}

window.closeModal = function() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("registerModal").style.display = "none";
}

// ================= MOSTRAR / OCULTAR PASSWORD =================
window.togglePassword = function() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// ================= VALIDACIÓN LOGIN =================
window.validarLogin = function() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("loginError");

  error.style.color = "red";
  error.textContent = "";

  if (!email || !password) {
    error.textContent = "Completa todos los campos";
    return;
  }

  if (!email.includes("@")) {
    error.textContent = "Correo no válido";
    return;
  }

  if (password.length < 6) {
    error.textContent = "Mínimo 6 caracteres";
    return;
  }

  error.style.color = "green";
  error.textContent = "Ingreso correcto";

  setTimeout(() => {
    window.closeModal();
  }, 1000);
}

// ================= VALIDACIÓN REGISTRO =================
window.validarRegistro = function() {
  const nombre = document.getElementById("regNombre").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const confirm = document.getElementById("regConfirm").value.trim();
  const error = document.getElementById("regError");

  error.style.color = "red";
  error.textContent = "";

  if (!nombre || !email || !password || !confirm) {
    error.textContent = "Faltan completar datos";
    return;
  }

  if (!email.includes("@")) {
    error.textContent = "Correo no válido";
    return;
  }

  if (password.length < 6) {
    error.textContent = "Contraseña muy corta";
    return;
  }

  if (password !== confirm) {
    error.textContent = "Las contraseñas no coinciden";
    return;
  }

  error.style.color = "green";
  error.textContent = "Registro exitoso";

  setTimeout(() => {
    window.openLogin();
  }, 1000);
}

// ================= LÓGICA DE BÚSQUEDA Y CATEGORÍAS =================

// Hacemos global la función mostrarTodos para que el botón la encuentre
window.mostrarTodos = function() {
  const searchInput = document.getElementById("searchInput");
  const categoriaSelect = document.getElementById("categoriaSelect");
  const cards = document.querySelectorAll(".catalog-card");
  
  if(searchInput) searchInput.value = ""; 
  if(categoriaSelect) categoriaSelect.value = "todos"; 
  
  cards.forEach(card => card.style.display = "flex"); 
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const categoriaSelect = document.getElementById("categoriaSelect");
  const cards = document.querySelectorAll(".catalog-card");

  function filtrarProductos() {
    if (!searchInput || !categoriaSelect) return; // Evita errores si no estamos en la página de productos

    const searchText = searchInput.value.toLowerCase();
    const categoriaSeleccionada = categoriaSelect.value;

    cards.forEach(card => {
      const productName = card.querySelector("p").textContent.toLowerCase();
      const productCategoria = card.getAttribute("data-categoria");
      
      const coincideTexto = productName.includes(searchText);
      const coincideCategoria = (categoriaSeleccionada === "todos" || categoriaSeleccionada === productCategoria);

      if (coincideTexto && coincideCategoria) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (searchInput && categoriaSelect) {
    searchInput.addEventListener("input", filtrarProductos);
    categoriaSelect.addEventListener("change", filtrarProductos);
  }

  // Toggle manual del chat si es necesario
  const toggleBtn = document.getElementById("chat-toggle");
  const chat = document.getElementById("chatbot-container");
  if(toggleBtn && chat) {
      toggleBtn.addEventListener("click", () => {
          chat.classList.toggle("hidden");
      });
  }
});

// ================= MODAL SEGUIMIENTO =================
window.openTracking = function() {
  const modal = document.getElementById("trackingModal");
  if(modal) modal.style.display = "flex";
}

window.closeTracking = function() {
  const modal = document.getElementById("trackingModal");
  if(modal) modal.style.display = "none";
}
