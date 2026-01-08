<template>
  <div class="min-h-screen bg-accent">
    <TopBar />
    <NavBar />
    <div class="max-w-screen-xl min-h-screen mx-auto py-12 px-2">
      <Nuxt />
    </div>
    <BFooter />
  </div>
</template>

<script>
  import TopBar from '../components/TopBar';
  import NavBar from '~/components/NavBar';
  import BFooter from '~/components/BFooter';

  export default {
    name: 'DefaultLayout',
    components: { TopBar, BFooter, NavBar },
    head() {
      return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true });
    },
    watch: {
      $route(newValue, oldValue) {
        this.clearErrors();
      }
    }
  };
</script>

<style>

</style>
