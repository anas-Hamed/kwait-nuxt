<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

const props = defineProps({
  days: { type: Array, required: true },
  readOnly: { type: Boolean, default: false },
})

const allActive = computed(() => props.days.length > 0 && props.days.every(d => d.active))
const someActive = computed(() => props.days.some(d => d.active))

function toggleAll() {
  const target = !allActive.value
  props.days.forEach(d => { d.active = target })
}
</script>

<template>
  <div class="wt-table">
    <!-- Header -->
    <div class="wt-header">
      <div class="wt-col-day">{{ $t('day') || 'Day' }}</div>
      <div class="wt-col-time">{{ $t('from') }}</div>
      <div class="wt-col-time">{{ $t('to') }}</div>
      <div v-if="!readOnly" class="wt-col-check">
        <button
          type="button"
          class="wt-bulk-toggle"
          :class="{ 'wt-bulk-toggle--active': allActive, 'wt-bulk-toggle--partial': someActive && !allActive }"
          :aria-label="$t('activate_all_days') || 'Toggle all days'"
          :title="allActive ? ($t('deactivate_all') || 'Deactivate all') : ($t('activate_all_days') || 'Activate all')"
          @click="toggleAll"
        >
          <Check :size="12" class="wt-bulk-toggle-icon" />
        </button>
      </div>
    </div>

    <!-- Rows -->
    <div
      v-for="day in days"
      :key="`day-${day.day}`"
      class="wt-row"
    >
      <!-- Day name -->
      <div class="wt-col-day">
        <span class="wt-day-badge" :class="day.active ? 'wt-day-active' : 'wt-day-off'">
          {{ $t(`day_${day.day}`) }}
        </span>
      </div>

      <!-- Read-only mode -->
      <template v-if="readOnly">
        <div class="wt-col-time">
          <span v-if="day.active" class="wt-time-display">{{ day.start_time }}</span>
          <span v-else class="wt-time-off">--:--</span>
        </div>
        <div class="wt-col-time">
          <span v-if="day.active" class="wt-time-display">{{ day.end_time }}</span>
          <span v-else class="wt-time-off">--:--</span>
        </div>
      </template>

      <!-- Editable mode -->
      <template v-else>
        <div class="wt-col-time">
          <TimePicker
            :model-value="day.start_time"
            @update:model-value="day.start_time = $event"
            :disabled="!day.active"
          />
        </div>
        <div class="wt-col-time">
          <TimePicker
            :model-value="day.end_time"
            @update:model-value="day.end_time = $event"
            :disabled="!day.active"
          />
        </div>
        <div class="wt-col-check">
          <label :for="`day-active-${day.day}`" class="wt-check">
            <input
              :id="`day-active-${day.day}`"
              type="checkbox"
              :checked="day.active"
              class="wt-check-input"
              @change="day.active = $event.target.checked"
            />
            <span class="wt-check-box">
              <Check :size="12" class="wt-check-icon" />
            </span>
          </label>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.wt-table {
  border-radius: 0.875rem;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04), 0 0 0 1px #f1f5f9;
  /* no overflow:hidden — would clip TimePicker dropdown on the last row */
}

.wt-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  background: #f9fafb;
  border-bottom: 1px solid #f1f5f9;
  border-radius: 0.875rem 0.875rem 0 0;
}

.wt-row:last-child {
  border-radius: 0 0 0.875rem 0.875rem;
}

.wt-header > div {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.wt-row {
  display: flex;
  align-items: center;
  padding: 0.65rem 0;
  transition: background-color 0.15s ease;
}

.wt-row:not(:last-child) {
  border-bottom: 1px solid #f1f5f9;
}

.wt-row:hover {
  background-color: #fafbfc;
}

/* Columns */
.wt-col-day {
  width: 120px;
  padding: 0 0.75rem;
  flex-shrink: 0;
}

.wt-col-time {
  flex: 1;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wt-col-check {
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Day badge — soft brand accent instead of heavy dark */
.wt-day-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  width: 100%;
  transition: all 0.2s ease;
}

.wt-day-active {
  background: #F3ECFF;
  color: #6B4DD1;
}

.wt-day-off {
  background: #f3f4f6;
  color: #9ca3af;
}

/* Row checkbox — native input, custom styled */
.wt-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 1.1rem;
  height: 1.1rem;
}
.wt-check-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}
.wt-check-box {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.3rem;
  border: 1.5px solid #d1d5db;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 180ms ease-out;
}
.wt-check-icon {
  color: transparent;
  transition: color 180ms ease-out;
}
.wt-check:hover .wt-check-box {
  border-color: #6B4DD1;
}
.wt-check-input:checked + .wt-check-box {
  background: #6B4DD1;
  border-color: #6B4DD1;
}
.wt-check-input:checked + .wt-check-box .wt-check-icon {
  color: #ffffff;
}
.wt-check-input:focus-visible + .wt-check-box {
  box-shadow: 0 0 0 3px rgba(107, 77, 209, 0.25);
}

/* Bulk toggle button in header */
.wt-bulk-toggle {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.3rem;
  border: 1.5px solid #d1d5db;
  background: #ffffff;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 180ms ease-out;
}
.wt-bulk-toggle:hover {
  border-color: #6B4DD1;
}
.wt-bulk-toggle-icon {
  color: transparent;
  transition: color 180ms ease-out;
}
.wt-bulk-toggle--partial {
  background: #F3ECFF;
  border-color: #6B4DD1;
}
.wt-bulk-toggle--partial .wt-bulk-toggle-icon {
  color: #6B4DD1;
  opacity: 0.5;
}
.wt-bulk-toggle--active {
  background: #6B4DD1;
  border-color: #6B4DD1;
}
.wt-bulk-toggle--active .wt-bulk-toggle-icon {
  color: #ffffff;
}

/* Read-only displays */
.wt-time-display {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
}

.wt-time-off {
  font-size: 0.8125rem;
  color: #d1d5db;
}

@media (max-width: 640px) {
  .wt-col-day {
    width: 90px;
    padding: 0 0.5rem;
  }
  .wt-day-badge {
    font-size: 0.68rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>
