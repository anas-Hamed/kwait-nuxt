<script setup>
import { Grid3X3 } from 'lucide-vue-next'

const api = useApi()

const { data: categories } = await useAsyncData('categories', async () => {
  const res = await api.get('category')
  return res.data || []
})
</script>

<template>
  <section class="cat-page" :aria-label="$t('categories')">
    <!-- Header -->
    <div class="cat-header">
      <div>
        <h1 class="cat-title">{{ $t('categories') }}</h1>
        <p class="cat-subtitle">{{ $t('search_about_category') }}</p>
      </div>
      <span class="cat-count" v-if="categories?.length">{{ categories.length }}</span>
    </div>

    <!-- Grid -->
    <div v-if="categories?.length" class="cat-grid">
      <div
        v-for="(category, i) in categories"
        :key="`category-${category.id}`"
        :style="{ animationDelay: `${Math.min(i * 40, 600)}ms` }"
        class="cat-grid-item"
      >
        <CategoryCard :replace="true" :category="category" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="cat-empty">
      <Grid3X3 :size="36" aria-hidden="true" />
      <p>{{ $t('no_results') }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Category',
  head() {
    return this.metaBuilder(this.$t('categories'));
  },
};
</script>

<style>
.cat-page {
  animation: cat-in 0.4s ease both;
}

.cat-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.cat-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}
.cat-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  inset-inline-start: 0;
  width: 36px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--color-secondary), transparent);
}
.cat-subtitle {
  font-size: 0.82rem;
  color: var(--color-muted-foreground);
  margin-top: 0.4rem;
}
.cat-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 2rem;
  padding: 0.25rem 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}
@media (min-width: 640px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 768px) { .cat-grid { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(5, 1fr); } }

.cat-grid-item {
  animation: cat-in 0.4s ease both;
}

.cat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: var(--color-muted-foreground);
  opacity: 0.5;
  text-align: center;
}
.cat-empty p {
  font-size: 0.9rem;
  margin-top: 0.75rem;
}

@keyframes cat-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .cat-page, .cat-grid-item { animation: none; }
}
</style>
