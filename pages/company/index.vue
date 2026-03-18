<script setup>
import { debounce } from 'lodash-es'
import { Building2 } from 'lucide-vue-next'

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
const loadMoreTrigger = ref(null)

const activeCategory = computed(() => {
  const cat = categories.value?.find(el => el.id === Number(route.query.category_id))
  if (cat) cat.parent = categories.value?.find(el => el.id === cat.parent_id)
  return cat
})

const defaultImage = computed(() => {
  return new URL('~/assets/images/logo.png', import.meta.url).href
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
  nextTick(() => loadMore())
}, 1000), { deep: true })

let observer = null

onMounted(() => {
  // Initial load
  loadMore()
})

// Watch for loadMoreTrigger to become available (it's inside <client-only>)
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
    <!-- Header Card -->
    <div class="co-hero" v-if="activeCategory != null">
      <div class="co-hero-img">
        <ImagePlaceholder :circle-image="true" :image="activeCategory.image" class="w-full h-full" />
      </div>
      <div>
        <h1 class="co-hero-title">{{ activeCategory.name }}</h1>
        <p v-if="activeCategory.parent" class="co-hero-sub">{{ activeCategory.parent.name }}</p>
      </div>
    </div>
    <div class="co-hero" v-else>
      <div class="co-hero-img">
        <ImagePlaceholder :circle-image="true" :image="defaultImage" class="w-full h-full" />
      </div>
      <div>
        <h1 class="co-hero-title">{{ $t('app_name') }}</h1>
        <p class="co-hero-sub">{{ $t('all_companies') }}</p>
      </div>
    </div>

    <!-- Body -->
    <div class="flex flex-wrap mt-6 gap-y-4">
      <FilterMenu :categories="categories" @setCategory="setCategory" />
      <div class="w-full lg:w-3/4">
        <div class="co-companies-wrap">
          <div class="co-companies-grid">
            <div v-for="company in companies" :key="`company-${company.id}`" class="p-1">
              <CompanyCard :company="company" />
            </div>
          </div>
        </div>

        <div class="my-5">
          <client-only>
            <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4 text-center">
              <LoadingCircle :loading="true" />
            </div>
            <div v-if="allLoaded && companies.length === 0" class="co-empty-state">
              <Building2 :size="52" aria-hidden="true" />
              <p>{{ $t('no_result') }}</p>
            </div>
            <div v-if="allLoaded && companies.length > 0" class="text-center py-4 text-sm text-muted-foreground">
              {{ $t('no_more') }}
            </div>
          </client-only>
        </div>
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
/* ── Hero Header ── */
.co-hero {
  background: white;
  border-radius: 1.25rem;
  box-shadow: var(--shadow-soft);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.co-hero-img {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary), transparent);
  flex-shrink: 0;
}
.co-hero-img > * {
  border-radius: 50%;
  overflow: hidden;
  background: white;
}
.co-hero-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.3;
}
.co-hero-sub {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  margin-top: 0.1rem;
}

/* ── Companies Grid ── */
.co-companies-wrap {
  padding-top: 0.75rem;
}
.co-companies-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
}
@media (min-width: 768px) {
  .co-companies-grid { grid-template-columns: repeat(2, 1fr); }
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
