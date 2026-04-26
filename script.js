// ================= MODALES =================
function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
  document.getElementById("registerModal").style.display = "none";
}

function openRegister() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("registerModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("registerModal").style.display = "none";
}

// ================= MOSTRAR / OCULTAR PASSWORD =================

function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// ================= VALIDACIÓN LOGIN =================

function validarLogin() {
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

  // ✔ correcto
  error.style.color = "green";
  error.textContent = "Ingreso correcto";

  setTimeout(() => {
    closeModal();
  }, 1000);
}

// ================= VALIDACIÓN REGISTRO =================

function validarRegistro() {
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
    openLogin();
  }, 1000);
}

const toggleBtn = document.getElementById("chat-toggle");
const chat = document.getElementById("chatbot-container");

  toggleBtn.addEventListener("click", () => {
  chat.classList.toggle("hidden");
  });
