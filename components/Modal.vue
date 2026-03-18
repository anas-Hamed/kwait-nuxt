<template>
  <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-md">
      <slot />
    </DialogContent>
  </Dialog>
</template>

<script>
import { Dialog, DialogContent } from '~/components/ui/dialog'

export default {
  name: 'Modal',
  components: { Dialog, DialogContent },
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
}
</script>
