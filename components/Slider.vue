<template>
  <div >
    <client-only>
      <carousel
        :autoplay="true"
        dir="ltr"
        :per-page="1"
        :scroll-per-page="true"
        :pagination-padding="2"
        :pagination-active-color="'#ffc909'"
        :pagination-color="'white'">
        <slot>

        </slot>
      </carousel>
    </client-only>
  </div>
</template>

<script>
  export default {
    name: 'Slider',
  }
</script>

<style >
  .VueCarousel-pagination{
    transform: translateY(-50px ) !important;
    z-index: 55555;
  }
  .VueCarousel-dot{
    outline: none !important;
  }
</style>
