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

function togglePassword() {
  const input = document.getElementById("password");

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
  const toggleBtn = document.getElementById("chat-toggle");
  const chat = document.getElementById("chatbot-container");

  toggleBtn.addEventListener("click", () => {
  chat.classList.toggle("hidden");
  });
}