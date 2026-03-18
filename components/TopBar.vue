<template>
  <div class="w-full bg-primary text-white">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-1.5">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <template v-for="social in socialLinks" :key="social.key">
            <a v-if="setting[social.key]" :href="setting[social.key]" target="_blank"
               class="inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors">
              <span class="w-4 h-4" v-html="socialIcons[social.key]" />
            </a>
          </template>
        </div>
        <Separator orientation="vertical" class="h-4 bg-white/30 hidden md:block" />
        <LangSwitch />
      </div>
      <div class="hidden md:flex items-center gap-4 text-sm">
        <a v-if="setting.phone" :href="`tel:${setting.phone}`" dir="ltr" class="flex items-center gap-1.5 hover:text-secondary transition-colors">
          <Phone :size="14" />
          <span dir="ltr">{{ setting.phone }}</span>
        </a>
        <Separator v-if="setting.phone && setting.email" orientation="vertical" class="h-4 bg-white/30" />
        <a v-if="setting.email" :href="`mailto:${setting.email}`" dir="ltr" class="flex items-center gap-1.5 hover:text-secondary transition-colors">
          <Mail :size="14" />
          <span dir="ltr">{{ setting.email }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Phone, Mail } from 'lucide-vue-next'
import { socialIcons } from '~/helpers/SocialIcons'
import { Separator } from '~/components/ui/separator'

const socialLinks = [
  { key: 'facebook' },
  { key: 'twitter' },
  { key: 'youtube' },
  { key: 'linkedin' },
  { key: 'snapchat' },
  { key: 'instagram' },
]
</script>
