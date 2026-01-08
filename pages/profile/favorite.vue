<template>
  <div class="card ">
    <h3 class="text-2xl mb-4">{{$t('favorite')}}</h3>
    <div class="flex flex-wrap">
      <div :key="`company-${company.id}`" class="w-full md:w-2/4 p-1" v-for="company in favorite">
        <CompanyCard :company="company" class=""/>
      </div>
      <div class="w-full">
        <span v-if="favorite && favorite.length === 0">{{$t('no_favorite_companies')}}</span>
        <div class="py-2">
          <LLink :to="{name: 'company'}" class="font-bold">{{$t('explore_companies')}}</LLink>
        </div>
      </div>
    </div>
    <LLink :to="{name: 'favorite'}" class="mt-8 flex items-center">
      <span class="rounded-full w-8 h-8 bg-secondary flex items-center justify-center text-white"><Icon
        name="plus"/></span>
      <div class="w-1"></div>
      <b>{{$t('show_all')}}</b>
    </LLink>
  </div>
</template>

<script>
  export default {
    name: 'Favorite',
    props: {
      favorite: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {};
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
