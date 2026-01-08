<template>
  <div class="">
    <div class="bg-white rounded shadow-md p-8 ">
      <div class="flex flex-wrap py-4 px-2 md:px-24 ">
        <div v-for="category in categories" :key="`category-${category.id}`" class="w-1/2  sm:w-1/3 md:w-1/4 lg:w-1/5">
          <CategoryCard :replace="true" :category="category" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CategoryCard from '~/components/CategoryCard';

  export default {
    name: 'Category',
    components: { CategoryCard },
    async asyncData(ctx) {
      let categories = [];
      try {
        const { data } = (await ctx.$axios.get('category')).data;
        categories = data;
      } catch ({ response }) {
        ctx.error({
          statusCode: response?.status,
          message: response?.message
        });
      }
      return { categories };
    },
    head() {
      return this.metaBuilder(this.$t('categories'));
    },
  };
</script>

<style scoped>

</style>
