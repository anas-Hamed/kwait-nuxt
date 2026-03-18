<script setup>
import { Check, ChevronDown } from 'lucide-vue-next'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '~/components/ui/combobox'

const props = defineProps({
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  modelValue: { default: null },
})

const emit = defineEmits(['update:modelValue'])

const searchTerm = ref('')
const open = ref(false)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : ''
})

const filteredOptions = computed(() => {
  if (!searchTerm.value) return props.options
  const term = searchTerm.value.toLowerCase()
  return props.options.filter(o => o.label.toLowerCase().includes(term))
})

function onSelect(val) {
  emit('update:modelValue', val)
  open.value = false
  searchTerm.value = ''
}
</script>

<template>
  <Combobox v-model="searchTerm" :open="open" @update:open="open = $event">
    <ComboboxAnchor class="cs-anchor">
      <ComboboxInput
        :placeholder="selectedLabel || placeholder"
        :class="['cs-input', selectedLabel ? 'text-foreground' : 'text-muted-foreground']"
        @focus="open = true"
        @input="searchTerm = $event.target.value"
      />
      <ComboboxTrigger class="cs-trigger" @click="open = !open">
        <ChevronDown :size="16" class="text-muted-foreground transition-transform duration-200" :class="open ? 'rotate-180' : ''" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="cs-dropdown">
      <ComboboxEmpty class="cs-empty">
        {{ $t('no_results') || 'No results found' }}
      </ComboboxEmpty>
      <ComboboxItem
        v-for="option in filteredOptions"
        :key="option.value"
        :value="option.label"
        class="cs-item"
        @select="onSelect(option.value)"
      >
        <span>{{ option.label }}</span>
        <Check v-if="modelValue === option.value" :size="14" class="text-primary shrink-0" />
      </ComboboxItem>
    </ComboboxList>
  </Combobox>
</template>

<style>
/* Anchor / trigger box */
.cs-anchor {
  display: flex;
  align-items: center;
  width: 100% !important;
  height: 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-input);
  background: var(--color-accent);
  padding: 0 0.5rem 0 0.75rem;
  transition: all 0.15s;
}
.cs-anchor:focus-within {
  box-shadow: 0 0 0 2px var(--color-ring);
}

/* Input field inside anchor */
.cs-input {
  flex: 1;
  height: 100%;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  font-size: 0.875rem;
  padding: 0 !important;
  box-shadow: none !important;
}

.cs-trigger {
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Dropdown panel — override shadcn defaults */
.cs-dropdown {
  width: var(--reka-combobox-trigger-width, 100%) !important;
  max-height: 240px;
  overflow-y: auto;
  padding: 0.375rem !important;
  border-radius: 0.75rem !important;
  border: none !important;
  background: white !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06) !important;
}

/* Each option item */
.cs-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.1s;
  color: var(--color-foreground);
}
.cs-item[data-highlighted] {
  background: var(--color-accent);
}

/* Empty state */
.cs-empty {
  padding: 1.5rem 0.75rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-muted-foreground);
}
</style>
