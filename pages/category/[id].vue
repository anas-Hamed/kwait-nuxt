<script setup>
import { ChevronLeft, Grid3X3 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const api = useApi()
const route = useRoute()
const router = useRouter()

const { data: category } = await useAsyncData(`category-${route.params.id}`, async () => {
  const res = await api.get(`category/${route.params.id}`)
  return res.data || {}
})
</script>

<template>
  <section class="cat-page" :aria-label="category?.name">
    <!-- Header -->
    <div class="catd-header">
      <button class="catd-back" @click="router.back()" :aria-label="$t('back')">
        <ChevronLeft :size="20" />
      </button>

      <div class="catd-img-wrap">
        <ImagePlaceholder :circle-image="true" :image="category?.image" class="w-full h-full" />
      </div>

      <div class="catd-info">
        <LLink v-if="category?.parent" :to="{ name: 'category-id', params: { id: category.parent.id } }" class="catd-parent">
          {{ category.parent.name }}
        </LLink>
        <h1 class="catd-name">{{ category?.name }}</h1>
        <span v-if="category?.children?.length" class="catd-child-count">
          {{ category.children.length }} {{ $t('categories') }}
        </span>
      </div>
    </div>

    <!-- Children Grid -->
    <div v-if="category?.children?.length" class="cat-grid" style="animation-delay: 0.1s">
      <div
        v-for="(cat, i) in category.children"
        :key="`category-${cat.id}`"
        :style="{ animationDelay: `${100 + Math.min(i * 40, 600)}ms` }"
        class="cat-grid-item"
      >
        <CategoryCard :replace="true" :category="cat" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="category?.children?.length === 0" class="cat-empty">
      <Grid3X3 :size="36" aria-hidden="true" />
      <p>{{ $t('no_results') }}</p>
      <Button variant="outline" size="sm" class="rounded-xl gap-2 mt-3" @click="router.back()">
        <ChevronLeft :size="14" />
        {{ $t('back') }}
      </Button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CategoryShow',
  head() {
    return this.metaBuilder(this.category?.name, null, this.category?.image);
  },
};
</script>

<style>
/* ── Detail Header ── */
.catd-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: cat-in 0.4s ease both;
}
.catd-back {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  border: 1px solid var(--color-border);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
  flex-shrink: 0;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.catd-back:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
[dir="rtl"] .catd-back svg {
  transform: scaleX(-1);
}

.catd-img-wrap {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary), transparent);
  flex-shrink: 0;
}
.catd-img-wrap > * {
  border-radius: 50%;
  overflow: hidden;
  background: white;
}

.catd-info {
  min-width: 0;
}
.catd-parent {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  transition: color 0.15s ease;
}
.catd-parent:hover { color: var(--color-primary); }
.catd-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.3;
  margin-top: 0.1rem;
}
.catd-child-count {
  font-size: 0.72rem;
  color: var(--color-muted-foreground);
  margin-top: 0.15rem;
  display: block;
}
</style>
