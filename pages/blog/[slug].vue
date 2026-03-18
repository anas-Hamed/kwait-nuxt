<script setup>
import { Card, CardContent } from '~/components/ui/card'

const api = useApi()
const route = useRoute()

const { data: blog } = await useAsyncData(`blog-${route.params.slug}`, async () => {
  const res = await api.get(`blog/${route.params.slug}`)
  return res.data || {}
})
</script>

<template>
  <div class="max-w-screen-lg mx-auto">
    <div class="">
      <img alt="" :src="blog?.image" class="mx-auto rounded-sm shadow" style="aspect-ratio:16/9">
    </div>
    <Card class="mt-8">
      <CardContent class="p-6">
        <p class="px-2 mt-3 font-bold text-4xl">{{blog?.title}}</p>
        <div class="flex px-2 text-muted-foreground">
          <client-only>
            <small>{{$dayjs(blog?.created_at).format('YYYY-MM-DD H:m')}}</small>
          </client-only>
        </div>
        <div class="mt-6 prose" v-html="blog?.text">
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'BlogShow',
  head() {
    return this.metaBuilder(this.blog?.title, '', this.blog?.image);
  },
};
</script>

<style>
</style>
