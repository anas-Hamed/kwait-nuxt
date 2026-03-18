<template>
  <div class="relative w-full group/search" :class="small ? 'max-w-full' : 'max-w-md'">
    <div class="absolute end-1.5 top-1/2 -translate-y-1/2 z-10">
      <button :class="small
        ? 'btn-gold h-7 px-3 rounded-full flex items-center justify-center gap-1 transition-all hover:scale-105 text-xs font-bold'
        : 'btn-gold h-9 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all hover:scale-105 text-sm font-bold'">
        <Search :size="small ? 12 : 15" />
        <span>{{ $t('search') }}</span>
      </button>
    </div>
    <Input
      :model-value="modelValue"
      type="text"
      :placeholder="placeholder"
      :class="[
        small
          ? (light
            ? 'h-10 rounded-full bg-surface ps-3.5 pe-20 border border-border text-foreground shadow-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground text-xs'
            : 'h-10 rounded-full bg-white/10 backdrop-blur-sm text-white pe-20 ps-3.5 border border-white/15 shadow-none focus-visible:ring-1 focus-visible:ring-secondary/40 focus-visible:bg-white/15 transition-all duration-300 placeholder:text-white/35 text-xs')
          : (light
            ? 'h-12 rounded-full bg-surface ps-5 pe-26 border border-border text-foreground shadow-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground text-sm'
            : 'h-12 rounded-full bg-white/10 backdrop-blur-sm text-white pe-26 ps-5 border border-white/15 shadow-none focus-visible:ring-1 focus-visible:ring-secondary/40 focus-visible:bg-white/15 transition-all duration-300 placeholder:text-white/35 text-sm')
      ]"
      @update:model-value="$emit('update:modelValue', $event)"
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
  light: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'focus', 'blur'])
</script>
