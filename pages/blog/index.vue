<script setup>
import { debounce } from 'lodash-es'
import { Newspaper } from 'lucide-vue-next'
import { Skeleton } from '~/components/ui/skeleton'

const api = useApi()

const blogSearch = ref('')
const blogs = ref([])
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
    const params = { offset: offset.value, limit: limit.value }
    if (blogSearch.value) params.keyword = blogSearch.value
    const data = await api.get('blog', params)
    if (data.data.length > 0) {
      blogs.value = [...blogs.value, ...data.data]
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

const onSearch = debounce(() => {
  offset.value = 0
  blogs.value = []
  allLoaded.value = false
  initialLoading.value = true
  nextTick(() => loadMore())
}, 400)

watch(blogSearch, () => onSearch())

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
    <!-- Hero -->
    <section class="bl-hero-wrap">
      <svg width="0" height="0" class="absolute">
        <defs>
          <clipPath id="blHeroClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.720,1 Q 0.690,1 0.670,0.850 Q 0.650,0.650 0.620,0.650 L 0.380,0.650 Q 0.350,0.650 0.330,0.850 Q 0.310,1 0.280,1 L 0,1 Z" />
          </clipPath>
          <clipPath id="blHeroClipMobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.920,1 Q 0.870,1 0.840,0.850 Q 0.810,0.680 0.770,0.680 L 0.230,0.680 Q 0.190,0.680 0.160,0.850 Q 0.130,1 0.080,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div class="bl-hero-section">
        <div class="hero-corner-tl"></div>
        <div class="hero-corner-br"></div>
        <div class="bl-hero-inner">
          <h1 class="font-cairo text-white text-2xl sm:text-3xl font-bold">{{ $t('blog') }}</h1>
        </div>
      </div>

      <!-- Search bar in the notch -->
      <div class="bl-hero-notch-search">
        <SearchInput v-model="blogSearch" :placeholder="$t('search')" light small class="bl-notch-input" />
      </div>
    </section>

    <!-- Blog Grid -->
    <div class="bl-grid">
      <BlogCard v-for="blog in blogs" :key="`blog-${blog.id}`" :blog="blog" />
    </div>

    <!-- Skeleton (SSR-rendered) -->
    <div v-if="initialLoading" class="bl-grid">
      <div v-for="n in 9" :key="`sk-${n}`" class="bl-skeleton-card">
        <Skeleton class="bl-skeleton-img" />
        <div class="bl-skeleton-body">
          <Skeleton class="h-3.5 w-3/4 rounded" />
          <Skeleton class="h-2.5 w-1/2 rounded mt-1.5" />
        </div>
      </div>
    </div>

    <client-only>
      <!-- Infinite scroll trigger -->
      <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4"></div>

      <!-- Empty state -->
      <div v-if="allLoaded && blogs.length === 0" class="bl-empty-state">
        <Newspaper :size="52" class="text-secondary opacity-40" aria-hidden="true" />
        <p>{{ $t('no_result') }}</p>
      </div>

    </client-only>
  </div>
</template>

<script>
export default {
  name: 'BlogIndex',
};
</script>

<style>
/* ── Hero ── */
.bl-hero-wrap {
  position: relative;
  margin-bottom: 1.5rem;
}

.bl-hero-section {
  background: url('~/assets/images/hero-bg.svg') center/cover no-repeat;
  border-radius: 1.25rem;
  padding: 2.5rem 1.5rem 5rem;
  position: relative;
  overflow: hidden;
  clip-path: url(#blHeroClipMobile);
}

@media (min-width: 640px) {
  .bl-hero-section {
    clip-path: url(#blHeroClip);
  }
}

.bl-hero-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 28, 39, 0.6);
}

.bl-hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

/* ── Search notch ── */
.bl-hero-notch-search {
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
  .bl-hero-notch-search {
    width: 46%;
    min-width: 160px;
    max-width: 220px;
  }
}

.bl-notch-input input {
  background: white !important;
  border: 1.5px solid var(--color-border) !important;
  box-shadow: 0 2px 8px rgba(27, 44, 59, 0.08);
  color: var(--color-primary) !important;
}
.bl-notch-input input::placeholder {
  color: var(--color-muted-foreground) !important;
}

/* ── Grid ── */
.bl-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 0.5rem;
  padding: 0.5rem 0.25rem 0;
}

@media (min-width: 640px) {
  .bl-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem 0.65rem;
  }
}

/* ── Skeleton ── */
.bl-skeleton-card {
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
}
.bl-skeleton-img {
  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: 0.75rem;
  background: #e2e8f0 !important;
}
.bl-skeleton-body {
  padding: 0.55rem 0.25rem 0.35rem;
}
.bl-skeleton-body > * {
  background: #e2e8f0 !important;
}

/* ── Empty State ── */
.bl-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1rem;
  color: var(--color-muted-foreground);
  opacity: 0.5;
  text-align: center;
}
.bl-empty-state p {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.75rem;
}
</style>
