<script setup>
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
      <img alt="" :src="blog?.image" class="mx-auto rounded shadow" style="aspect-ratio:16/9">
    </div>
    <div class="card mt-8">
      <p class="px-2 mt-3 font-bold text-4xl">{{blog?.title}}</p>
      <div class="flex px-2 text-gray-500">
        <client-only>
          <small>{{$dayjs(blog?.created_at).format('YYYY-MM-DD H:m')}}</small>
        </client-only>
      </div>
      <div class="mt-6 prose" v-html="blog?.text">
      </div>
    </div>
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
