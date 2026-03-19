<script setup>
import { LayoutDashboard, User, Building2, Heart, Shield, LogOut, Settings } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

definePageMeta({ middleware: ['sidebase-auth'] })

const api = useApi()
const eventBus = useEventBus()
const route = useRoute()
const localePath = useLocalePath()
const { data: authUser, signOut } = useAuth()

const { data: profileData } = await useAsyncData('profile-data', async () => {
  let favorite = []
  let companies = []
  try {
    const favRes = await api.get('favorite', { limit: 2, orderDirection: 'desc' })
    favorite = favRes.data || []
    const compRes = await api.get('company/mine', { orderDirection: 'desc' })
    companies = compRes.data || []
  } catch (e) {}
  return { favorite, companies }
}, { server: false })

const favorite = computed({
  get: () => profileData.value?.favorite || [],
  set: (val) => { if (profileData.value) profileData.value.favorite = val }
})

const companies = computed({
  get: () => profileData.value?.companies || [],
  set: (val) => { if (profileData.value) profileData.value.companies = val }
})

const navItems = [
  { label: 'dashboard', to: '/profile', icon: LayoutDashboard },
  { label: 'settings', to: '/profile/settings', icon: Settings },
  { label: 'my_companies', to: '/profile/my-companies', icon: Building2 },
  { label: 'favorite', to: '/profile/favorite', icon: Heart },
  { label: 'trust_company', to: '/profile/trust-company', icon: Shield },
]

const activeTab = computed(() => {
  const path = route.path.replace(/\/$/, '')
  if (path.includes('add-company')) return 'add-company'
  const match = navItems.find(t => t.to !== '/profile' && path.endsWith(t.to.replace('/profile', '')))
  return match ? match.to : '/profile'
})

const userInitials = computed(() => {
  const name = authUser.value?.name || ''
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

async function logout() {
  useCookie('auth:token').value = null
  await signOut({ redirect: false })
  await navigateTo(localePath({ name: 'login' }), { external: true })
}

onMounted(() => {
  eventBus.on('company-un-favorite', (id) => {
    const idx = favorite.value.findIndex(el => el.id === id)
    if (idx !== -1) {
      const arr = [...favorite.value]
      arr.splice(idx, 1)
      favorite.value = arr
    }
  })
  eventBus.on('company-deleted', (id) => {
    const idx = companies.value.findIndex(el => el.id === id)
    if (idx !== -1) {
      const arr = [...companies.value]
      arr.splice(idx, 1)
      companies.value = arr
    }
  })
})
</script>

<template>
  <div>
    <!-- Mobile Tabs -->
    <nav class="lg:hidden mb-4 overflow-x-auto scrollbar-hide">
      <div class="flex gap-2 pb-1">
        <LLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all"
          :class="activeTab === item.to
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-muted-foreground border-border'"
        >
          <component :is="item.icon" :size="14" />
          {{ $t(item.label) }}
        </LLink>
      </div>
    </nav>

    <div class="flex flex-col lg:flex-row gap-6 min-h-[70vh]">
      <!-- Desktop Sidebar -->
      <aside class="hidden lg:block w-64 shrink-0">
        <div class="bg-white rounded-2xl shadow-soft p-5 sticky top-24">
          <!-- User Info -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {{ userInitials }}
            </div>
            <div class="min-w-0">
              <p class="font-bold text-sm text-primary truncate">{{ authUser?.name }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ authUser?.email }}</p>
            </div>
          </div>

          <!-- Nav -->
          <nav class="flex flex-col gap-1">
            <LLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              :class="activeTab === item.to
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-surface hover:text-primary'"
            >
              <component :is="item.icon" :size="18" />
              {{ $t(item.label) }}
            </LLink>

            <div class="border-t border-border mt-3 pt-3">
              <button
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-all w-full"
                @click="logout"
              >
                <LogOut :size="18" />
                {{ $t('logout') }}
              </button>
            </div>
          </nav>
        </div>
      </aside>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <NuxtPage :companies="companies" :favorite="favorite" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
};
</script>
