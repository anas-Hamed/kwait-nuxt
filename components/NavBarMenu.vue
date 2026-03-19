<template>
  <div>
    <Sheet v-model:open="opened">
      <SheetTrigger as-child>
        <Button variant="ghost" size="icon" class="relative rounded-full">
          <Menu :size="24" />
          <span v-if="unread_notifications" class="absolute top-1 end-1 w-2 h-2 bg-red-500 rounded-full animate-pulse-soft" />
        </Button>
      </SheetTrigger>
      <SheetContent :side="sheetSide" class="w-[280px] p-0 border-0 flex flex-col bg-white [&>button:last-of-type]:hidden">
        <!-- Header -->
        <div class="p-5 pb-4 flex items-center justify-between">
          <template v-if="isAuthenticated">
            <LLink :to="{ name: 'profile' }" class="flex items-center gap-3 min-w-0 flex-1" @click="opened = false">
              <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                {{ userInitials }}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-sm text-primary truncate">{{ authUser?.name }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ authUser?.email }}</p>
              </div>
            </LLink>
          </template>
          <template v-else>
            <LLink :to="{ name: 'login' }" class="flex items-center gap-3 min-w-0 flex-1" @click="opened = false">
              <div class="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                <User :size="18" class="text-muted-foreground" />
              </div>
              <div>
                <p class="font-bold text-sm text-primary">{{ $t('login') }}</p>
                <p class="text-xs text-muted-foreground">{{ $t('login') }} / {{ $t('register') }}</p>
              </div>
            </LLink>
          </template>
          <button @click="opened = false" class="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0">
            <X :size="16" />
          </button>
        </div>

        <Separator />

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-2">
          <LLink v-for="link in navLinks" :key="link.name" :to="{ name: link.name }" @click="opened = false"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors">
            <component :is="link.icon" :size="18" class="text-muted-foreground" />
            {{ $t(link.label) }}
          </LLink>

          <Separator class="my-2" />

          <LLink :to="{ name: 'favorite' }" @click="opened = false"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors">
            <Heart :size="18" class="text-muted-foreground" />
            {{ $t('favorite') }}
          </LLink>

          <LLink :to="{ name: 'notification' }" @click="opened = false"
                 class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors">
            <span class="flex items-center gap-3">
              <Bell :size="18" class="text-muted-foreground" />
              {{ $t('notifications') }}
            </span>
            <span v-if="unread_notifications" class="bg-red-500 text-white text-[10px] font-bold h-5 min-w-5 rounded-full flex items-center justify-center px-1.5">
              {{ unread_notifications }}
            </span>
          </LLink>

          <template v-if="isAuthenticated">
            <Separator class="my-2" />

            <LLink :to="{ name: 'profile' }" @click="opened = false"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors">
              <LayoutDashboard :size="18" class="text-muted-foreground" />
              {{ $t('dashboard') }}
            </LLink>
          </template>
        </nav>

        <!-- Footer -->
        <div class="p-3 border-t border-border space-y-2">
          <LLink :to="{ name: 'company-create' }" @click="opened = false">
            <button class="btn-gold w-full rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 font-semibold">
              <Plus :size="16" />
              {{ $t('add_company') }}
            </button>
          </LLink>

          <button v-if="isAuthenticated" @click="logout"
                  class="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors">
            <LogOut :size="16" />
            {{ $t('logout') }}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup>
import { Menu, X, User, LogOut, Heart, Bell, Plus, Home, Grid3X3, Building2, FileText, Info, LayoutDashboard } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Separator } from '~/components/ui/separator'

const { locale } = useI18n()
const { status, data, signOut } = useAuth()
const localePath = useLocalePath()
const route = useRoute()

const opened = ref(false)
const sheetSide = computed(() => locale.value === 'ar' ? 'right' : 'left')
const isAuthenticated = computed(() => status.value === 'authenticated')
const authUser = computed(() => data.value)

const userInitials = computed(() => {
  const name = authUser.value?.name || ''
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

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

async function logout() {
  useCookie('auth:token').value = null
  await signOut({ redirect: false })
  await navigateTo(localePath({ name: 'login' }), { external: true })
}
</script>
