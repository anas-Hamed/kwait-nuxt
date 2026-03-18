<template>
  <div>
    <!-- Gold accent line -->
    <div class="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />

    <footer class="bg-gradient-to-b from-primary to-[#0f1c27] px-4 pt-14 pb-6 text-white">
      <div class="max-w-screen-xl mx-auto">

        <!-- Footer Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          <!-- Brand Column -->
          <div class="sm:col-span-2 lg:col-span-1">
            <img src="~/assets/images/h_logo.png" alt="Kuwait Explorer" class="w-36 mb-4 brightness-0 invert opacity-90">
            <p class="text-sm text-white/50 leading-relaxed max-w-xs">
              {{ $t('kuwait_explorer_description') }}
            </p>
            <!-- Social Icons -->
            <div class="flex items-center gap-1 mt-5">
              <template v-for="social in socialLinks" :key="social.key">
                <a v-if="setting[social.key]" :href="setting[social.key]" target="_blank"
                   class="w-9 h-9 rounded-full bg-white/8 hover:bg-secondary flex items-center justify-center text-white/70 hover:text-primary transition-all duration-200">
                  <span class="w-4 h-4" v-html="socialIcons[social.key]" />
                </a>
              </template>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider mb-4 text-white/90">{{ $t('categories') }}</h3>
            <ul class="space-y-2.5">
              <li><LLink :to="{ name: 'category' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('categories') }}</LLink></li>
              <li><LLink :to="{ name: 'company' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('companies') }}</LLink></li>
              <li><LLink :to="{ name: 'blog' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('blog') }}</LLink></li>
              <li><LLink :to="{ name: 'company-create' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('add_company') }}</LLink></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider mb-4 text-white/90">{{ $t('support') }}</h3>
            <ul class="space-y-2.5">
              <li><LLink :to="{ name: 'about-us' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('about_us') }}</LLink></li>
              <li><LLink :to="{ name: 'privacy' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('privacy') }}</LLink></li>
              <li><LLink :to="{ name: 'terms' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('terms') }}</LLink></li>
              <li><LLink :to="{ name: 'contact-us' }" class="text-sm text-white/50 hover:text-secondary transition-colors">{{ $t('contact_us') }}</LLink></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider mb-4 text-white/90">{{ $t('contact_us') }}</h3>
            <ul class="space-y-3">
              <li v-if="setting.phone">
                <a :href="`tel:${setting.phone}`" dir="ltr" class="flex items-center gap-2.5 text-sm text-white/50 hover:text-secondary transition-colors">
                  <div class="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
                    <Phone :size="14" />
                  </div>
                  <span dir="ltr">{{ setting.phone }}</span>
                </a>
              </li>
              <li v-if="setting.email">
                <a :href="`mailto:${setting.email}`" dir="ltr" class="flex items-center gap-2.5 text-sm text-white/50 hover:text-secondary transition-colors">
                  <div class="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
                    <Mail :size="14" />
                  </div>
                  <span dir="ltr">{{ setting.email }}</span>
                </a>
              </li>
              <li v-if="setting.website">
                <a :href="setting.website" target="_blank" dir="ltr" class="flex items-center gap-2.5 text-sm text-white/50 hover:text-secondary transition-colors">
                  <div class="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
                    <Globe :size="14" />
                  </div>
                  <span dir="ltr">{{ setting.website }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <Separator class="bg-white/10 mb-5" />
        <p class="text-xs text-center text-white/30" v-html="$t('copyrights') + ' ' + (new Date()).getFullYear()"></p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Phone, Mail, Globe } from 'lucide-vue-next'
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
