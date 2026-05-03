<template>
  <div
    :style="`padding-left: ${left}%;padding-top: ${top}%;padding-right: ${right}%;padding-bottom: ${bottom}%;`"
    class="relative overflow-hidden mx-auto"
    :class="{ 'rounded-full': circleImage }"
  >
    <!-- Always-visible fallback (Q logo) — keeps the slot looking branded while loading or on error -->
    <div
      class="absolute inset-0 bg-surface flex justify-center items-center"
      :class="{ 'rounded-full': circleImage }"
    >
      <img
        src="~/assets/images/category-placeholder.png"
        alt=""
        class="w-full h-full object-cover"
        :class="{ 'rounded-full': circleImage }"
      />
    </div>

    <!-- Real image overlay: fades in on load, removed on error so no broken icon shows -->
    <img
      v-if="image && !errored"
      :src="image"
      :alt="alt"
      :class="[
        { 'rounded-full': circleImage, 'opacity-0': !loaded },
        'absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300',
      ]"
      decoding="async"
      @load="onImageLoad"
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
      required: true,
    },
    alt: {
      type: String,
      required: false,
      default: '',
    },
    top: {
      type: Number,
      required: false,
      default: 0,
    },
    bottom: {
      type: Number,
      required: false,
      default: 0,
    },
    left: {
      type: Number,
      required: false,
      default: 0,
    },
    right: {
      type: Number,
      required: false,
      default: 0,
    },
    placeholder: {
      type: String,
      default: 'Loading',
    },
    circleImage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loaded: false,
      errored: false,
    }
  },
  watch: {
    image() {
      this.loaded = false
      this.errored = false
    },
  },
  mounted() {
    // If the image is already cached, the @load event may fire before this
    // listener attaches. Detect already-complete images on mount.
    this.$nextTick(() => {
      const img = this.$el?.querySelector?.('img[src]:not([src*="category-placeholder"])')
      if (img && img.complete && img.naturalWidth > 0) {
        this.loaded = true
      }
    })
  },
  methods: {
    onImageLoad() {
      this.loaded = true
    },
    onImageError() {
      this.errored = true
      this.loaded = false
    },
  },
}
</script>
