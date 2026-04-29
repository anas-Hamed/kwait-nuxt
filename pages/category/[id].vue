<script setup>
import { ChevronLeft, FolderOpen } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'

const api = useApi()
const route = useRoute()
const router = useRouter()

const { data: category, pending } = await useAsyncData(`category-${route.params.id}`, async () => {
  const res = await api.get(`category/${route.params.id}`)
  return res.data || {}
})
</script>

<template>
  <section class="cat-page" :aria-label="category?.name">
    <!-- ═══════════════════ HERO ═══════════════════ -->
    <section v-if="!pending && category?.id" class="cat-hero-wrap">
      <div class="cat-hero-section hero-gradient">
        <div class="hero-corner-tl" />
        <div class="hero-corner-br" />

        <!-- Back button -->
        <button
          class="cat-hero-back"
          @click="router.back()"
          :aria-label="$t('back')"
        >
          <ChevronLeft :size="20" />
        </button>

        <div class="cat-hero-inner">
          <LLink
            v-if="category?.parent"
            :to="{ name: 'category-id', params: { id: category.parent.id } }"
            class="cat-hero-breadcrumb"
          >
            {{ category.parent.name }}
          </LLink>

          <h1 class="cat-hero-title font-brand">{{ category?.name }}</h1>

          <div class="hero-divider" />

          <p class="cat-hero-subtitle">
            {{ category?.children?.length || 0 }} {{ $t('categories') }}
          </p>
        </div>
      </div>

      <!-- Category image floating in the notch -->
      <div class="cat-hero-notch-img">
        <div class="cat-hero-notch-inner">
          <ImagePlaceholder :circle-image="true" :image="category?.image" class="w-full h-full" />
        </div>
      </div>
    </section>

    <!-- ═══════════════════ HERO SKELETON ═══════════════════ -->
    <section v-else class="cat-hero-wrap">
      <Skeleton class="cat-hero-skeleton" />
      <div class="cat-hero-notch-img">
        <Skeleton class="cat-hero-notch-skeleton" />
      </div>
    </section>

    <!-- ═══════════════════ SUBCATEGORY TILES ═══════════════════ -->
    <section v-if="!pending && category?.children?.length" class="cat-tiles-wrap">
      <div class="cat-tiles-head">
        <h2 class="cat-tiles-title">{{ $t('categories') }}</h2>
        <span class="cat-tiles-count">{{ category.children.length }}</span>
      </div>

      <div class="cat-tile-grid">
        <div
          v-for="(cat, i) in category.children"
          :key="`cat-${cat.id}`"
          :style="{ animationDelay: `${80 + Math.min(i * 40, 600)}ms` }"
          class="cat-tile-item"
        >
          <CategoryTile :category="cat" :replace="true" />
        </div>
      </div>
    </section>

    <!-- ═══════════════════ TILES SKELETON ═══════════════════ -->
    <section v-else-if="pending" class="cat-tiles-wrap">
      <div class="cat-tiles-head">
        <Skeleton class="h-5 w-32 rounded" />
      </div>
      <div class="cat-tile-grid">
        <div v-for="n in 6" :key="`sk-${n}`" class="cat-tile-skeleton">
          <Skeleton class="cat-tile-sk-img" />
          <div class="cat-tile-sk-body">
            <Skeleton class="h-3.5 w-3/4 rounded" />
            <Skeleton class="h-2.5 w-1/2 rounded mt-2" />
          </div>
          <Skeleton class="h-4 w-4 rounded" />
        </div>
      </div>
    </section>

    <!-- ═══════════════════ EMPTY STATE ═══════════════════ -->
    <section v-else-if="!pending && category?.children?.length === 0" class="cat-empty">
      <div class="cat-empty-icon">
        <FolderOpen :size="34" />
      </div>
      <p class="cat-empty-title">{{ $t('no_results') }}</p>
      <Button variant="outline" size="sm" class="gap-2 mt-4" @click="router.back()">
        <ChevronLeft :size="14" class="cat-empty-back-icon" />
        {{ $t('back') }}
      </Button>
    </section>
  </section>
</template>

