<script setup>
import { SearchX, Loader2 } from 'lucide-vue-next'
import { Skeleton } from '~/components/ui/skeleton'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const api = useApi()

const keyword = ref(route.query.keyword || '')
const searchResult = ref([])
const offset = ref(0)
const limit = ref(12)
const loadingMore = ref(false)
const allLoaded = ref(false)
const initialLoading = ref(true)
const loadMoreTrigger = ref(null)
let observer = null

async function loadMore() {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  try {
    const data = await api.get('search', {
      offset: offset.value,
      limit: limit.value,
      search_term: route.query.keyword,
    })
    const items = data.data || []
    if (items.length > 0) {
      searchResult.value = [...searchResult.value, ...items]
      offset.value += limit.value
    }
    if (items.length < limit.value) {
      allLoaded.value = true
    }
  } catch {
    allLoaded.value = true
  } finally {
    loadingMore.value = false
    initialLoading.value = false
  }
}

function setupObserver() {
  if (observer) observer.disconnect()
  if (!loadMoreTrigger.value) return
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loadingMore.value && !allLoaded.value) {
      loadMore()
    }
  })
  observer.observe(loadMoreTrigger.value)
}

onMounted(async () => {
  await loadMore()
  await nextTick()
  setupObserver()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

watch(() => route.query.keyword, async (newKeyword) => {
  if (!newKeyword) return
  keyword.value = newKeyword
  searchResult.value = []
  offset.value = 0
  allLoaded.value = false
  initialLoading.value = true
  await loadMore()
  await nextTick()
  setupObserver()
})

function searchAgain() {
  if (!keyword.value.trim()) return
  router.push(localePath({ name: 'search', query: { keyword: keyword.value } }))
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="co-hero-wrap">
      <div class="co-hero-section !py-8 sm:!py-12 !pb-10 sm:!pb-14">
        <div class="hero-corner-tl" />
        <div class="hero-corner-br" />
        <div class="co-hero-inner">
          <h1 class="font-cairo text-white text-lg sm:text-2xl font-bold mb-1">{{ $t('search') }}</h1>
          <p class="text-white/50 text-xs sm:text-sm mb-5">
            {{ $t('search_for_category_company') }}
          </p>
          <form @submit.prevent="searchAgain" class="max-w-lg w-full mx-auto">
            <SearchInput v-model="keyword" :placeholder="$t('search_for_category_company')" />
          </form>
        </div>
      </div>
    </section>

    <!-- Results info -->
    <div v-if="!initialLoading && searchResult.length > 0" class="flex items-center justify-between mt-6 mb-3">
      <h2 class="section-title text-base sm:text-lg">
        {{ route.query.keyword }}
      </h2>
    </div>

    <!-- Skeleton loading -->
    <div v-if="initialLoading" class="search-grid mt-6">
      <div v-for="n in 8" :key="`sk-${n}`" class="co-skeleton-card">
        <Skeleton class="co-skeleton-img" />
        <div class="co-skeleton-body">
          <Skeleton class="h-3.5 w-3/4 rounded" />
          <Skeleton class="h-2.5 w-1/2 rounded mt-1.5" />
        </div>
      </div>
    </div>

    <!-- Results grid — same CompanyListCard as company page -->
    <div v-else-if="searchResult.length > 0" class="search-grid">
      <template v-for="item in searchResult" :key="item.type + '-' + item.id">
        <!-- Company items use CompanyListCard -->
        <CompanyListCard v-if="item.type === 'company'" :company="item" />

        <!-- Category items use CategoryCard-like styling -->
        <LLink v-else
          :to="item.parent_id != null
            ? { name: 'company', query: { category_id: item.id } }
            : { name: 'category-id', params: { id: item.id } }"
          class="block"
        >
          <div class="kc">
            <div class="kc-img">
              <ImagePlaceholder :image="item.image" class="kc-img-inner" />
              <div class="kc-badge">{{ $t('category') }}</div>
            </div>
            <div class="kc-info">
              <div class="kc-top">
                <h3 class="kc-title">{{ item.name }}</h3>
              </div>
            </div>
          </div>
        </LLink>
      </template>
    </div>

    <!-- Empty state -->
    <div v-else-if="!initialLoading" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <SearchX :size="32" class="text-muted-foreground" />
      </div>
      <h3 class="font-cairo text-lg font-bold text-foreground mb-1">{{ $t('no_results') }}</h3>
      <p class="text-muted-foreground text-sm max-w-xs">
        {{ $t('search_for_category_company') }}
      </p>
    </div>

    <!-- Load more trigger -->
    <div v-if="!allLoaded && !initialLoading" ref="loadMoreTrigger" class="py-6 flex justify-center">
      <Loader2 v-if="loadingMore" :size="24" class="animate-spin text-muted-foreground" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  head() {
    return this.metaBuilder(this.$t('search'))
  },
}
</script>

<style>
.search-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 0.5rem;
}
@media (min-width: 640px) {
  .search-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem 0.65rem;
  }
}
@media (min-width: 768px) {
  .search-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 1024px) {
  .search-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
