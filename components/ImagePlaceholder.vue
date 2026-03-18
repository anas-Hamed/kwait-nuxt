<template>
  <div :style="`padding-left: ${left}%;padding-top: ${top}%;padding-right: ${right}%;padding-bottom: ${bottom}%;`"
    class="relative overflow-hidden mx-auto">
    <div class="absolute bg-surface text-muted-foreground flex justify-center items-center inset-0 w-full h-full">
      <img src="~/assets/images/logo.png" alt="fallback" class="w-8 h-8 opacity-20 rounded-md" />
    </div>
    <img
      :alt="alt"
      :class="{'rounded-full': circleImage}"
      :src="image"
      class="absolute inset-0 w-full h-full object-cover object-center"
      @error="onImageError"
    />
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ImagePlaceholder',
  props: {
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
  },
  methods: {
    onImageError(e) {
      e.target.style.display = 'none'
    }
  }
};
</script>
