<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>🦜 Budgerigar Sales Agent</h1>
      <p>Your expert guide to purchasing budgerigars and bird care products</p>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" :class="['message', message.role]">
        <div class="message-content">
          <div class="message-text">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      
      <div v-if="isLoading" class="message assistant loading">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <div class="input-container">
        <input
          v-model="currentMessage"
          @keypress.enter="sendMessage"
          placeholder="Ask about budgerigars, their care, or make a purchase..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !currentMessage.trim()">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const currentMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()
const sessionId = ref(crypto.randomUUID())

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return

  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: 'user',
    content: currentMessage.value,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageText = currentMessage.value
  currentMessage.value = ''
  isLoading.value = true

  await scrollToBottom()

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId.value,
        message: messageText
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    const data = await response.json()
    
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.response,
      timestamp: new Date()
    }

    messages.value.push(assistantMessage)
  } catch (error) {
    console.error('Error sending message:', error)
    
    const errorMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please make sure the backend server is running on port 3000.',
      timestamp: new Date()
    }
    
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

onMounted(() => {
  const welcomeMessage: Message = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: 'Hello! I\'m your budgerigar sales expert. I can help you choose the perfect bird, learn about care requirements, and find the right products. What would you like to know?',
    timestamp: new Date()
  }
  
  messages.value.push(welcomeMessage)
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
  width: 100%;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chat-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.chat-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: white;
}

.message {
  margin-bottom: 1rem;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 75%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
}

.user .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.assistant .message-content {
  background: #e9ecef;
  color: #333;
  border-bottom-left-radius: 0.25rem;
}

.message-text {
  line-height: 1.4;
  white-space: pre-wrap;
  text-align: left;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.loading .message-content {
  background: #e9ecef;
  padding: 1rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.chat-input {
  background: white;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  max-width: 100%;
}

.input-container input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  min-width: 0;
  width: 100%;
}

.input-container input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.input-container button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.input-container button:hover:not(:disabled) {
  background: #5a6fd8;
}

.input-container button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    max-width: 100%;
    margin: 0;
  }
  
  .chat-header {
    padding: 1rem;
  }
  
  .chat-header h1 {
    font-size: 1.5rem;
  }
  
  .chat-header p {
    font-size: 0.875rem;
  }
  
  .chat-messages {
    padding: 0.75rem;
  }
  
  .message-content {
    max-width: 85%;
    padding: 0.625rem 0.875rem;
  }
  
  .input-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .input-container input {
    width: 100%;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .input-container button {
    width: 100%;
    padding: 0.875rem;
  }
}

@media (max-width: 480px) {
  .chat-header {
    padding: 0.75rem;
  }
  
  .chat-header h1 {
    font-size: 1.25rem;
  }
  
  .chat-header p {
    font-size: 0.8rem;
  }
  
  .chat-messages {
    padding: 0.5rem;
  }
  
  .message-content {
    max-width: 90%;
    padding: 0.5rem 0.75rem;
  }
  
  .message-text {
    font-size: 0.95rem;
  }
  
  .message-time {
    font-size: 0.65rem;
  }
}
</style>