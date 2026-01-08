<template>
  <div class="bg-white border-t  flex p-12 justify-center items-center" v-if="setting.google_play || setting.apple_store">
    <div class="text-center">
      <h1 class="text-2xl mb-1 font-bold">{{$t('download_app')}}</h1>
      <p class="text-gray-600 mb-2">{{$t('download_app_sub')}}</p>
      <div class="flex flex-wrap justify-center items-center">
        <a v-if="setting.google_play" :href="setting.google_play" target="_blank"><img class="w-48 p-1" src="~assets/images/play.png" alt=""></a>
        <a v-if="setting.apple_store" :href="setting.apple_store" target="_blank"><img class="w-48 p-1" src="~assets/images/store.png" alt=""></a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AppDownload',
    data() {
      return {};
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
