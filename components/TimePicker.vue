<script setup>
import { Clock } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '08:00' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const pickerRef = ref(null)

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

const selectedHour = computed(() => props.modelValue?.split(':')[0] || '08')
const selectedMinute = computed(() => props.modelValue?.split(':')[1] || '00')

function selectTime(h, m) {
  emit('update:modelValue', `${h}:${m}`)
  open.value = false
}

function selectHour(h) {
  emit('update:modelValue', `${h}:${selectedMinute.value}`)
}

function selectMinute(m) {
  emit('update:modelValue', `${selectedHour.value}:${m}`)
}

// Close on outside click
function onClickOutside(e) {
  if (pickerRef.value && !pickerRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="pickerRef" class="tp-wrapper">
    <button
      type="button"
      class="tp-trigger"
      :class="{ 'tp-disabled': disabled }"
      :disabled="disabled"
      @click="open = !open"
    >
      <span class="tp-value">{{ modelValue }}</span>
      <Clock :size="14" class="tp-icon" />
    </button>

    <Transition name="tp-fade">
      <div v-if="open && !disabled" class="tp-dropdown">
        <div class="tp-columns">
          <!-- Hours -->
          <div class="tp-col">
            <div class="tp-col-label">HR</div>
            <div class="tp-scroll">
              <button
                v-for="h in hours"
                :key="h"
                type="button"
                class="tp-option"
                :class="{ 'tp-selected': h === selectedHour }"
                @click="selectHour(h)"
              >
                {{ h }}
              </button>
            </div>
          </div>
          <!-- Minutes -->
          <div class="tp-col">
            <div class="tp-col-label">MIN</div>
            <div class="tp-scroll">
              <button
                v-for="m in minutes"
                :key="m"
                type="button"
                class="tp-option"
                :class="{ 'tp-selected': m === selectedMinute }"
                @click="selectMinute(m)"
              >
                {{ m }}
              </button>
            </div>
          </div>
        </div>
        <button type="button" class="tp-done" @click="open = false">
          Done
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tp-wrapper {
  position: relative;
  display: inline-block;
}

.tp-trigger {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  max-width: 120px;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #f8f9fa;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #1b2c3b;
  cursor: pointer;
  transition: border-color 0.15s;
  text-align: center;
  justify-content: center;
}

.tp-trigger:hover {
  border-color: #1b2c3b;
}

.tp-trigger:focus {
  outline: none;
  border-color: #1b2c3b;
}

.tp-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tp-disabled:hover {
  border-color: #e5e7eb;
}

.tp-value {
  font-variant-numeric: tabular-nums;
}

.tp-icon {
  color: #9ca3af;
  flex-shrink: 0;
}

/* Dropdown */
.tp-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0.5rem;
  min-width: 140px;
}

.tp-columns {
  display: flex;
  gap: 0.25rem;
}

.tp-col {
  flex: 1;
}

.tp-col-label {
  font-size: 0.5625rem;
  font-weight: 700;
  color: #9ca3af;
  text-align: center;
  letter-spacing: 0.05em;
  padding-bottom: 0.375rem;
}

.tp-scroll {
  max-height: 160px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.tp-scroll::-webkit-scrollbar {
  width: 3px;
}

.tp-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.tp-scroll::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 99px;
}

.tp-option {
  display: block;
  width: 100%;
  padding: 0.375rem 0;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.1s;
  border: none;
  background: none;
}

.tp-option:hover {
  background: #f3f4f6;
}

.tp-selected {
  background: #1b2c3b !important;
  color: white !important;
  font-weight: 600;
}

.tp-done {
  display: block;
  width: 100%;
  margin-top: 0.375rem;
  padding: 0.375rem;
  border: none;
  border-radius: 0.5rem;
  background: #f3f4f6;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1b2c3b;
  cursor: pointer;
  transition: background 0.1s;
}

.tp-done:hover {
  background: #e5e7eb;
}

/* Transition */
.tp-fade-enter-active,
.tp-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.tp-fade-enter-from,
.tp-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}
.tp-fade-enter-to,
.tp-fade-leave-from {
  transform: translateX(-50%) translateY(0);
}
</style>
