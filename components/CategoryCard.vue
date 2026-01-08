<template>
  <LLink :replace="replace"
         :to="category.parent_id ? {name: 'company',query: {category_id: category.id}} : {name: 'category-id',params: {id: category.id}}"
         class="flex flex-col justify-center items-center p-2">
    <div class="text-center">
      <div class=" rounded-full border-2 border-secondary  relative p-1 w-24 md:w-28 h-24 md:h-28 mx-auto">
        <ImagePlaceholder :circle-image="true" :image="category.image" class="w-full h-full" />
      </div>
      <p class="py-2   px-2">{{category.name}}</p>
    </div>
  </LLink>
</template>

<script>
import ImagePlaceholder from '~/components/ImagePlaceholder';
import LLink from '~/components/l-link';
export default {
  name: 'CategoryCard',
  components: { LLink, ImagePlaceholder },
  props: {
    category:{
      type: Object,
      required: true
    },
    replace:{
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>

</style>
