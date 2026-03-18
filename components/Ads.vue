<template>
  <LoadingPlaceHolder :top="40" :loading="loading">
    <Carousel :items-to-show="1" :wrap-around="ads.length > 1" :autoplay="ads.length > 1 ? 4000 : 0" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
      <Slide
        v-for="ad in ads" :key="ad.id">
        <ImagePlaceholder
          class="rounded-xl  overflow-hidden  border"
          :image="ad[attribute]"
          :top="40"
          alt=""
        />
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>
  </LoadingPlaceHolder>
</template>

<script>
  import { Carousel, Slide, Pagination } from 'vue3-carousel';
  import 'vue3-carousel/dist/carousel.css';

  export default {
    name: 'Ads',
    components: { Carousel, Slide, Pagination },
    props: {
      ads: {
        type: Array,
        required: true
      },
      attribute: {
        type: String,
        default: 'image'
      },
      loading: {
        default: false,
        required: false,
        type: Boolean
      }
    }
  };
</script>

<style scoped>

</style>
