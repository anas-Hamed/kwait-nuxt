<template>
  <div>
    <client-only>
      <Carousel
        :autoplay="3000"
        dir="ltr"
        :items-to-show="1"
        :wrap-around="true">
        <slot>

        </slot>
        <template #addons>
          <Pagination />
        </template>
      </Carousel>
    </client-only>
  </div>
</template>

<script>
  import { Carousel, Slide, Pagination } from 'vue3-carousel';
  import 'vue3-carousel/dist/carousel.css';

  export default {
    name: 'Slider',
    components: { Carousel, Slide, Pagination }
  }
</script>

<style>
  .carousel__pagination-button--active .carousel__pagination-button__icon {
    background-color: #ffc909;
  }
  .carousel__pagination-button__icon {
    background-color: white;
  }
</style>
