<template>
  <div class="space-y-1.5">
    <!-- Read-only mode -->
    <template v-if="readOnly">
      <div v-for="day in days" :key="`day-${day.day}`"
           class="flex items-center rounded-md overflow-hidden border border-border">
        <div class="w-24 text-center py-2 text-sm font-medium"
             :class="[day.active ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground']">
          {{ $t(`day_${day.day}`) }}
        </div>
        <div class="flex-auto bg-card flex justify-evenly py-2 text-sm">
          <template v-if="day.active">
            <span class="text-muted-foreground">{{ $t('from') }}</span>
            <span class="font-medium">{{ day.start_time }}</span>
          </template>
          <template v-else>
            <span class="text-muted-foreground">----</span>
          </template>
          <Separator orientation="vertical" class="h-5" />
          <template v-if="day.active">
            <span class="text-muted-foreground">{{ $t('to') }}</span>
            <span class="font-medium">{{ day.end_time }}</span>
          </template>
          <template v-else>
            <span class="text-muted-foreground">----</span>
          </template>
        </div>
      </div>
    </template>

    <!-- Editable mode -->
    <div v-else v-for="day in days" :key="`day-${day.day}`"
         class="flex flex-wrap items-center rounded-md overflow-hidden border border-border transition-opacity"
         :class="{ 'opacity-50': !day.active }">
      <div class="w-full md:w-24 bg-secondary text-secondary-foreground text-center py-2 text-sm font-medium">
        {{ $t(`day_${day.day}`) }}
      </div>
      <div class="flex w-full md:w-auto flex-auto items-center">
        <div class="flex-auto bg-card flex items-center justify-evenly py-2 gap-2 px-2">
          <Label :for="`day-start-${day.day}`" class="flex items-center gap-1.5 text-sm">
            <span class="text-muted-foreground">{{ $t('from') }}</span>
            <Input :id="`day-start-${day.day}`" v-model="day.start_time" type="time" class="w-auto h-8 bg-accent" />
          </Label>
          <Separator orientation="vertical" class="h-5" />
          <Label :for="`day-end-${day.day}`" class="flex items-center gap-1.5 text-sm">
            <span class="text-muted-foreground">{{ $t('to') }}</span>
            <Input :id="`day-end-${day.day}`" v-model="day.end_time" type="time" class="w-auto h-8 bg-accent" />
          </Label>
        </div>
        <div class="w-16 bg-card flex items-center justify-center py-2">
          <Checkbox :id="`day-active-${day.day}`" :checked="day.active" @update:checked="day.active = $event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Checkbox } from '~/components/ui/checkbox'
import { Separator } from '~/components/ui/separator'

defineProps({
  days: { type: Array, required: true },
  readOnly: { type: Boolean, default: false },
})
</script>
