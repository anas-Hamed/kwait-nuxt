<template>
  <div>
    <AppDownload />
    <footer class="bg-primary px-3 pt-12 text-white">
      <div class="max-w-screen-xl mx-auto">
        <ContactsIcons />
        <Separator class="bg-white/20 mb-8" />
        <div class="flex flex-wrap gap-2 py-4 mb-8 justify-center">
          <div class="w-full sm:w-1/3 text-center sm:text-start">
            <h3 class="text-xl font-bold mb-3">{{ $t('support') }}</h3>
            <ul class="text-sm font-light space-y-2">
              <li><LLink :to="{ name: 'about-us' }" class="hover:text-secondary transition-colors">{{ $t('about_us') }}</LLink></li>
              <li><LLink :to="{ name: 'privacy' }" class="hover:text-secondary transition-colors">{{ $t('privacy') }}</LLink></li>
              <li><LLink :to="{ name: 'terms' }" class="hover:text-secondary transition-colors">{{ $t('terms') }}</LLink></li>
              <li><LLink :to="{ name: 'contact-us' }" class="hover:text-secondary transition-colors">{{ $t('contact_us') }}</LLink></li>
            </ul>
          </div>
          <div class="w-full sm:w-1/3 text-center sm:text-start">
            <h3 class="text-xl font-bold mb-3">{{ $t('kuwait_explorer') }}</h3>
            <p class="text-xs font-light leading-6 text-white/70">
              {{ $t('kuwait_explorer_description') }}
            </p>
          </div>
        </div>
        <Separator class="bg-white/20" />
        <p class="text-sm text-center py-4 text-white/60" v-html="$t('copyrights') + ' ' + (new Date()).getFullYear()"></p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Separator } from '~/components/ui/separator'
</script>
