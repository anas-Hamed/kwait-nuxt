<script setup>
import { Card, CardContent } from '~/components/ui/card'

definePageMeta({ middleware: ['sidebase-auth'] })

const api = useApi()
const eventBus = useEventBus()

const companies = ref([])
const offset = ref(0)
const limit = ref(9)
const loadingMore = ref(false)
const allLoaded = ref(false)
const loadMoreTrigger = ref(null)

async function loadMore() {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  try {
    const data = await api.get('favorite', {
      offset: offset.value,
      limit: limit.value
    })
    if (data.data.length > 0) {
      companies.value = [...companies.value, ...data.data]
      offset.value += limit.value
    } else {
      allLoaded.value = true
    }
  } catch (e) {
    allLoaded.value = true
  } finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  eventBus.on('company-un-favorite', (id) => {
    companies.value.splice(companies.value.findIndex(el => el.id === id), 1)
    if (companies.value.length === 0) {
      offset.value = 0
      allLoaded.value = false
      loadMore()
    }
  })

  if (!loadMoreTrigger.value) return
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loadingMore.value && !allLoaded.value) {
      loadMore()
    }
  })
  observer.observe(loadMoreTrigger.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <Card class="min-h-screen">
    <CardContent class="p-6">
      <div class="flex justify-between items-center">
        <h4 class="text-xl">{{$t('favorite')}}</h4>
      </div>
      <div class="px-8 mx-auto py-8">
        <div class="flex">
          <div class="w-4"></div>
          <div class="py-4 flex flex-wrap flex-auto">
            <div v-for="company in companies" :key="`company-${company.id}`" class="w-full md:w-2/4 p-1">
              <CompanyCard :company="company" class="" />
            </div>
          </div>
        </div>

        <div class="my-5">
          <client-only>
            <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4 text-center">
              <LoadingCircle :loading="true" />
            </div>
            <div v-if="allLoaded && companies.length === 0" class="text-center py-8 text-muted-foreground">
              {{ $t('no_result') }}
            </div>
            <div v-if="allLoaded && companies.length > 0" class="text-center py-4 text-muted-foreground">
              {{ $t('no_more') }}
            </div>
          </client-only>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script>
export default {
  name: 'Favorite',
};
</script>

<style scoped>
</style>
