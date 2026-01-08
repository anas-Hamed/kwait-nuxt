<template>

    <div class="flex flex-wrap  mb-8 justify-evenly items-center">
      <div class="w-full sm:w-1/3 flex flex-col justify-center items-center mb-3 p-2">
        <Icon name="world" size-class="w-8" />
        <a target="_blank" :href="`${setting.website}`" class="text-xs mt-2" dir="ltr">{{setting.website}}</a>
      </div>
      <div class="w-full sm:w-1/3 flex flex-col justify-center items-center mb-3 p-2">
        <icon name="email" size-class="w-8" />
        <a :href="`mailto:${setting.email}`" class="text-xs mt-2" dir="ltr">{{setting.email}}</a>
      </div>
      <div class="w-full sm:w-1/3 flex flex-col justify-center items-center mb-3 p-2">
        <icon name="phone" size-class="w-8" />
        <a :href="`tel:${setting.phone}`" class="text-xs mt-2" dir="ltr">{{setting.phone}}</a>
      </div>
    </div>
</template>

<script>
  import Icon from './Icon';
  export default {
    name: 'ContactIcons',
    components: { Icon },
    data() {
      return {};
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
