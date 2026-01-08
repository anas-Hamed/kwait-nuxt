<template>
  <div
    class="flex  relative text-center overflow-x-scroll overflow-y-hidden   w-full  py-2  "
  >
    <div class="flex w-auto   mx-auto    text-center   text-mix-text   ">
      <slot> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HorizontalSlider',
}
</script>

<style scoped></style>
