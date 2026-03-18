<script setup>
import { debounce } from 'lodash-es'

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
    const data = await api.get('company', {
      offset: offset.value,
      limit: limit.value,
      ...route.query
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

onMounted(() => {
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
  <div>
    <div v-if="activeCategory != null" class="card">
      <div class="flex items-center">
        <div class="rounded-full border-2 border-secondary relative p-1">
          <ImagePlaceholder :circle-image="true" :image="activeCategory.image" class="w-24 md:w-32 h-24 md:h-32" />
        </div>
        <div class="p-4">
          <p class="text-2xl md:text-4xl">{{activeCategory.name }}</p>
          <p v-if="activeCategory.parent" class="text-sm text-gray-400">{{activeCategory.parent.name}}</p>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="flex items-center">
        <div class="rounded-full border-2 border-secondary relative p-1">
          <ImagePlaceholder :circle-image="true" :image="defaultImage" class="w-24 md:w-32 h-24 md:h-32" />
        </div>
        <div class="p-4">
          <p class="text-2xl md:text-4xl">{{$t('app_name')}}</p>
          <p class="text-sm text-gray-400">{{$t('all_companies')}}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap mt-8">
      <FilterMenu :categories="categories" @setCategory="setCategory" />
      <div class="w-full lg:w-3/4">
        <SearchInput :value="companySearch" class="mx-auto my-2 lg:my-0" :placeholder="$t('search_for_company')"
                     @input="getSearch" />
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
            <div v-if="allLoaded && companies.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('no_result') }}
            </div>
            <div v-if="allLoaded && companies.length > 0" class="text-center py-4 text-gray-500">
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

<style scoped>
</style>
