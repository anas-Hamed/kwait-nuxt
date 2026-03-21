<template>
  <div>
    <!-- Desktop NavBar -->
    <div :class="[scrolled ? 'navbar-glass' : 'navbar-solid']"
         class="sticky top-0 z-50 transition-all duration-300 lg:block hidden">
      <div class="max-w-screen-xl mx-auto flex items-center justify-between py-3 px-4">
        <LLink :to="{ name: 'index' }" class="shrink-0 transition-transform hover:scale-[1.02]">
          <img alt="Kuwait Explorer" class="w-36" src="~/assets/images/h_logo.png">
        </LLink>

        <nav class="flex items-center gap-1">
          <LLink :to="{ name: 'index' }" class="nav-pill">{{ $t('home') }}</LLink>
          <LLink :to="{ name: 'category' }" class="nav-pill">{{ $t('categories') }}</LLink>
          <LLink :to="{ name: 'company' }" class="nav-pill">{{ $t('companies') }}</LLink>
          <LLink :to="{ name: 'blog' }" class="nav-pill">{{ $t('blog') }}</LLink>
          <LLink :to="{ name: 'plans' }" class="nav-pill">{{ $t('plans') }}</LLink>
          <LLink :to="{ name: 'about-us' }" class="nav-pill">{{ $t('about_us') }}</LLink>
        </nav>

        <div class="flex items-center gap-2">
          <LLink to="/profile/add-company">
            <button class="btn-gold rounded-full px-5 py-2 text-sm flex items-center gap-1.5">
              <Plus :size="16" />
              {{ $t('add_company') }}
            </button>
          </LLink>

          <LLink :to="{ name: 'favorite' }">
            <Button variant="ghost" size="icon" class="rounded-full hover:bg-surface">
              <Heart :size="20" />
            </Button>
          </LLink>

          <LLink :to="{ name: 'notification' }">
            <Button variant="ghost" size="icon" class="rounded-full hover:bg-surface relative">
              <Bell :size="20" />
              <span v-if="unread_notifications"
                    class="absolute -top-0.5 -end-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
                {{ unread_notifications }}
              </span>
            </Button>
          </LLink>

          <LLink v-if="!isAuthenticated" :to="{ name: 'login' }">
            <Button variant="ghost" class="gap-1.5 rounded-full hover:bg-surface">
              <span class="text-sm font-bold">{{ $t('login') }}</span>
              <User :size="18" />
            </Button>
          </LLink>

          <DropdownMenu v-else>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="gap-1.5 rounded-full hover:bg-surface">
                <span class="text-sm font-bold">{{ authUser?.name }}</span>
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User :size="16" class="text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-44 rounded-lg border-none shadow-card p-1">
              <DropdownMenuItem as-child>
                <LLink :to="{ name: 'profile' }" class="flex items-center gap-2 w-full">
                  <LayoutDashboard :size="16" />
                  {{ $t('dashboard') }}
                </LLink>
              </DropdownMenuItem>
              <DropdownMenuItem class="flex items-center gap-2 text-destructive focus:text-destructive" @click="logout">
                <LogOut :size="16" />
                {{ $t('logout') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

    <!-- Mobile NavBar -->
    <div :class="[scrolled ? 'navbar-glass' : 'bg-white']"
         class="sticky top-0 z-50 transition-all duration-300 py-3 px-4 lg:hidden flex justify-between items-center">
      <NavBarMenu />
      <LLink :to="{ name: 'index' }">
        <img alt="Kuwait Explorer" class="w-32" src="~/assets/images/h_logo.png">
      </LLink>
      <LLink :to="{ name: 'notification' }">
        <Button variant="ghost" size="icon" class="rounded-full relative">
          <Bell :size="20" />
          <span v-if="unread_notifications"
                class="absolute -top-0.5 -end-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {{ unread_notifications }}
          </span>
        </Button>
      </LLink>
    </div>
  </div>
</template>

<script setup>
import { Heart, Bell, User, Plus, LogOut, LayoutDashboard } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem
} from '~/components/ui/dropdown-menu'

const { status, data, signOut } = useAuth()
const localePath = useLocalePath()

const isAuthenticated = computed(() => status.value === 'authenticated')
const authUser = computed(() => data.value)

async function logout() {
  useCookie('auth:token').value = null
  await signOut({ redirect: false })
  await navigateTo(localePath({ name: 'login' }), { external: true })
}

const scrolled = ref(false)

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 10
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
