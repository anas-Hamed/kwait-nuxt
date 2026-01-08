<template>
  <div class="bg-white shadow p-8 leading-8">
    <span v-html="setting.terms"></span>
  </div>
</template>

<script>
  export default {
    name: 'Terms',
    head() {
      return this.metaBuilder(this.$t('terms'));
    },
  };
</script>

<style scoped>

</style>
