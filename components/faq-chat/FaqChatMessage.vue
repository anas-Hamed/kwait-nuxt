<template>
  <div
    class="flex animate-fade-in"
    :class="type === 'bot' ? 'justify-start' : 'justify-end'"
  >
    <div
      class="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed"
      :class="[
        type === 'bot'
          ? 'bg-muted text-primary rounded-2xl rounded-ts-sm'
          : 'bg-secondary text-secondary-foreground rounded-2xl rounded-te-sm',
      ]"
    >
      <div v-if="isHtml" v-html="content" />
      <span v-else>{{ content }}</span>
    </div>
  </div>

  <!-- Clickable option pills -->
  <div
    v-if="options?.length"
    class="flex flex-wrap gap-2 animate-fade-in"
    :class="type === 'bot' ? 'justify-start' : 'justify-end'"
  >
    <button
      v-for="option in options"
      :key="option.id"
      class="border border-secondary text-primary rounded-full px-4 py-2 text-sm
             hover:bg-secondary hover:text-secondary-foreground
             transition-colors cursor-pointer active:scale-95"
      @click="$emit('select-option', option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => ['bot', 'user'].includes(v),
  },
  content: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  isHtml: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select-option'])
</script>
