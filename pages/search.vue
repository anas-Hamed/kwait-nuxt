<script setup>
import { Card, CardContent } from '~/components/ui/card'

const route = useRoute()
const api = useApi()

const searchResult = ref([])
const offset = ref(0)
const limit = ref(10)
const loadingMore = ref(false)
const allLoaded = ref(false)
const loadMoreTrigger = ref(null)

async function loadMore() {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  try {
    const data = await api.get('search', {
      offset: offset.value,
      limit: limit.value,
      search_term: route.query.keyword
    })
    if (data.data.length > 0) {
      searchResult.value = [...searchResult.value, ...data.data]
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
  <div>
    <div>
      <Card>
        <CardContent class="p-8">
          <div v-if="searchResult.length > 0">
            <div v-for="item in searchResult" class="hover:bg-secondary bg-opacity-50 p-2 border-b" :key="item.type + '---' + item.id">
              <LLink
                :to="item.type === 'company' ? {name: 'company-id', params:{id: item.slug}} : (item.parent_id != null ? {name: 'company', query:{category_id: item.id}} : {name: 'category-id', params:{id: item.id}})"
              >
                <div class="flex items-center">
                  <div class="w-24 h-24 rounded-full p-2 border-secondary">
                    <img :src="item.image" class="w-full rounded-full">
                  </div>
                  <div>
                    <div class="font-bold text-xl">{{item.name || item.ar_name}}</div>
                    <div class="text-sm">{{$t(item.type)}}</div>
                  </div>
                </div>
              </LLink>
            </div>
          </div>
          <div class="my-5">
            <client-only>
              <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4 text-center">
                <LoadingCircle :loading="true" />
              </div>
              <div v-if="allLoaded && searchResult.length === 0" class="text-center py-8 text-muted-foreground">
                {{ $t('no_result') }}
              </div>
            </client-only>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  head() {
    return this.metaBuilder(this.$t('search'));
  },
};
</script>

<style scoped>
</style>
