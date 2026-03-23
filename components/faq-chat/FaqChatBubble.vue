<template>
  <div>
    <!-- Chat Window -->
    <Transition name="chat-window">
      <FaqChatWindow v-if="isOpen" :key="sessionKey" @close="close" />
    </Transition>

    <!-- Floating Bubble -->
    <button
      class="fixed bottom-6 end-4 z-50 w-14 h-14 rounded-full btn-gold
             flex items-center justify-center shadow-card-hover
             hover:scale-110 active:scale-95 transition-transform cursor-pointer"
      @click="toggle"
      :aria-label="$t('faq_chat_title')"
    >
      <Transition name="icon-swap" mode="out-in">
        <X v-if="isOpen" class="size-6 text-primary" />
        <MessageCircleQuestion v-else class="size-6 text-primary" />
      </Transition>
    </button>
  </div>
</template>

<script setup>
import { MessageCircleQuestion, X } from 'lucide-vue-next'

const isOpen = ref(false)
const sessionKey = ref(0)

function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function open() {
  sessionKey.value++ // reset conversation on each open
  isOpen.value = true
}

function close() {
  isOpen.value = false
}
</script>

<style scoped>
/* Chat window open/close */
.chat-window-enter-active {
  animation: chat-open 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.chat-window-leave-active {
  animation: chat-close 0.2s ease forwards;
}

@keyframes chat-open {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes chat-close {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(16px);
  }
}

/* Icon swap */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: all 0.15s ease;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}
</style>
