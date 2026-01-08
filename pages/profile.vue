<template>
  <div>
    <div class="flex flex-col md:flex-row flex-wrap overflow-hidden px-1 gap-x-2 mb-3 md:mb-0 ">
      <LLink class="py-2 px-3 profile-link" to="/profile">{{$t('profile')}}</LLink>
      <LLink class="py-2 px-3 profile-link" to="/profile/my-companies">{{$t('my_companies')}}</LLink>
      <LLink class="py-2 px-3 profile-link" to="/profile/favorite">{{$t('favorite')}}</LLink>
      <LLink class="py-2 px-3 profile-link" to="/profile/trust-company">{{$t('trust_company')}}</LLink>
    </div>
    <NuxtChild :companies="companies" :favorite="favorite"/>
  </div>
</template>

<script>
  import MyInput from '../components/MyInput';
  import Icon from '../components/Icon';
  import LLink from '../components/l-link';
  import LoadingCircle from '../components/loading-circle';
  import Phone from '../components/Phone';

  export default {
    'name': 'Profile',
    components: { Phone, LoadingCircle, LLink, Icon, MyInput },
    middleware: 'auth',
    async asyncData(ctx) {
      let favorite = [];
      let companies = [];
      try {
        favorite = (await ctx.$axios.get('favorite?limit=2&orderDirection=desc')).data.data;
        companies = (await ctx.$axios.get('company/mine?orderDirection=desc')).data.data;
      } catch (e) {
      }
      return {
        favorite, companies
      };
    },
    mounted() {
      this.$nuxt.$on('company-un-favorite', id => {
        this.favorite.splice(this.favorite.findIndex(el => el.id === id), 1);
      });
      this.$nuxt.$on('company-deleted', id => {
        this.companies.splice(this.companies.findIndex(el => el.id === id), 1);
      });
    },
  };
</script>

<style scoped>
.profile-link.nuxt-link-exact-active{
  @apply bg-white rounded-t  shadow-md
}
</style>
