<script setup>
import { Checkbox } from '~/components/ui/checkbox'

defineProps({
  days: { type: Array, required: true },
  readOnly: { type: Boolean, default: false },
})
</script>

<template>
  <div class="wt-table">
    <!-- Header -->
    <div class="wt-header">
      <div class="wt-col-day">{{ $t('day') || 'Day' }}</div>
      <div class="wt-col-time">{{ $t('from') }}</div>
      <div class="wt-col-time">{{ $t('to') }}</div>
      <div class="wt-col-check" v-if="!readOnly">{{ $t('active') || 'Active' }}</div>
    </div>

    <!-- Rows -->
    <div
      v-for="day in days"
      :key="`day-${day.day}`"
      class="wt-row"
      :class="{ 'wt-row-inactive': !day.active }"
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
          <Checkbox
            :id="`day-active-${day.day}`"
            :checked="day.active"
            @update:checked="day.active = $event"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.wt-table {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.wt-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  background: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
}

.wt-header > div {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.wt-row {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  transition: opacity 0.2s;
}

.wt-row:not(:last-child) {
  border-bottom: 1px solid #f8f8f8;
}

.wt-row-inactive {
  opacity: 0.4;
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

/* Day badge */
.wt-day-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  width: 100%;
}

.wt-day-active {
  background: #1b2c3b;
  color: white;
}

.wt-day-off {
  background: #f1f3f5;
  color: #9ca3af;
}

/* Time input */
.wt-time-input {
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
  text-align: center;
  outline: none;
  transition: border-color 0.15s;
}

.wt-time-input:focus {
  border-color: #1b2c3b;
}

.wt-time-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Read-only displays */
.wt-time-display {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1b2c3b;
}

.wt-time-off {
  font-size: 0.8125rem;
  color: #d1d5db;
}

@media (max-width: 640px) {
  .wt-col-day {
    width: 80px;
    padding: 0 0.5rem;
  }
  .wt-day-badge {
    font-size: 0.625rem;
    padding: 0.2rem 0.375rem;
  }
  .wt-time-input {
    max-width: 90px;
    font-size: 0.75rem;
  }
}
</style>
