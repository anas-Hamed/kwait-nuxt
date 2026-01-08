<template>
  <i style="all: unset" v-html="icon"></i>
</template>

<script>
import Icons from '~/helpers/Icons'
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      default: 'questionMark',
    },
    sizeClass: {
      type: String,
      default: 'w-5 h-5',
    },
    border: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    icon() {
      const rawIcon = Icons[this.name] ?? Icons.questionMark
      return rawIcon.replace('icon-size', this.sizeClass).replace('border-width',this.border)
    },
  },
}
</script>

<style scoped></style>
