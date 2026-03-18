<template>
  <div>
    <Sheet v-model:open="opened">
      <SheetTrigger as-child>
        <Button variant="ghost" size="icon" class="relative rounded-full">
          <Menu :size="24" />
          <span v-if="unread_notifications" class="absolute top-1 end-1 w-2 h-2 bg-red-500 rounded-full animate-pulse-soft" />
        </Button>
      </SheetTrigger>
      <SheetContent :side="sheetSide" class="w-[300px] p-0 border-0">
        <!-- Profile Header -->
        <div class="bg-gradient-to-br from-primary to-[#0f1c27] p-6 text-white">
          <template v-if="isAuthenticated">
            <LLink :to="{ name: 'profile' }" class="flex items-center gap-3" @click="opened = false">
              <div class="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center ring-2 ring-secondary/50">
                <LayoutDashboard :size="22" class="text-white" />
              </div>
              <div>
                <p class="font-bold text-base">{{ authUser?.name }}</p>
                <p class="text-xs text-white/60">{{ $t('dashboard') }}</p>
              </div>
            </LLink>
            <button @click="logout" class="flex items-center gap-1.5 text-xs text-white/50 mt-3 hover:text-white/80 transition-colors">
              <LogOut :size="12" />
              <span>{{ $t('logout') }}</span>
            </button>
          </template>
          <template v-else>
            <LLink :to="{ name: 'login' }" class="flex items-center gap-3" @click="opened = false">
              <div class="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <User :size="22" class="text-secondary" />
              </div>
              <div>
                <p class="font-bold">{{ $t('login') }}</p>
                <p class="text-xs text-white/60">{{ $t('login') }} / {{ $t('register') }}</p>
              </div>
            </LLink>
          </template>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col p-3 gap-0.5">
          <LLink v-for="link in navLinks" :key="link.name" :to="{ name: link.name }" @click="opened = false"
                 class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-all">
            <component :is="link.icon" :size="18" class="text-muted-foreground" />
            {{ $t(link.label) }}
          </LLink>

          <LLink :to="{ name: 'favorite' }" @click="opened = false"
                 class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-all">
            <Heart :size="18" class="text-muted-foreground" />
            {{ $t('favorite') }}
          </LLink>

          <LLink :to="{ name: 'notification' }" @click="opened = false"
                 class="mobile-nav-link flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-all">
            <span class="flex items-center gap-3">
              <Bell :size="18" class="text-muted-foreground" />
              {{ $t('notifications') }}
            </span>
            <Badge v-if="unread_notifications" class="bg-red-500 text-white border-0 text-[10px] h-5 min-w-5 rounded-full">
              {{ unread_notifications }}
            </Badge>
          </LLink>
        </nav>

        <Separator class="mx-3" />

        <!-- Add Company CTA -->
        <div class="p-4">
          <LLink :to="{ name: 'company-create' }" @click="opened = false">
            <button class="btn-gold w-full rounded-xl py-3 text-sm flex items-center justify-center gap-2">
              <Plus :size="18" />
              {{ $t('add_company') }}
            </button>
          </LLink>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup>
import { Menu, User, LogOut, Heart, Bell, Plus, Home, Grid3X3, Building2, FileText, Info, LayoutDashboard } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Separator } from '~/components/ui/separator'

const { locale } = useI18n()
const { status, data, signOut } = useAuth()
const route = useRoute()

const opened = ref(false)
const sheetSide = computed(() => locale.value === 'ar' ? 'right' : 'left')
const isAuthenticated = computed(() => status.value === 'authenticated')
const authUser = computed(() => data.value)

const navLinks = [
  { name: 'index', label: 'home', icon: Home },
  { name: 'category', label: 'categories', icon: Grid3X3 },
  { name: 'company', label: 'companies', icon: Building2 },
  { name: 'blog', label: 'blog', icon: FileText },
  { name: 'about-us', label: 'about_us', icon: Info },
]

watch(() => route.fullPath, () => {
  opened.value = false
})

function logout() {
  signOut()
}
</script>
