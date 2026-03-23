<template>
  <div
    class="fixed z-50 bottom-24 end-4 w-[calc(100vw-2rem)] sm:w-[360px] h-[65vh] sm:h-[540px]
           bg-card rounded-2xl shadow-card-hover border border-border overflow-hidden
           flex flex-col chat-window"
  >
    <!-- Header -->
    <div class="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <MessageCircleQuestion class="size-5" />
        <span class="font-semibold text-sm">{{ $t('faq_chat_title') }}</span>
      </div>
      <button
        class="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        @click="$emit('close')"
        :aria-label="$t('faq_chat_close')"
      >
        <X class="size-4" />
      </button>
    </div>

    <!-- Messages -->
    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
      <template v-for="(msg, i) in messages" :key="i">
        <FaqChatMessage
          :type="msg.type"
          :content="msg.content"
          :options="msg.options"
          :is-html="msg.isHtml || false"
          @select-option="handleOptionSelect"
        />
      </template>

      <!-- Skeleton loading for options -->
      <template v-if="loading">
        <div class="flex justify-start animate-fade-in">
          <div class="bg-muted rounded-2xl rounded-ts-sm px-4 py-3 flex items-center gap-1.5">
            <span class="typing-dot" />
            <span class="typing-dot" style="animation-delay: 0.15s" />
            <span class="typing-dot" style="animation-delay: 0.3s" />
          </div>
        </div>
        <div class="flex flex-wrap gap-2 animate-fade-in">
          <div v-for="n in 3" :key="n" class="h-9 rounded-full bg-muted animate-pulse" :style="{ width: `${70 + n * 25}px` }" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { MessageCircleQuestion, X } from 'lucide-vue-next'

const emit = defineEmits(['close'])
const { t } = useI18n()
const api = useApi()

const scrollContainer = ref(null)
const messages = ref([])
const loading = ref(false)
const categories = ref([])
const currentQuestions = ref([])
const currentCategoryId = ref(null)
let messageId = 0

function pushMessage(msg) {
  messages.value.push({ id: messageId++, ...msg })
  nextTick(() => {
    scrollContainer.value?.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: 'smooth' })
  })
}

function clearLastOptions() {
  // Remove options from the last bot message so they can't be clicked again
  const last = [...messages.value].reverse().find((m) => m.options?.length)
  if (last) last.options = []
}

async function loadCategories() {
  loading.value = true
  try {
    const res = await api.get('qa/categories')
    const data = res.data || res
    categories.value = Array.isArray(data) ? data : []

    pushMessage({
      type: 'bot',
      content: t('faq_chat_pick_category'),
      options: categories.value.map((cat) => ({
        id: cat.id,
        label: cat.name,
        action: 'select-category',
      })),
    })
  } catch {
    pushMessage({ type: 'bot', content: t('faq_chat_error') })
  } finally {
    loading.value = false
  }
}

async function selectCategory(category) {
  clearLastOptions()
  pushMessage({ type: 'user', content: category.label })

  currentCategoryId.value = category.id
  loading.value = true

  try {
    const res = await api.get(`qa/category/${category.id}`)
    const data = res.data || res
    currentQuestions.value = Array.isArray(data) ? data : []

    pushMessage({
      type: 'bot',
      content: t('faq_chat_pick_question'),
      options: currentQuestions.value.map((q) => ({
        id: q.id,
        label: q.question,
        action: 'select-question',
      })),
    })
  } catch {
    pushMessage({ type: 'bot', content: t('faq_chat_error') })
  } finally {
    loading.value = false
  }
}

async function selectQuestion(question) {
  clearLastOptions()
  pushMessage({ type: 'user', content: question.label })

  loading.value = true

  try {
    const res = await api.get(`qa/${question.id}`)
    const data = res.data || res
    const answer = data.answer || data.content || (typeof data === 'string' ? data : '')

    // Check if answer contains HTML tags
    const hasHtml = /<[a-z][\s\S]*>/i.test(answer)
    pushMessage({ type: 'bot', content: answer, isHtml: hasHtml })

    // Ask if they want another question
    pushMessage({
      type: 'bot',
      content: t('faq_chat_another_question'),
      options: [
        { id: 'yes', label: t('faq_chat_yes'), action: 'confirm-yes' },
        { id: 'no', label: t('faq_chat_no'), action: 'confirm-no' },
      ],
    })
  } catch {
    pushMessage({ type: 'bot', content: t('faq_chat_error') })
  } finally {
    loading.value = false
  }
}

function handleYes() {
  clearLastOptions()
  pushMessage({ type: 'user', content: t('faq_chat_yes') })

  // Re-show cached questions
  pushMessage({
    type: 'bot',
    content: t('faq_chat_pick_question'),
    options: currentQuestions.value.map((q) => ({
      id: q.id,
      label: q.question,
      action: 'select-question',
    })),
  })
}

function handleNo() {
  clearLastOptions()
  pushMessage({ type: 'user', content: t('faq_chat_no') })

  // Re-show cached categories
  pushMessage({
    type: 'bot',
    content: t('faq_chat_pick_category'),
    options: categories.value.map((cat) => ({
      id: cat.id,
      label: cat.name,
      action: 'select-category',
    })),
  })
}

function handleOptionSelect(option) {
  switch (option.action) {
    case 'select-category':
      selectCategory(option)
      break
    case 'select-question':
      selectQuestion(option)
      break
    case 'confirm-yes':
      handleYes()
      break
    case 'confirm-no':
      handleNo()
      break
  }
}

// Init
onMounted(() => {
  pushMessage({ type: 'bot', content: t('faq_chat_welcome') })
  loadCategories()
})
</script>

<style scoped>
.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-muted-foreground);
  animation: typing-bounce 0.6s ease-in-out infinite alternate;
}

@keyframes typing-bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-4px);
  }
}
</style>
