<template>
  <LLink :replace="replace"
         :to="category.parent_id ? { name: 'company', query: { category_id: category.id } } : { name: 'category-id', params: { id: category.id } }"
         class="block p-1.5 group">
    <div class="category-card">
      <svg class="category-card-bg" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
        <path d="M8,0 L192,0 Q200,0 200,8 L200,150 Q200,158 194,158 L174,158 Q152,158 152,178 L152,192 Q152,200 144,200 L8,200 Q0,200 0,192 L0,8 Q0,0 8,0 Z" fill="currentColor" stroke="#e2e8f0" stroke-width="1"/>
      </svg>

      <div class="category-card-content">
        <div class="w-[72px] h-[72px] md:w-[88px] md:h-[88px] mx-auto rounded-full p-[3px]
                    bg-gradient-to-br from-border to-border
                    group-hover:from-secondary group-hover:to-secondary/60
                    transition-all duration-300">
          <div class="w-full h-full rounded-full overflow-hidden bg-white">
            <ImagePlaceholder :circle-image="true" :image="category.image" class="w-full h-full" />
          </div>
        </div>
        <p class="mt-3 text-sm font-bold text-primary truncate">{{ category.name }}</p>
      </div>

      <!-- Arrow in notch -->
      <div class="category-card-notch">
        <div class="w-full h-full rounded-full bg-primary flex items-center justify-center
                    transition-colors duration-300">
          <ArrowRight :size="14" class="text-white" />
        </div>
      </div>
    </div>
  </LLink>
</template>

<script>
import { ArrowRight } from 'lucide-vue-next'

export default {
  name: 'CategoryCard',
  components: { ArrowRight },
  props: {
    category: { type: Object, required: true },
    replace: { type: Boolean, default: false },
  },
}
</script>

<style>
.category-card {
  position: relative;
  aspect-ratio: 1/1;
}
.category-card-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: white;
}
.category-card-content {
  position: relative;
  z-index: 1;
  padding: 1rem 0.75rem 1.5rem;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.category-card-notch {
  position: absolute;
  bottom: -5px;
  right: -5px;
  z-index: 2;
  width: 18%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
