<template>
  <div id="chatbot-container" class="hidden"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  // Evitar instanciar el chatbot más de una vez
  if (window.n8nChatbotLoaded) return;

  // 1. Cargar el CSS base de n8n
  const linkTheme = document.createElement('link');
  linkTheme.id = 'n8n-chat-theme';
  linkTheme.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
  linkTheme.rel = 'stylesheet';
  document.head.appendChild(linkTheme);

  // 2. Inyectar el script del Chatbot y crearlo
  import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
    .then(({ createChat }) => {
      createChat({
        webhookUrl: 'https://n8n-production-5938.up.railway.app/webhook/c3cef601-7dc2-43cf-bddb-3dc0047106cb/chat',

        initialMessages: [
          '¡Hola! 👋',
          'Soy el asistente virtual de Botica Estrella.'
        ],

        i18n: {
          en: {
            title: 'Botica Estrella',
            subtitle: 'Atención farmacéutica',
            footer: '',
            getStarted: 'Comenzar',
            inputPlaceholder: 'Escribe tu consulta...'
          }
        }
      });
      window.n8nChatbotLoaded = true;
    })
    .catch(err => console.error("Error al inicializar el Chatbot", err));
});

onUnmounted(() => {
  // Limpieza profunda al salir del entorno público (ej. ir a la zona admin)
  const chatWindowToggle = document.querySelector('.chat-window-toggle');
  const chatWindow = document.querySelector('.chat-window');
  const themeLink = document.getElementById('n8n-chat-theme');

  if (chatWindowToggle) chatWindowToggle.remove();
  if (chatWindow) chatWindow.remove();
  if (themeLink) themeLink.remove();

  window.n8nChatbotLoaded = false;
});
</script>

<style>
/* Estilos globales personalizados para el Chatbot.
  Se usa <style> sin 'scoped' porque n8n inyecta los elementos en el <body>.
*/

/* Ventana principal */
.chat-window {
  border-radius: 24px !important;
  overflow: hidden !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .18) !important;
}

/* Cabecera */
.chat-header {
  background: linear-gradient(135deg, #0284c7, #06b6d4) !important;
  color: white !important;
  padding: 20px !important;
}

/* Título */
.chat-header h1 {
  color: white !important;
  font-size: 20px !important;
  font-weight: 700 !important;
}

/* Subtítulo */
.chat-header p {
  color: rgba(255, 255, 255, .9) !important;
}

/* Fondo del chat */
.chat-body {
  background: #f8fafc !important;
}

/* Footer */
.chat-footer {
  padding: 15px !important;
  background: white !important;
}

/* Contenedor del input */
.chat-input {
  padding: 8px !important;
}

/* Área donde escribe el usuario */
.chat-input textarea {
  min-height: 80px !important;
  max-height: 150px !important;
  border-radius: 20px !important;
  border: 2px solid #cbd5e1 !important;
  padding: 14px 18px !important;
  box-sizing: border-box !important;
}

/* Botón enviar */
.chat-input-send-button {
  margin-left: 10px !important;
}

/* Botón flotante */
.chat-window-toggle {
  background: linear-gradient(135deg, #0284c7, #06b6d4) !important;
  border-radius: 50% !important;
  box-shadow: 0 10px 30px rgba(2, 132, 199, .4);
}

/* Contenedor de todos los mensajes */
.chat-message {
  width: fit-content !important;
  max-width: 80% !important;
}

/* Bot a la izquierda */
.chat-message.chat-message-from-bot {
  margin-right: auto !important;
  margin-left: 10px !important;
  background: white !important;
  border-radius: 18px !important;
  padding: 12px 16px !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .05);
}

/* Usuario a la derecha */
.chat-message.chat-message-from-user {
  margin-left: auto !important;
  margin-right: 10px !important;
  background: #0284c7 !important;
  color: white !important;
  border-radius: 18px !important;
  padding: 12px 16px !important;
}
</style>