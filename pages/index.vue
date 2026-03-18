<script setup>
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { ArrowRight } from 'lucide-vue-next'

const api = useApi()
const router = useRouter()
const localePath = useLocalePath()

const { data: mainData } = await useAsyncData('main', async () => {
  const res = await api.get('main', { limit: 10 })
  return res.data
})

const ads = computed(() => mainData.value?.ads || [])
const categories = computed(() => mainData.value?.categories || [])
const blogs = computed(() => mainData.value?.blogs || [])
</script>

<template>
  <div>
    <!-- Top Categories - Quick Access -->
    <section class="mb-6" v-if="categories.length >= 8">
      <div class="flex justify-between">
        <LLink v-for="category in categories.slice(0, 8)" :key="`top-cat-${category.id}`"
               :to="category.parent_id ? { name: 'company', query: { category_id: category.id } } : { name: 'category-id', params: { id: category.id } }"
               class="flex flex-col items-center gap-2 group flex-1">
          <div class="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full p-[2px] bg-gradient-to-br from-secondary to-secondary/60
                      shadow-sm group-hover:shadow-md group-hover:shadow-secondary/20 transition-all duration-300 group-hover:scale-105">
            <div class="w-full h-full rounded-full overflow-hidden bg-white">
              <ImagePlaceholder :circle-image="true" :image="category.image" class="w-full h-full" />
            </div>
          </div>
          <span class="text-xs md:text-sm font-semibold text-primary/80 group-hover:text-primary truncate max-w-[100px] md:max-w-[120px] text-center transition-colors">
            {{ category.name }}
          </span>
        </LLink>
      </div>
    </section>

    <!-- Hero Section -->
    <section class="hero-gradient rounded-3xl px-6 md:px-10 py-12 md:py-16 mb-14 relative z-0 shadow-card flex items-center justify-center">
      <div class="max-w-screen-sm w-full mx-auto text-center relative z-10 flex flex-col items-center justify-center gap-0">
        <img class="max-w-[320px] md:max-w-[400px] w-10/12"
             src="~/assets/images/logo-white.svg" alt="Kuwait Explorer">

        <p class="text-white/55 text-xs md:text-sm max-w-sm leading-6 tracking-wide -mt-7">
          {{ $t('kuwait_explorer_description') || 'Discover the best companies and services in Kuwait' }}
        </p>

        <form @submit.prevent="searchForResult" class="max-w-md w-full mt-10">
          <SearchInput class="mx-auto" :placeholder="$t('search_for_category_company')" v-model="search" />
        </form>
      </div>
    </section>

    <!-- Ads Carousel -->
    <section v-if="ads.length > 0" class="mb-12">
      <Ads :ads="ads" :loading="adsLoading" />
    </section>

    <!-- Categories Section -->
    <section class="mb-16" v-if="categories.length > 0">
      <div class="flex items-center justify-between mb-6">
        <h2 class="section-title">{{ $t('categories') }}</h2>
        <LLink v-if="categories.length >= 10" :to="{ name: 'category' }">
          <Button variant="ghost" class="gap-1.5 text-sm text-muted-foreground hover:text-primary rounded-full">
            {{ $t('show_more') }}
            <ArrowRight :size="14" />
          </Button>
        </LLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
        <CategoryCard v-for="category in categories" :key="`category-${category.id}`" :category="category" />
      </div>
    </section>

    <!-- Blog Section -->
    <section class="mb-12" v-if="blogs.length > 0">
      <div class="flex items-center justify-between mb-6">
        <h2 class="section-title">{{ $t('latest_blogs') }}</h2>
        <LLink v-if="blogs.length >= 3" :to="{ name: 'blog' }">
          <Button variant="ghost" class="gap-1.5 text-sm text-muted-foreground hover:text-primary rounded-full">
            {{ $t('show_more') }}
            <ArrowRight :size="14" />
          </Button>
        </LLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-1">
        <BlogCard v-for="blog in blogs" :key="`blog-${blog.id}`" :blog="blog" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      search: '',
      searchResult: [],
      loading: false,
      noResults: false,
      showResults: false,
      adsLoading: true,
    }
  },
  head() {
    return this.metaBuilder()
  },
  mounted() {
    this.adsLoading = false
  },
  methods: {
    searchForResult() {
      if (this.search.length > 0) {
        this.$router.push(this.localePath({ name: 'search', query: { keyword: this.search } }))
      }
    },
  },
}
</script>
