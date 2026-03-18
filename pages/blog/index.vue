<script setup>
import { Card, CardContent } from '~/components/ui/card'

const api = useApi()

const blogs = ref([])
const offset = ref(0)
const limit = ref(9)
const loadingMore = ref(false)
const allLoaded = ref(false)
const loadMoreTrigger = ref(null)

async function loadMore() {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  try {
    const data = await api.get('blog', {
      offset: offset.value,
      limit: limit.value
    })
    if (data.data.length > 0) {
      blogs.value = [...blogs.value, ...data.data]
      offset.value += limit.value
    } else {
      allLoaded.value = true
    }
  } catch (e) {
    allLoaded.value = true
  } finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  if (!loadMoreTrigger.value) return
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loadingMore.value && !allLoaded.value) {
      loadMore()
    }
  })
  observer.observe(loadMoreTrigger.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <Card>
    <CardContent class="p-6">
      <div class="flex flex-wrap">
        <BlogCard v-for="blog in blogs" :key="`blog-${blog.id}`" :blog="blog" class="w-full md:w-1/3"/>
      </div>
      <div class="my-5">
        <client-only>
          <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4 text-center">
            <LoadingCircle :loading="true" />
          </div>
          <div v-if="allLoaded && blogs.length === 0" class="text-center py-8 text-muted-foreground">
            {{ $t('no_result') }}
          </div>
          <div v-if="allLoaded && blogs.length > 0" class="text-center py-4 text-muted-foreground">
            {{ $t('no_more') }}
          </div>
        </client-only>
      </div>
    </CardContent>
  </Card>
</template>

<script>
export default {
  name: 'BlogIndex',
};
</script>

<style scoped>
</style>
