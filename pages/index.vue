<template>
  <div class="max-w-screen-lg mx-auto">
    <div>
      <Ads :ads="ads" :loading="adsLoading" />
    </div>
    <div class="bg-white rounded shadow-md p-2 md:p-8 mt-8">
      <img class="max-w-sm w-8/12 mx-auto my-12" src="~assets/images/h_logo.png" alt="">
      <form @submit.prevent="searchForResult">
        <SearchInput class="mx-auto" :placeholder="$t('search_for_category_company')" v-model="search" />
      </form>
      <div class="flex-centred flex-wrap py-4 px-2 md:px-24 mt-16">
        <div v-for="category in categories" :key="`category-${category.id}`" class="w-1/2  sm:w-1/3 md:w-1/4 lg:w-1/5">
          <CategoryCard :category="category" />
        </div>
        <div class="py-6 text-center flex-centred w-full" v-if="categories.length == 10">
          <LLink :to="{name: 'category'}" class="bg-secondary px-6 py-2 rounded-md mx-auto text-white">{{$t('show_more')}}</LLink>
        </div>
      </div>
    </div>
    <div class="card mt-3" v-if="blogs.length > 0">
      <h3 class="text-2xl mb-2">{{$t('latest_blogs')}}</h3>
      <div class="flex flex-wrap">
        <BlogCard  v-for="blog in blogs" :key="`blog-${blog.id}`" :blog="blog"  class="w-full md:w-1/3"/>
      </div>
      <div class="py-6 text-center flex-centred w-full" v-if="blogs.length == 3">
        <LLink :to="{name: 'blog'}" class="bg-secondary px-6 py-2 rounded-md mx-auto text-white">{{$t('show_more')}}</LLink>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import LLink from '~/components/l-link';
  import SearchInput from '~/components/SearchInput';
  import Ads from '~/components/Ads';
  import CategoryCard from '~/components/CategoryCard';

  export default {
    name: 'Index',
    components: { LLink, CategoryCard, Ads, SearchInput },
    async asyncData(ctx) {
      let ads = [];
      let categories = [];
      let blogs = [];
      try {
        const { data } = (await ctx.$axios.get('main?limit=10')).data;
        ads = data.ads;
        categories = data.categories;
        blogs = data.blogs;
        return { ads, categories,blogs };
      } catch ({ response }) {
        ctx.error({
          statusCode: response?.status,
          message: response?.message
        });
      }
      return { ads, categories };
    },
    data() {
      return {
        search: '',
        searchResult: [],
        loading: false,
        noResults: false,
        showResults: false,
        adsLoading: true
      };
    },
    head() {
      return this.metaBuilder();
    },
    mounted() {
      this.adsLoading = false
    },
    methods: {
      searchForResult() {
        if (this.search.length > 0) {
          this.$router.push(this.localePath({ name: 'search', query: { keyword: this.search } }));
        }
      },
      getSearch: _.debounce(async function(v) {
        this.search = v;
        if (v.length >= 3) {
          try {
            this.loading = true;
            const { data } = await this.$axios.get('search', {
              params: {
                search_term: v
              }
            });
            this.searchResult = data.data;
          } catch (e) {
            ;
          } finally {

            this.loading = false;

          }
        }
      }, 500),
    }
  };
</script>
<style>

</style>
