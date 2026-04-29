<template>
  <div v-if="setting.google_play || setting.apple_store" class="mb-16">
    <div class="max-w-screen-xl mx-auto px-3 md:px-4">
      <div class="bg-primary rounded-3xl overflow-hidden relative">
        <div class="relative z-10 px-8 md:px-14 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- Text -->
          <div class="text-center md:text-start">
            <h2 class="text-xl md:text-2xl font-bold text-white mb-1.5">{{ $t('download_app') }}</h2>
            <p class="text-white/40 text-sm">{{ $t('download_app_sub') }}</p>
          </div>

          <!-- Store badges -->
          <div class="flex items-center gap-3 shrink-0">
            <a v-if="setting.google_play" :href="setting.google_play" target="_blank"
               class="transition-transform hover:scale-105 hover:-translate-y-0.5">
              <img class="h-12 md:h-14 rounded-xl" src="~assets/images/play.png" alt="Google Play">
            </a>
            <a v-if="setting.apple_store" :href="setting.apple_store" target="_blank"
               class="transition-transform hover:scale-105 hover:-translate-y-0.5">
              <img class="h-12 md:h-14 rounded-xl" src="~assets/images/store.png" alt="App Store">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppDownload',
}
</script>
