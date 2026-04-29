<template>
  <NuxtLink v-if="locale === 'en'" class="text-sm" :to="switchLocalePath('ar')">
    <Button variant="ghost" size="sm" class="text-white hover:bg-white/10 hover:text-white gap-1 px-2 h-7">
      <Globe :size="14" />
      <span>AR</span>
    </Button>
  </NuxtLink>
  <NuxtLink v-else class="text-sm" :to="switchLocalePath('en')">
    <Button variant="ghost" size="sm" class="text-white hover:bg-white/10 hover:text-white gap-1 px-2 h-7">
      <Globe :size="14" />
      <span>EN</span>
    </Button>
  </NuxtLink>
</template>

<script setup>
import { Globe } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const appStore = useAppStore()
const { $dayjs } = useNuxtApp()
const api = useApi()

watch(locale, (newLocale) => {
  $dayjs.locale(newLocale)
  api.get('setting').then((data) => {
    appStore.setSetting(data.data)
  })
})
</script>
