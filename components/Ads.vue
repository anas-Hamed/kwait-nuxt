<template>
  <LoadingPlaceHolder :top="40" :loading="loading">
    <hooper   :rtl="$i18n.locale === 'ar'" :infinite-scroll="ads.length > 1" :auto-play="ads.length > 1" :play-speed="4000" :wheel-control="false" style="height: fit-content">
      <slide
        v-for="ad in ads" :key="ad.id">
        <ImagePlaceholder
          class="rounded-xl  overflow-hidden  border"
          :image="ad[attribute]"
          :top="40"
          alt=""
        />
      </slide>
      <hooper-pagination slot="hooper-addons"></hooper-pagination>
    </hooper>
  </LoadingPlaceHolder>
</template>

<script>
  import { Hooper, Slide, Pagination as HooperPagination } from 'hooper';
  import LoadingPlaceHolder from './LoadingPlaceholder';
  import 'hooper/dist/hooper.css';
  import ImagePlaceholder from '~/components/ImagePlaceholder';

  export default {
    'name': 'Ads',
    components: { LoadingPlaceHolder, ImagePlaceholder, Hooper, Slide, HooperPagination },
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
