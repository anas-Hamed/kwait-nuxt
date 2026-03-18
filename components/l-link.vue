<template>
  <NuxtLink v-bind="$attrs" :to="localeRoute(to)"><slot></slot></NuxtLink>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
const localeRoute = useLocaleRoute();
const props = defineProps({
  to: {
    type: [Object, String],
    required: true,
  },
});
</script>
