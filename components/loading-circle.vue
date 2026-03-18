<template>
  <div class="mx-auto text-center">
    <div v-if="loading" class="flex items-center justify-center">
      <Loader2 :size="24" class="animate-spin" />
    </div>
    <slot v-else />
  </div>
</template>

<script>
import { Loader2 } from 'lucide-vue-next'

export default {
  name: 'LoadingCircle',
  components: { Loader2 },
  props: {
    loading: { type: Boolean, default: false },
  },
}
</script>
