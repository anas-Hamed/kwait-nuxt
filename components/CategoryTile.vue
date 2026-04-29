<template>
  <LLink
    :replace="replace"
    :to="category.parent_id
      ? { name: 'company', query: { category_id: category.id } }
      : { name: 'category-id', params: { id: category.id } }"
    class="ct-tile group"
  >
    <div class="ct-img-wrap">
      <div class="ct-img-inner">
        <ImagePlaceholder :circle-image="true" :image="category.image" class="w-full h-full" />
      </div>
    </div>

    <div class="ct-body">
      <p class="ct-name">{{ category.name }}</p>
    </div>

    <ChevronRight :size="18" class="ct-arrow" />
  </LLink>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'

defineProps({
  category: { type: Object, required: true },
  replace: { type: Boolean, default: false },
})
</script>

<style scoped>
.ct-tile {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  background: #ffffff;
  border-radius: 1rem;
  text-decoration: none;
  transition: all 250ms ease-out;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(54, 32, 97, 0.05);
}

.ct-tile:hover {
  box-shadow: 0 8px 24px rgba(107, 77, 209, 0.14);
  transform: translateY(-2px);
}

.ct-tile:active {
  transform: translateY(0);
}

.ct-img-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 2px;
  background: #E1C3FF;
  flex-shrink: 0;
}

.ct-img-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #ffffff;
}

.ct-body {
  flex: 1 1 auto;
  min-width: 0;
}

.ct-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-foreground);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ct-arrow {
  color: var(--color-muted-foreground);
  flex-shrink: 0;
  transition: color 250ms ease-out, transform 250ms ease-out;
}

.ct-tile:hover .ct-arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}

[dir="rtl"] .ct-arrow {
  transform: scaleX(-1);
}

[dir="rtl"] .ct-tile:hover .ct-arrow {
  transform: scaleX(-1) translateX(2px);
}
</style>
