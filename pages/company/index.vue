<script setup>
import { debounce } from 'lodash-es'
import { Building2 } from 'lucide-vue-next'
import { Skeleton } from '~/components/ui/skeleton'

const api = useApi()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const { data: categories } = await useAsyncData('company-categories', async () => {
  const res = await api.get('category', { all: true })
  return res.data || []
})

const category_id = ref(Number(route.query.category_id) || null)
const companySearch = ref(route.query.keyword || '')
const companies = ref([])
const offset = ref(0)
const limit = ref(9)
const loadingMore = ref(false)
const allLoaded = ref(false)
const initialLoading = ref(true)
const loadMoreTrigger = ref(null)

const activeCategory = computed(() => {
  const cat = categories.value?.find(el => el.id === Number(route.query.category_id))
  if (cat) cat.parent = categories.value?.find(el => el.id === cat.parent_id)
  return cat
})

async function loadMore() {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  try {
    const res = await api.get('company', {
      offset: offset.value,
      limit: limit.value,
      ...route.query
    })
    const items = res?.data || res || []
    if (Array.isArray(items) && items.length > 0) {
      companies.value = [...companies.value, ...items]
      offset.value += limit.value
    } else {
      allLoaded.value = true
    }
  } catch (e) {
    console.error('Failed to load companies:', e)
    allLoaded.value = true
  } finally {
    loadingMore.value = false
    initialLoading.value = false
  }
}

function setCategory(v) {
  category_id.value = v
}

const getSearch = debounce(function(value) {
  companySearch.value = value
  if (route.query.keyword !== value && value.length > 3) {
    router.replace(localePath({
      name: 'company',
      query: { ...route.query, keyword: value }
    }))
  }
}, 500)

watch(category_id, (value) => {
  if (route.query.category_id !== String(value)) {
    router.replace(localePath({
      name: 'company',
      query: { ...route.query, category_id: value }
    }))
  }
})

watch(companySearch, (value) => {
  if (route.query.keyword !== value) {
    router.replace(localePath({
      name: 'company',
      query: { ...route.query, keyword: value }
    }))
  }
})

watch(() => route.query, debounce(() => {
  offset.value = 0
  companies.value = []
  allLoaded.value = false
  initialLoading.value = true
  nextTick(() => loadMore())
}, 300), { deep: true })

let observer = null

onMounted(() => {
  loadMore()
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
    <!-- Premium Hero Header with bottom notch -->
    <section class="co-hero-wrap">
      <!-- SVG clip-path for bottom-center notch -->
      <svg width="0" height="0" class="absolute">
        <defs>
          <clipPath id="coHeroClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.720,1 Q 0.690,1 0.670,0.850 Q 0.650,0.650 0.620,0.650 L 0.380,0.650 Q 0.350,0.650 0.330,0.850 Q 0.310,1 0.280,1 L 0,1 Z" />
          </clipPath>
          <clipPath id="coHeroClipMobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.920,1 Q 0.870,1 0.840,0.850 Q 0.810,0.680 0.770,0.680 L 0.230,0.680 Q 0.190,0.680 0.160,0.850 Q 0.130,1 0.080,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div class="co-hero-section">
        <div class="hero-corner-tl"></div>
        <div class="hero-corner-br"></div>

        <div class="co-hero-inner">
          <p v-if="activeCategory?.parent" class="text-white/50 text-xs mb-0.5">{{ activeCategory.parent.name }}</p>
          <h1 class="font-cairo text-white text-2xl sm:text-3xl font-bold">
            {{ activeCategory?.name || $t('all_companies') }}
          </h1>
        </div>
      </div>

      <!-- Search bar in the notch -->
      <div class="co-hero-notch-search">
        <SearchInput v-model="companySearch" :placeholder="$t('search_for_category_company')" light small class="co-notch-input" />
      </div>
    </section>

    <!-- Body -->
    <div class="flex flex-wrap mt-6 gap-y-4">
      <FilterMenu :categories="categories" @setCategory="setCategory" />
      <div class="w-full lg:w-3/4">
        <div class="co-companies-grid">
          <CompanyListCard v-for="company in companies" :key="`company-${company.id}`" :company="company" />
        </div>

        <!-- Skeleton: renders on SSR instantly -->
        <div v-if="initialLoading" class="co-companies-grid">
          <div v-for="n in 9" :key="`sk-${n}`" class="co-skeleton-card">
            <Skeleton class="co-skeleton-img" />
            <div class="co-skeleton-body">
              <Skeleton class="h-3.5 w-3/4 rounded" />
              <Skeleton class="h-2.5 w-1/2 rounded mt-1.5" />
            </div>
          </div>
        </div>

        <client-only>
          <!-- Infinite scroll trigger -->
          <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4"></div>

          <!-- Empty state -->
          <div v-if="allLoaded && companies.length === 0" class="co-empty-state">
            <Building2 :size="52" class="text-secondary opacity-40" aria-hidden="true" />
            <p>{{ $t('no_result') }}</p>
          </div>

        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyIndex',
  head() {
    return this.metaBuilder(this.activeCategory != null ? this.activeCategory?.name : this.$t('all_companies'), null, this.activeCategory?.image);
  },
};
</script>

<style>
/* ── Premium Hero Header ── */
.co-hero-wrap {
  position: relative;
  margin-bottom: 1.5rem;
}

.co-hero-section {
  background: url('~/assets/images/hero-bg.svg') center/cover no-repeat;
  border-radius: 1.25rem;
  padding: 2.5rem 1.5rem 5rem;
  position: relative;
  overflow: hidden;
  clip-path: url(#coHeroClipMobile);
}

@media (min-width: 640px) {
  .co-hero-section {
    clip-path: url(#coHeroClip);
  }
}
.co-hero-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 28, 39, 0.6);
}

.co-hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

/* Search bar positioned in the bottom notch */
.co-hero-notch-search {
  position: absolute;
  bottom: -0.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  min-width: 200px;
  max-width: 360px;
  z-index: 10;
}

@media (max-width: 639px) {
  .co-hero-notch-search {
    width: 46%;
    min-width: 160px;
    max-width: 220px;
  }
}

/* Notch search input styling */
.co-notch-input input {
  background: white !important;
  border: 1.5px solid var(--color-border) !important;
  box-shadow: 0 2px 8px rgba(27, 44, 59, 0.08);
  color: var(--color-primary) !important;
}
.co-notch-input input::placeholder {
  color: var(--color-muted-foreground) !important;
}

/* ── Companies Grid ── */
.co-companies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 0.5rem;
  padding: 0.5rem 0.25rem 0;
}

@media (min-width: 640px) {
  .co-companies-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem 0.65rem;
  }
}

/* ── Skeleton Cards ── */
.co-skeleton-card {
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
}
.co-skeleton-img {
  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: 0.75rem;
  background: #e2e8f0 !important;
}
.co-skeleton-body {
  padding: 0.55rem 0.25rem 0.35rem;
}
.co-skeleton-body > * {
  background: #e2e8f0 !important;
}

/* ── Empty State ── */
.co-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1rem;
  color: var(--color-muted-foreground);
  opacity: 0.5;
  text-align: center;
}
.co-empty-state p {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.75rem;
}
</style>
