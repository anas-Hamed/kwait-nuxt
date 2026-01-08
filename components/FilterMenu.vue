<template>
  <div class="w-full  lg:w-1/4">
    <div class="hidden md:block" >
      <div class="card   flex-col hidden lg:flex">
        {{$t('categories')}}
        <div class="pb-3">
          <SearchInput v-model="categorySearch" class="mx-auto mt-2" :placeholder="$t('search_about_category')" />
        </div>
        <div class="py-6 px-1 flex flex-col space-y-2 flex-auto overflow-y-scroll">
          <div>
            <div class="px-2 font-bold mb-2">
              <label class="flex w-full justify-between block  cursor-pointer" @click="setCategory(null)"
                     for="all-companies"><span>{{$t('all_companies')}}</span>
                <input id="all-companies" :checked="$route.query.category_id == null" :value="null"
                       class="accent-secondary"
                       type="radio" name="category_id"> </label>
            </div>
          </div>
          <CategoryGroup v-for="category in filteredCategories" :key="`category-group-${category.id}`"
                         :category="category" @setCategory="setCategory" />
        </div>
      </div>
    </div>

    <div class="block lg:hidden">
      <button @click="opened = true" class="flex items-center  text-blue-400 gap-1 ">
        <b>التصنيفات</b>
        <icon name="filter"></icon>
      </button>
      <transition name="slide">
        <div @click.self="opened = false" class="fixed w-full h-full bg-black bg-opacity-50 z-50 inset-0" v-if="opened">
          <div class="bg-white overflow-y-scroll h-screen py-8  px-4 absolute inset-0 w-3/4">
            {{$t('categories')}}
            <div class="pb-3">
              <SearchInput v-model="categorySearch" class="mx-auto mt-2" :placeholder="$t('search_about_category')" />
            </div>
            <div class="py-6 px-1 flex flex-col space-y-2 flex-auto overflow-y-scroll">
              <div>
                <div class="px-2 font-bold mb-2">
                  <label class="flex w-full justify-between block  cursor-pointer" @click="setCategory(null)"
                         for="all-companies2"><span>{{$t('all_companies')}}</span>
                    <input id="all-companies2" :checked="$route.query.category_id == null" :value="null"
                           class="accent-secondary"
                           type="radio" name="category_id"> </label>
                </div>
              </div>
              <CategoryGroup v-for="category in filteredCategories" :key="`category-group-${category.id}`"
                             :category="category" @setCategory="setCategory" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FilterMenu',
    props: {
      categories: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        categorySearch: '',
        opened: false
      };
    },
    computed: {
      filteredCategories() {
        let parents = this.categories.map(el => {
          return { ...el, children: this.categories.filter(item => item.parent_id === el.id) };
        }).filter(el => el.parent_id === null);
        if (this.categorySearch) parents = parents.filter(el => el.name.match(this.categorySearch)
          || el.children.filter(el => el.name.match(this.categorySearch)).length > 0);
        return parents;
      },
    },
    mounted() {

    },
    methods:{
      setCategory(v){
        this.opened = false;
        this.$emit('setCategory',v)
      }
    }
  };
</script>

<style scoped>

</style>
