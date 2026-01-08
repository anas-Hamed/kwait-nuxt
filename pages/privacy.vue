<template>
  <div class="bg-white shadow p-8 leading-8">
    <span v-html="setting.privacy"></span>
  </div>
</template>

<script>
export default {
  name: 'Privacy',
  head() {
    return this.metaBuilder(this.$t('privacy'));
  },
};
</script>

<style scoped>

</style>
