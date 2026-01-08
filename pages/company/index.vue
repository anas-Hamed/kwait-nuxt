<template>
  <div>
    <div v-if="activeCategory != null" class="card">
      <div class="flex items-center">
        <div class=" rounded-full border-2 border-secondary  relative p-1">
          <ImagePlaceholder :circle-image="true" :image="activeCategory.image" class="w-24 md:w-32 h-24 md:h-32" />
        </div>
        <div class="p-4">
          <p class="text-2xl md:text-4xl">{{activeCategory.name }}</p>
          <p v-if="activeCategory.parent" class="text-sm text-gray-400">{{activeCategory.parent.name}}</p>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="flex items-center">
        <div class=" rounded-full border-2 border-secondary  relative p-1">
          <ImagePlaceholder :circle-image="true" :image="defaultImage" class="w-24 md:w-32 h-24 md:h-32" />
        </div>
        <div class="p-4">
          <p class="text-2xl md:text-4xl">{{$t('app_name')}}</p>
          <p class="text-sm text-gray-400">{{$t('all_companies')}}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap mt-8">
      <FilterMenu :categories="categories" @setCategory="setCategory" />
      <div class="w-full lg:w-3/4 ">
        <SearchInput :value="companySearch" class="mx-auto my-2 lg:my-0" :placeholder="$t('search_for_company')"
                     @input="getSearch" />
        <div class="flex">
          <div class="w-4"></div>
          <div class="py-4 flex flex-wrap  flex-auto">
            <div v-for="company in companies" :key="`company-${company.id}`" class="w-full md:w-2/4 p-1">
              <CompanyCard :company="company" class="" />
            </div>
          </div>
        </div>

        <div class="my-5">
          <client-only>
            <infinite-loading
              :identifier="infiniteId"
              spinner="spiral"
              @infinite="getMore"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import SearchInput from '../../components/SearchInput';
  import CompanyCard from '../../components/CompanyCard';
  import CategoryGroup from '../../components/CategoryGroup';
  import FilterMenu from '../../components/FilterMenu';

  export default {
    'name': 'CompanyIndex',
    components: { FilterMenu, CategoryGroup, CompanyCard, SearchInput },
    async asyncData(ctx) {
      let categories = [];
      let category = null;
      /* eslint-disable camelcase */
      let category_id;
      try {
        categories = (await ctx.$axios.get('category?all=true')).data.data;
        category_id = Number(ctx.query.category_id);
      } catch (e) {

      }
      return {
        category, categories, category_id
      };
    },
    data() {
      return {
        companySearch: this.$route.query.keyword,
        companies: [],
        offset: 0,
        limit: 9,
        infiniteId: +new Date()
      };
    },
    head() {
      return this.metaBuilder(this.activeCategory != null ? this.activeCategory?.name : this.$t('all_companies'),null,this.activeCategory?.image);
    },
    computed: {
      activeCategory() {
        const category = this.categories.find(el => el.id === Number(this.$route.query.category_id));
        if (category) category.parent = this.categories.find(el => el.id === category.parent_id);
        return category;
      },
      defaultImage() {
        return require('~/assets/images/logo.png');
      },
    },
    watch: {
      category_id(value) {
        if (this.$route.query.category_id !== value) {
          this.$router.replace(this.localePath({
            name: 'company',
            query: { ...this.$route.query, category_id: value }
          }));
        }

      },
      companySearch(value) {
        if (this.$route.query.word !== value) {
          this.$router.replace(this.localePath({
            name: 'company',
            query: { ...this.$route.query, keyword: value }
          }));
        }
      },
      '$route.query': {
        deep: true,
        handler: _.debounce( function(v) {
          this.offset = 0;
          this.companies = [];
          this.infiniteId = +new Date();

        },1000)
      }
    },
    methods: {
      setCategory(v) {
        console.log('category',v)
        this.category_id = v;
      },
      async getMore($state) {
        const data = await this.$axios.get('company', {
          params: {
            offset: this.offset,
            limit: this.limit,
            ...this.$route.query
          }
        });
        if (data.data.data.length > 0) {
          this.companies = [...this.companies, ...data.data.data];
          this.offset += this.limit;
          $state.loaded();
        } else {
          $state.complete();
        }
      },
      getSearch: _.debounce(function(value) {
        this.companySearch = value;
        if (this.$route.query.keyword !== value && value.length > 3) {
          this.$router.replace(this.localePath({
            name: 'company',
            query: { ...this.$route.query, keyword: value }
          }));
        }
      }, 500)
    }
  };
</script>

<style scoped>

</style>
