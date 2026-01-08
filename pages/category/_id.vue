<template>
  <div class="">
    <div class="card">
      <div class="flex items-center">
        <div class=" rounded-full border-2 border-secondary  relative p-1">
          <ImagePlaceholder :circle-image="true" :image="category.image" class="w-24 md:w-32 h-24 md:h-32" />
        </div>
        <div class="p-4">
          <p class="text-2xl md:text-4xl">{{category.name }}</p>
          <p v-if="category.parent" class="text-sm text-gray-400">{{category.parent.name}}</p>
        </div>
      </div>
    </div>
    <div class="bg-white rounded shadow-md p-8 mt-4">
      <div class="flex flex-wrap flex-centred py-4 px-2 md:px-24 ">
        <div v-for="category in category.children" :key="`category-${category.id}`" class="w-1/2  sm:w-1/3 md:w-1/4 lg:w-1/5">
          <CategoryCard :replace="true" :category="category" />
        </div>
      </div>
      <div v-if="category.children.length === 0" class="flex-centred h-48 ">
        <div class="text-center">
          <p>لا يوجد نتائج</p>
          <button class="font-bold" @click="$router.go(-1)">العودة</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CategoryCard from '~/components/CategoryCard';

  export default {
    'name': 'CategoryShow',
    components: { CategoryCard },
    async asyncData(ctx) {
      let category = {};
      try {
        const { data } = (await ctx.$axios.get(`category/${ctx.params.id}`)).data;
        category = data;
      } catch ({ response }) {
        ctx.error({
          statusCode: response?.status,
          message: response?.message
        });
      }
      return { category };
    },
    head() {
      return this.metaBuilder(this.category.name,null,this.category.image);
    },
  };
</script>

<style scoped>

</style>
