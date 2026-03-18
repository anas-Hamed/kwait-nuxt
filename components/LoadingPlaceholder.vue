<template>
  <div>
    <Skeleton v-if="loading" :style="`padding-left: ${left}%; padding-top: ${top}%; height: 100%`" class="rounded-md" />
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import { Skeleton } from '~/components/ui/skeleton'

export default {
  name: 'LoadingPlaceHolder',
  components: { Skeleton },
  props: {
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
  },
}
</script>
