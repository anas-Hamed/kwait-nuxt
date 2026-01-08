<template>
  <nuxt-link v-bind="$attrs"   :to="localeRoute(to)" ><slot></slot></nuxt-link>
</template>

<script>
export default {
  name: 'LLink',
  inheritAttrs: false,
  props:{
    to:{
      type:  [Object,String],
      required: true
    },
  }
};
</script>

<style scoped>

</style>
