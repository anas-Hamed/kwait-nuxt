<script setup>
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { ArrowRight, Building2, Star, Shield, Search } from 'lucide-vue-next'

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

const features = [
  { title: 'feature_search_title', desc: 'feature_search_desc', icon: Search },
  { title: 'feature_companies_title', desc: 'feature_companies_desc', icon: Building2 },
  { title: 'feature_reviews_title', desc: 'feature_reviews_desc', icon: Star },
  { title: 'feature_trusted_title', desc: 'feature_trusted_desc', icon: Shield },
]
</script>

<template>
  <div>
    <!-- Hero Section with clip-path notch -->
    <svg width="0" height="0" class="absolute">
      <defs>
        <clipPath id="heroClipMobile" clipPathUnits="objectBoundingBox">
          <path d="M 0.000, 0.000 L 0.120, 0.000 C 0.160, 0.000 0.180, 0.000 0.220, 0.080 C 0.245, 0.135 0.265, 0.150 0.310, 0.150 L 0.690, 0.150 C 0.735, 0.150 0.755, 0.135 0.780, 0.080 C 0.820, 0.000 0.840, 0.000 0.880, 0.000 L 1.000, 0.000 L 1.000, 1.000 L 0.000, 1.000 Z" />
        </clipPath>
        <clipPath id="heroClipDesktop" clipPathUnits="objectBoundingBox">
          <path d="M 0.000, 0.000 L 0.340, 0.000 Q 0.370, 0.000 0.390, 0.100 Q 0.410, 0.200 0.440, 0.200 L 0.560, 0.200 Q 0.590, 0.200 0.610, 0.100 Q 0.630, 0.000 0.660, 0.000 L 1.000, 0.000 L 1.000, 1.000 L 0.000, 1.000 Z" />
        </clipPath>
      </defs>
    </svg>
    <section class="hero-clipped mb-8 sm:mb-14">
      <!-- Notch Logo -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 -mt-14 sm:-mt-16 md:-mt-18 lg:-mt-20">
        <img src="~/assets/images/logo-notch.png" alt="Logo" class="w-full h-full object-contain drop-shadow-md" />
      </div>
      <div class="hero-bg hero-clipped-inner">
        <!-- Decorative corners -->
        <div class="hero-corner-tl"></div>
        <div class="hero-corner-br"></div>

        <div class="max-w-screen-md w-full mx-auto text-center relative z-10 flex flex-col items-center justify-center gap-0 pt-12 sm:pt-16">
          <p class="text-white/60 text-xs sm:text-sm font-medium tracking-widest uppercase mb-2 sm:mb-3">
            {{ $t('app_name') }}
          </p>

          <h1 class="font-cairo text-white text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
            {{ $t('hero_title') || 'Find the best companies & services in Kuwait' }}
          </h1>

          <p class="text-white/50 text-[11px] sm:text-xs md:text-sm mt-2 sm:mt-3">
            {{ $t('hero_subtitle') || 'Search for companies, categories, and services' }}
          </p>

          <form @submit.prevent="searchForResult" class="max-w-lg w-full mt-5 sm:mt-7 px-1">
            <SearchInput class="mx-auto" :placeholder="$t('search_for_category_company')" v-model="search" />
          </form>
        </div>
      </div>
    </section>

    <!-- Top Categories - Quick Access -->
    <section class="mb-8 sm:mb-14" v-if="categories.length >= 8">
      <div class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
        <LLink v-for="(category, i) in categories.slice(0, 8)" :key="`top-cat-${category.id}`"
               :class="{ 'hidden sm:flex': i >= 4 }"
               :to="category.parent_id ? { name: 'company', query: { category_id: category.id } } : { name: 'category-id', params: { id: category.id } }"
               class="flex flex-col items-center gap-2 group">
          <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-full
                      shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
            <div class="w-full h-full rounded-full overflow-hidden bg-white">
              <ImagePlaceholder :circle-image="true" :image="category.image" class="w-full h-full" />
            </div>
          </div>
          <span class="text-[11px] sm:text-xs md:text-sm font-semibold text-primary/80 group-hover:text-primary truncate max-w-[80px] sm:max-w-[100px] md:max-w-[120px] text-center transition-colors">
            {{ category.name }}
          </span>
        </LLink>
      </div>
    </section>

    <!-- Why Kuwait Explorer -->
    <section class="mb-10 sm:mb-16">
      <div class="text-center mb-6 sm:mb-10">
        <h2 class="font-cairo text-xl sm:text-2xl md:text-3xl font-bold text-primary">{{ $t('why_kuwait_explorer') }}</h2>
        <div class="hero-divider mt-3"></div>
        <p class="text-muted-foreground text-xs sm:text-sm mt-3 max-w-md mx-auto">{{ $t('why_kuwait_explorer_desc') }}</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div v-for="(feature, idx) in features" :key="idx" class="feature-card group">
          <svg class="feature-card-bg" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none">
            <path d="M16,0 L170,0 Q175,0 175,5 L175,25 Q175,42 192,42 L294,42 Q300,42 300,48 L300,184 Q300,200 284,200 L72,200 Q56,200 56,184 L56,174 Q56,148 30,148 L6,148 Q0,148 0,140 L0,16 Q0,0 16,0 Z" fill="currentColor"/>
          </svg>
          <div class="feature-card-content">
            <p class="text-white/55 text-[10px] sm:text-xs md:text-sm leading-relaxed">{{ $t(feature.desc) }}</p>
          </div>
          <div class="feature-card-title">
            <div class="bg-secondary rounded-lg sm:rounded-xl px-1.5 sm:px-3 py-1 sm:py-2 w-full h-full flex items-center justify-center shadow-sm">
              <h3 class="font-bold text-[9px] sm:text-xs md:text-sm text-primary truncate">{{ $t(feature.title) }}</h3>
            </div>
          </div>
          <div class="feature-card-icon">
            <div class="w-full h-full rounded-full bg-secondary flex items-center justify-center">
              <component :is="feature.icon" :size="14" class="text-primary sm:!w-5 sm:!h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ads Carousel -->
    <section v-if="ads.length > 0" class="mb-8 sm:mb-12">
      <Ads :ads="ads" :loading="adsLoading" />
    </section>

    <!-- Categories Section -->
    <section class="mb-10 sm:mb-16" v-if="categories.length > 0">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h2 class="section-title text-lg sm:text-2xl">{{ $t('categories') }}</h2>
        <LLink v-if="categories.length >= 10" :to="{ name: 'category' }">
          <Button variant="ghost" class="gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary rounded-full px-2 sm:px-3">
            {{ $t('show_more') }}
            <ArrowRight :size="14" />
          </Button>
        </LLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-1.5">
        <CategoryCard v-for="category in categories" :key="`category-${category.id}`" :category="category" />
      </div>
    </section>

    <!-- Blog Section -->
    <section class="mb-8 sm:mb-12" v-if="blogs.length > 0">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h2 class="section-title text-lg sm:text-2xl">{{ $t('latest_blogs') }}</h2>
        <LLink v-if="blogs.length >= 3" :to="{ name: 'blog' }">
          <Button variant="ghost" class="gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary rounded-full px-2 sm:px-3">
            {{ $t('show_more') }}
            <ArrowRight :size="14" />
          </Button>
        </LLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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

