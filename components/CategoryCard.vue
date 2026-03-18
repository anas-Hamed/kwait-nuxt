<template>
  <LLink :replace="replace"
         :to="category.parent_id ? { name: 'company', query: { category_id: category.id } } : { name: 'category-id', params: { id: category.id } }"
         class="flex flex-col items-center p-2 group">
    <div class="rounded-full border-2 border-secondary p-1 w-24 md:w-28 h-24 md:h-28 mx-auto transition-transform duration-200 group-hover:scale-105">
      <ImagePlaceholder :circle-image="true" :image="category.image" class="w-full h-full" />
    </div>
    <p class="py-2 px-2 text-center text-sm font-medium">{{ category.name }}</p>
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
