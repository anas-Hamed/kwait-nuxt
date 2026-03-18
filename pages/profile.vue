<script setup>
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

definePageMeta({ middleware: ['sidebase-auth'] })

const api = useApi()
const eventBus = useEventBus()
const route = useRoute()
const localePath = useLocalePath()

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
})

const favorite = computed({
  get: () => profileData.value?.favorite || [],
  set: (val) => { if (profileData.value) profileData.value.favorite = val }
})

const companies = computed({
  get: () => profileData.value?.companies || [],
  set: (val) => { if (profileData.value) profileData.value.companies = val }
})

const tabs = [
  { label: 'profile', to: '/profile' },
  { label: 'my_companies', to: '/profile/my-companies' },
  { label: 'favorite', to: '/profile/favorite' },
  { label: 'trust_company', to: '/profile/trust-company' },
]

const activeTab = computed(() => {
  const path = route.path
  const match = tabs.find(t => path.endsWith(t.to.replace('/profile', '')) && t.to !== '/profile')
  return match ? match.to : '/profile'
})

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
    <Tabs :model-value="activeTab" class="mb-3 md:mb-0">
      <TabsList class="flex flex-col md:flex-row flex-wrap h-auto bg-transparent gap-1">
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.to"
          :value="tab.to"
          as-child
        >
          <LLink :to="tab.to" class="px-4 py-2">{{ $t(tab.label) }}</LLink>
        </TabsTrigger>
      </TabsList>
    </Tabs>
    <NuxtPage :companies="companies" :favorite="favorite"/>
  </div>
</template>

<script>
export default {
  name: 'Profile',
};
</script>

<style scoped>
</style>
