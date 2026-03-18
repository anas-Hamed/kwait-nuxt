<script setup>
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

const api = useApi()
const route = useRoute()

const { data: category } = await useAsyncData(`category-${route.params.id}`, async () => {
  const res = await api.get(`category/${route.params.id}`)
  return res.data || {}
})
</script>

<template>
  <div class="">
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center">
          <div class="rounded-full border-2 border-secondary relative p-1">
            <ImagePlaceholder :circle-image="true" :image="category?.image" class="w-24 md:w-32 h-24 md:h-32" />
          </div>
          <div class="p-4">
            <p class="text-2xl md:text-4xl">{{category?.name }}</p>
            <p v-if="category?.parent" class="text-sm text-muted-foreground">{{category.parent.name}}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card class="mt-4">
      <CardContent class="p-8">
        <div class="flex flex-wrap flex items-center justify-center py-4 px-2 md:px-24">
          <div v-for="cat in category?.children" :key="`category-${cat.id}`" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
            <CategoryCard :replace="true" :category="cat" />
          </div>
        </div>
        <div v-if="category?.children?.length === 0" class="flex items-center justify-center h-48">
          <div class="text-center">
            <p>لا يوجد نتائج</p>
            <Button variant="ghost" class="font-bold" @click="$router.go(-1)">العودة</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'CategoryShow',
  head() {
    return this.metaBuilder(this.category?.name, null, this.category?.image);
  },
};
</script>

<style scoped>
</style>
