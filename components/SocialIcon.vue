<template>
  <div v-if="url" class="p-1">
    <a target="_blank" :href="url"
       class="rounded-full bg-white/10 hover:bg-secondary text-white w-10 h-10 flex items-center justify-center transition-colors">
      <span class="w-5 h-5" v-html="socialIcons[icon]" />
    </a>
  </div>
</template>

<script setup>
import { socialIcons } from '~/helpers/SocialIcons'

defineProps({
  url: { type: String, default: '' },
  icon: { type: String, required: true },
})
</script>
