<script setup>
definePageMeta({ middleware: ['auth'] })

const api = useApi()
const eventBus = useEventBus()

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
    <div class="flex flex-col md:flex-row flex-wrap overflow-hidden px-1 gap-x-2 mb-3 md:mb-0">
      <LLink class="py-2 px-3 profile-link" to="/profile">{{$t('profile')}}</LLink>
      <LLink class="py-2 px-3 profile-link" to="/profile/my-companies">{{$t('my_companies')}}</LLink>
      <LLink class="py-2 px-3 profile-link" to="/profile/favorite">{{$t('favorite')}}</LLink>
      <LLink class="py-2 px-3 profile-link" to="/profile/trust-company">{{$t('trust_company')}}</LLink>
    </div>
    <NuxtPage :companies="companies" :favorite="favorite"/>
  </div>
</template>

<script>
export default {
  name: 'Profile',
};
</script>

<style scoped>
.profile-link.router-link-exact-active {
  background-color: white;
  border-top-left-radius: var(--radius-sm, 0.25rem);
  border-top-right-radius: var(--radius-sm, 0.25rem);
  box-shadow: var(--shadow-md);
}
</style>
