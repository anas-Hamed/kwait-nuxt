<script setup>
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

const api = useApi()
const router = useRouter()
const localePath = useLocalePath()

const { data: mainData } = await useAsyncData('main', async () => {
  const res = await api.get('main', { limit: 10 })
  return res.data
})

const ads = computed(() => mainData.value?.ads || [])
const categories = computed(() => mainData.value?.categories || [])
const blogs = computed(() => mainData.value?.blogs || [])
</script>

<template>
  <div class="max-w-screen-lg mx-auto">
    <div>
      <Ads :ads="ads" :loading="adsLoading" />
    </div>

    <Card class="mt-8">
      <CardContent class="p-4 md:p-8">
        <img class="max-w-sm w-8/12 mx-auto my-8" src="~/assets/images/h_logo.png" alt="">
        <form @submit.prevent="searchForResult">
          <SearchInput class="mx-auto" :placeholder="$t('search_for_category_company')" v-model="search" />
        </form>

        <Separator class="my-8" />

        <div class="flex flex-wrap justify-center py-4 px-2 md:px-16">
          <div v-for="category in categories" :key="`category-${category.id}`" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
            <CategoryCard :category="category" />
          </div>
          <div class="py-6 text-center w-full" v-if="categories.length == 10">
            <LLink :to="{ name: 'category' }">
              <Button variant="secondary" class="rounded-full px-8">{{ $t('show_more') }}</Button>
            </LLink>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="mt-4" v-if="blogs.length > 0">
      <CardContent class="p-4 md:p-8">
        <h3 class="text-2xl font-bold mb-4">{{ $t('latest_blogs') }}</h3>
        <div class="flex flex-wrap">
          <BlogCard v-for="blog in blogs" :key="`blog-${blog.id}`" :blog="blog" class="w-full md:w-1/3" />
        </div>
        <div class="py-6 text-center w-full" v-if="blogs.length == 3">
          <LLink :to="{ name: 'blog' }">
            <Button variant="secondary" class="rounded-full px-8">{{ $t('show_more') }}</Button>
          </LLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      search: '',
      searchResult: [],
      loading: false,
      noResults: false,
      showResults: false,
      adsLoading: true,
    }
  },
  head() {
    return this.metaBuilder()
  },
  mounted() {
    this.adsLoading = false
  },
  methods: {
    searchForResult() {
      if (this.search.length > 0) {
        this.$router.push(this.localePath({ name: 'search', query: { keyword: this.search } }))
      }
    },
  },
}
</script>