<script>
export default {
  name: 'CategoryShow',
  head() {
    return this.metaBuilder(this.category?.name, null, this.category?.image)
  },
}
</script>

<style scoped>
.cat-page {
  padding-top: 0.25rem;
}

/* ══════════════════ Hero ══════════════════ */
.cat-hero-wrap {
  position: relative;
  margin-bottom: 4.25rem;
  animation: cat-in 0.45s ease both;
}

.cat-hero-section {
  border-radius: 1.25rem;
  padding: 2.5rem 1.5rem 4rem;
  position: relative;
  overflow: hidden;
  min-height: 200px;
}

@media (min-width: 640px) {
  .cat-hero-section {
    padding: 3rem 2rem 4.5rem;
    min-height: 240px;
  }
}

.cat-hero-back {
  position: absolute;
  top: 1rem;
  inset-inline-start: 1rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: background 0.2s ease, border-color 0.2s ease;
  z-index: 3;
}

.cat-hero-back:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

[dir="rtl"] .cat-hero-back svg {
  transform: scaleX(-1);
}

.cat-hero-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 36rem;
  margin: 0 auto;
}

.cat-hero-breadcrumb {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.04em;
  margin-bottom: 0.4rem;
  transition: color 0.2s ease;
}

.cat-hero-breadcrumb:hover {
  color: #FFD71D;
}

.cat-hero-title {
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

@media (min-width: 640px) {
  .cat-hero-title {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .cat-hero-title {
    font-size: 2.5rem;
  }
}

.cat-hero-inner .hero-divider {
  margin: 0.9rem auto 0.6rem;
}

.cat-hero-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ══════════════════ Floating category image ══════════════════ */
.cat-hero-notch-img {
  position: absolute;
  bottom: -3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  padding: 4px;
  background: #ffffff;
  z-index: 10;
  box-shadow: 0 10px 30px rgba(54, 32, 97, 0.22);
}

.cat-hero-notch-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #E1C3FF;
}

@media (min-width: 640px) {
  .cat-hero-notch-img {
    width: 7rem;
    height: 7rem;
    bottom: -3.5rem;
  }
}

/* ══════════════════ Hero skeleton ══════════════════ */
.cat-hero-skeleton {
  width: 100%;
  height: 180px;
  border-radius: 1.25rem;
  background: #e9d8ff !important;
}

@media (min-width: 640px) {
  .cat-hero-skeleton {
    height: 220px;
  }
}

.cat-hero-notch-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 50% !important;
  background: #d4b5ff !important;
}

/* ══════════════════ Tiles section header ══════════════════ */
.cat-tiles-wrap {
  animation: cat-in 0.45s ease 0.1s both;
}

.cat-tiles-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding: 0 0.25rem;
}

.cat-tiles-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-foreground);
  line-height: 1;
}

.cat-tiles-count {
  background: #E1C3FF;
  color: #362061;
  border-radius: 9999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.4;
}

/* ══════════════════ Tile grid ══════════════════ */
.cat-tile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
}

@media (min-width: 640px) {
  .cat-tile-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .cat-tile-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.85rem;
  }
}

.cat-tile-item {
  animation: cat-tile-in 0.4s ease both;
  opacity: 0;
}

/* ══════════════════ Tile skeleton ══════════════════ */
.cat-tile-skeleton {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(54, 32, 97, 0.05);
}

.cat-tile-sk-img {
  width: 56px !important;
  height: 56px !important;
  border-radius: 50% !important;
  flex-shrink: 0;
  background: #e9d8ff !important;
}

.cat-tile-sk-body {
  flex: 1 1 auto;
  min-width: 0;
}

.cat-tile-skeleton :deep(*) {
  background: #e9d8ff !important;
}

/* ══════════════════ Empty state ══════════════════ */
.cat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem 2rem;
  text-align: center;
  animation: cat-in 0.45s ease 0.1s both;
}

.cat-empty-icon {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: #E1C3FF;
  color: #362061;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.cat-empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-foreground);
}

[dir="rtl"] .cat-empty-back-icon {
  transform: scaleX(-1);
}

/* ══════════════════ Animations ══════════════════ */
@keyframes cat-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cat-tile-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
