<template>
  <div class="bg-white shadow p-8 leading-8">
    <span v-html="setting.about_us"></span>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  head() {
    return this.metaBuilder(this.$t('about_us'));
  },
};
</script>

<style scoped>

</style>
