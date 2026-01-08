<template>
  <div :style=" `padding-left: ${left}%;padding-top: ${top}%;padding-right: ${right}%;padding-bottom: ${bottom}%;` "
    class="relative  overflow-hidden mx-auto">
    <div class="absolute bg-mix-gray-light text-mix-gray-dark flex justify-center items-center inset-0 w-full h-full">
      {{ placeholder }}
    </div>
    <img
      :alt="alt"
      :class="{'rounded-full': circleImage}"
      :src="image"
      :v-lazy-load="lazy"
      class="absolute inset-0 w-full h-full object-cover object-center flex justify-center items-center "
    />
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'ImagePlaceholder',
    props: {
      lazy: {
        default: false,
        type: Boolean
      },
      image: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        required: false,
        default: ''
      },
      top: {
        type: Number,
        required: false,
        default: 0
      },
      bottom: {
        type: Number,
        required: false,
        default: 0
      },
      left: {
        type: Number,
        required: false,
        default: 0
      },
      right: {
        type: Number,
        required: false,
        default: 0
      },
      placeholder: {
        type: String,
        default: 'Loading'
      },
      circleImage: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
