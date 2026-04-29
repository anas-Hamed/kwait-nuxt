<script setup>
import { Check, ChevronDown, X } from 'lucide-vue-next'
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
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const searchTerm = ref('')
const open = ref(false)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : ''
})

// When the dropdown closes without a new selection, clear the search term
// so the trigger shows the stored selected label again, not the stale query
watch(open, (isOpen) => {
  if (!isOpen) searchTerm.value = ''
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

function clearSelection(e) {
  e.stopPropagation()
  emit('update:modelValue', null)
  searchTerm.value = ''
  open.value = false
}
</script>

<template>
  <Combobox v-model="searchTerm" :open="open" @update:open="open = $event">
    <ComboboxAnchor class="cs-anchor" :class="{ 'cs-anchor--disabled': disabled }">
      <ComboboxInput
        :value="open ? searchTerm : selectedLabel"
        :placeholder="placeholder"
        :disabled="disabled"
        class="cs-input"
        @focus="open = true"
        @input="searchTerm = $event.target.value"
      />

      <!-- Clear button: only when something is selected and not disabled -->
      <button
        v-if="modelValue !== null && modelValue !== undefined && !disabled"
        type="button"
        class="cs-clear"
        :aria-label="$t('remove')"
        @click="clearSelection"
      >
        <X :size="14" />
      </button>

      <ComboboxTrigger class="cs-trigger" :disabled="disabled" @click="!disabled && (open = !open)">
        <ChevronDown
          :size="16"
          class="cs-chevron"
          :class="{ 'cs-chevron--open': open }"
        />
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
/* Anchor / trigger box — matches Input.vue base styling */
.cs-anchor {
  display: flex;
  align-items: center;
  width: 100% !important;
  height: 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-input);
  background: #ffffff;
  padding: 0 0.5rem 0 1rem;
  gap: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(17, 24, 39, 0.04);
  transition: all 200ms ease-out;
}
.cs-anchor:hover {
  border-color: #cbd5e1;
}
.cs-anchor:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(107, 77, 209, 0.2);
}
.cs-anchor--disabled {
  background: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}
.cs-anchor--disabled:hover {
  border-color: var(--color-input);
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
  color: var(--color-foreground);
  min-width: 0;
}
.cs-input::placeholder {
  color: #9ca3af;
}
.cs-input:disabled {
  cursor: not-allowed;
}

/* Clear button */
.cs-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  transition: all 150ms ease-out;
  flex-shrink: 0;
}
.cs-clear:hover {
  background: #e5e7eb;
  color: #111827;
}

/* Chevron trigger */
.cs-trigger {
  padding: 0.25rem 0.35rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #9ca3af;
}
.cs-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.cs-chevron {
  transition: transform 200ms ease-out;
}
.cs-chevron--open {
  transform: rotate(180deg);
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
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.1), 0 2px 8px rgba(17, 24, 39, 0.06) !important;
}

/* Each option item */
.cs-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 120ms ease-out;
  color: var(--color-foreground);
}
.cs-item[data-highlighted] {
  background: #F3ECFF;
  color: var(--color-primary);
}

/* Empty state */
.cs-empty {
  padding: 1.5rem 0.75rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-muted-foreground);
}
</style>
