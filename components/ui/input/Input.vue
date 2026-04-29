<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input v-model="modelValue" :class="cn('flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2.5 text-sm text-foreground shadow-[0_1px_2px_0_rgba(17,24,39,0.04)] transition-all duration-200 file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-[#9ca3af] hover:border-[#cbd5e1] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50', props.class)">
</template>
