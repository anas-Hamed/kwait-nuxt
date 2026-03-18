<template>
  <div class="relative w-full max-w-md group/search">
    <div class="absolute end-1.5 top-1/2 -translate-y-1/2 z-10">
      <button class="btn-gold h-9 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all hover:scale-105 text-sm font-bold">
        <Search :size="15" />
        <span>{{ $t('search') }}</span>
      </button>
    </div>
    <Input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="h-12 rounded-full bg-white/10 backdrop-blur-sm text-white pe-26 ps-5 border border-white/15 shadow-none focus-visible:ring-1 focus-visible:ring-secondary/40 focus-visible:bg-white/15 transition-all duration-300 placeholder:text-white/35 text-sm"
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