<style>
.hero-clipped {
  position: relative;
}
.hero-bg {
  background: url('~/assets/images/hero-bg.svg') center/cover no-repeat;
  position: relative;
}
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 28, 39, 0.6);
}
.hero-clipped-inner {
  clip-path: url(#heroClipMobile);
  padding: 4.5rem 1.5rem 3rem;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  overflow: hidden;
}
@media (min-width: 640px) {
  .hero-clipped-inner {
    clip-path: url(#heroClipDesktop);
    padding: 5rem 3rem 4rem;
    min-height: 380px;
  }
}
@media (min-width: 768px) {
  .hero-clipped-inner {
    padding: 5.5rem 4rem 5rem;
    min-height: 420px;
  }
}

/* Feature cards with bottom-end notch */
.feature-card {
  position: relative;
  aspect-ratio: 3/2;
}
.feature-card-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--color-primary);
}
[dir="ltr"] .feature-card-bg {
  transform: scaleX(-1);
}
.feature-card-content {
  position: relative;
  z-index: 1;
  padding: 2.5rem 0.75rem 1rem;
  color: white;
}
@media (min-width: 640px) {
  .feature-card-content {
    padding: 3.5rem 1.25rem 1.5rem;
  }
}
@media (min-width: 768px) {
  .feature-card-content {
    padding: 4rem 1.25rem 1.5rem;
  }
}
.feature-card-title {
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 2;
  padding: 0.15rem;
  width: 40%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 640px) {
  .feature-card-title {
    top: -6px;
    right: -6px;
    padding: 0.25rem;
    width: 42%;
    height: 22%;
  }
}
[dir="ltr"] .feature-card-title {
  right: auto;
  left: -4px;
}
@media (min-width: 640px) {
  [dir="ltr"] .feature-card-title {
    left: -6px;
  }
}
.feature-card-icon {
  position: absolute;
  bottom: -4px;
  left: -4px;
  z-index: 2;
  width: 14%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 640px) {
  .feature-card-icon {
    bottom: -6px;
    left: -6px;
    width: 15%;
    height: 22%;
  }
}
[dir="ltr"] .feature-card-icon {
  left: auto;
  right: -4px;
}
@media (min-width: 640px) {
  [dir="ltr"] .feature-card-icon {
    right: -6px;
  }
}
</style>
