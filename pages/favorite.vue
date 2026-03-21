<script setup>
import { Heart } from 'lucide-vue-next'
import { Skeleton } from '~/components/ui/skeleton'

definePageMeta({ middleware: ['sidebase-auth'] })

const api = useApi()
const eventBus = useEventBus()

const companies = ref([])
const offset = ref(0)
const limit = ref(9)
const loadingMore = ref(false)
const allLoaded = ref(false)
const initialLoading = ref(true)
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
    initialLoading.value = false
  }
}

let observer = null

onMounted(() => {
  loadMore()

  eventBus.on('company-un-favorite', (id) => {
    companies.value.splice(companies.value.findIndex(el => el.id === id), 1)
    if (companies.value.length === 0) {
      offset.value = 0
      allLoaded.value = false
      loadMore()
    }
  })
})

watch(loadMoreTrigger, (el) => {
  if (el) {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore.value && !allLoaded.value) {
        loadMore()
      }
    })
    observer.observe(el)
  }
}, { immediate: true })

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="fv-header">
      <Heart :size="20" class="text-secondary fill-secondary" />
      <h1 class="fv-title">{{ $t('favorite') }}</h1>
    </div>

    <!-- Grid -->
    <div class="fv-grid">
      <CompanyCard v-for="company in companies" :key="`company-${company.id}`" :company="company" />
    </div>

    <!-- Skeleton -->
    <div v-if="initialLoading" class="fv-grid">
      <div v-for="n in 6" :key="`sk-${n}`" class="fv-skeleton">
        <Skeleton class="fv-sk-img" />
        <div class="fv-sk-body">
          <Skeleton class="h-3.5 w-3/4 rounded" />
          <Skeleton class="h-2.5 w-1/2 rounded mt-1.5" />
        </div>
      </div>
    </div>

    <client-only>
      <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4"></div>

      <div v-if="allLoaded && companies.length === 0" class="fv-empty">
        <Heart :size="52" class="text-muted-foreground opacity-20" />
        <p>{{ $t('no_result') }}</p>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'Favorite',
};
</script>

<style>
/* Header */
.fv-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}
.fv-title {
  font-family: 'Cairo', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
}

/* Grid */
.fv-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 0.5rem;
}

@media (min-width: 640px) {
  .fv-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem 0.65rem;
  }
}

/* Skeleton */
.fv-skeleton {
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
}
.fv-sk-img {
  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: 0.75rem;
  background: #e2e8f0 !important;
}
.fv-sk-body {
  padding: 0.55rem 0.25rem 0.35rem;
}
.fv-sk-body > * {
  background: #e2e8f0 !important;
}

/* Empty */
.fv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}
.fv-empty p {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  opacity: 0.5;
  margin-top: 0.75rem;
}
</style>
