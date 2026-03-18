<template>
  <LLink :replace="replace"
         :to="category.parent_id ? { name: 'company', query: { category_id: category.id } } : { name: 'category-id', params: { id: category.id } }"
         class="block p-1.5 group">
    <div class="text-center py-5 px-3 rounded-2xl bg-white border border-border/50
                hover:border-secondary hover:shadow-card transition-all duration-300 cursor-pointer">
      <!-- Circular image with gold ring on hover -->
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
  </LLink>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    category: { type: Object, required: true },
    replace: { type: Boolean, default: false },
  },
}
</script>
