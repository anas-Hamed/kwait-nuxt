<template>
  <div class="relative w-full max-w-screen-sm">
    <div class="absolute end-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
      <Search :size="16" />
    </div>
    <Input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="h-12 rounded-full bg-accent pe-14 text-center border-0 shadow-sm focus-visible:ring-primary"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    />
    <div class="relative">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'
import { Input } from '~/components/ui/input'

defineProps({
  placeholder: { type: String, default: '' },
  modelValue: { type: String, required: false, default: '' },
})

defineEmits(['update:modelValue', 'focus', 'blur'])
</script>
