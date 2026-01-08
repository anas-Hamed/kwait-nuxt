<template>
  <div class=" flex-centred  py-1 mx-1 ">
    <nuxt-link v-if="$i18n.locale === 'en'" class=" text-sm"
               :to="switchLocalePath('ar')">
      <div class="flex-centred">
        <icon name="world" size-class="w-4"></icon>
        <div class="-mb-1 md:mb-0" >AR</div>
      </div>

    </nuxt-link>
    <nuxt-link v-else class="text-sm"
               :to="switchLocalePath('en')">
      <div class="flex-centred">
        <icon name="world" size-class="w-4"></icon>
        <div  class="-mb-1 md:mb-0">EN</div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
  import Icon from './Icon';

  export default {
    name: 'LangSwitch',
    components: { Icon },
    mounted() {
      this.$i18n.onLanguageSwitched = (oldLocale, newLocale) => {
        this.$moment.locale(newLocale);
        this.$axios.get('setting').then(data => {
          this.$store.dispatch('setSetting', data.data.data);
        });
      };
    }
  };
</script>

<style scoped>

</style>
