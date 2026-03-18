<script setup>
import { Card, CardContent } from '~/components/ui/card'

const api = useApi()

const { data: categories } = await useAsyncData('categories', async () => {
  const res = await api.get('category')
  return res.data || []
})
</script>

<template>
  <div class="">
    <Card>
      <CardContent class="p-8">
        <div class="flex flex-wrap py-4 px-2 md:px-24">
          <div v-for="category in categories" :key="`category-${category.id}`" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
            <CategoryCard :replace="true" :category="category" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'Category',
  head() {
    return this.metaBuilder(this.$t('categories'));
  },
};
</script>

<style scoped>
</style>
