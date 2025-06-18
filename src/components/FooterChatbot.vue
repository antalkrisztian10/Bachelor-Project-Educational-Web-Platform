<template>
  <div class="footer-chat">
    <!-- Chat Toggle Button -->
    <button class="chat-toggle" @click="toggleChat">
      <i class="fas fa-comments"></i>
    </button>

    <transition name="fade-slide">
      <div v-if="isChatOpen" class="chatbox">
        <div class="chat-header">
          <h3>StudyBuddy</h3>
          <button class="close-chat" @click="toggleChat">×</button>
        </div>

        <div class="chat-messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message', message.sender]"
          >
            {{ message.text }}
          </div>
        </div>

        <div class="chat-input">
          <input v-model="userMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
          <button @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'FooterChatbot',
  data() {
    return {
      isChatOpen: false,
      userMessage: '',
      messages: [
        // We'll fill this from localStorage if available
        { text: 'Hello! How can I assist you?', sender: 'bot' }
      ]
    }
  },
  mounted() {
    // 1. On component mount, load any saved chat messages from localStorage
    const savedChat = localStorage.getItem('studyBuddyChat')
    if (savedChat) {
      this.messages = JSON.parse(savedChat)
    }
  },
  watch: {
    // 2. Whenever `messages` changes, save it to localStorage
    messages: {
      deep: true, // watch nested changes
      handler(newVal) {
        localStorage.setItem('studyBuddyChat', JSON.stringify(newVal))
      }
    }
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen
    },
    sendMessage() {
      if (this.userMessage.trim() === '') return

      // Capture and push the user's message
      const messageToSend = this.userMessage
      this.messages.push({ text: messageToSend, sender: 'user' })
      this.userMessage = '' // Clear input

      // Send the message to your backend /chat endpoint (which calls OpenAI API)
      axios
        .post('/chat', { message: messageToSend })
        .then((response) => {
          const botReply = response.data.reply
          this.messages.push({ text: botReply, sender: 'bot' })
        })
        .catch((error) => {
          console.error('Error from chat API:', error)
          this.messages.push({
            text: 'Sorry, I encountered an error.',
            sender: 'bot'
          })
        })
    }
  }
}
</script>

<style scoped>
.footer-chat {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5em;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.chatbox {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.chat-header {
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header .close-chat {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
}

.chat-messages {
  height: 250px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.message {
  padding: 8px 12px;
  border-radius: 10px;
  max-width: 80%;
  margin-bottom: 5px;
}

.message.user {
  background: #007bff;
  color: white;
  align-self: flex-end;
}

.message.bot {
  background: #f1f1f1;
  align-self: flex-start;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 8px;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
}

.chat-input button {
  background: #007bff;
  border: none;
  color: white;
  padding: 8px;
  cursor: pointer;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- DARK MODE OVERRIDES ---------- */
body.dark-mode .footer-chat .chat-toggle {
  background-color: #0a84ff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
}

body.dark-mode .footer-chat .chatbox {
  background: #333;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.6);
}

body.dark-mode .footer-chat .chat-header {
  background: #0a84ff;
  color: #f0f0f0;
}

body.dark-mode .footer-chat .chat-messages {
  background: #333;
}

body.dark-mode .footer-chat .message {
  background: #444;
  color: #f0f0f0;
}

body.dark-mode .footer-chat .message.user {
  background: #0a84ff;
  color: #f0f0f0;
}

body.dark-mode .footer-chat .message.bot {
  background: #555;
  color: #f0f0f0;
}

body.dark-mode .footer-chat .chat-input {
  border-top: 1px solid #555;
}

body.dark-mode .footer-chat .chat-input input {
  background: #444;
  color: #f0f0f0;
}

body.dark-mode .footer-chat .chat-input button {
  background: #0a84ff;
  color: #f0f0f0;
}
</style>
