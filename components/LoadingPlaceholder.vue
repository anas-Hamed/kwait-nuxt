<template>
    <div>
        <div v-if="loading" class="relative gradient-loading"
             :style="`padding-left: ${left}%;padding-top: ${top}%;height: 100%` ">

        </div>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script>
  export default {
    name: 'LoadingPlaceHolder',
    props: {
      left: {
        type: Number,
        default: 0
      },
      top: {
        type: Number,
        default: 0
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
  }
</script>

<style scoped>
    .gradient-loading {
        animation: gradient-animation 3s ease-in-out infinite;
        opacity: 0.4;
    }
    @keyframes gradient-animation {
        0% {
            background: linear-gradient(to left, #adadb6 -85%, rgba(0, 0, 0, 0) 150%);
        }
        33% {
            background: linear-gradient(to left, #adadb6 50%, rgba(0, 0, 0, 0) 150%);
        }
        66% {
            background: linear-gradient(to left, #adadb6 100%, rgba(0, 0, 0, 0) 150%);
        }
        100% {
            background: linear-gradient(to left, #adadb6 0%, rgba(0, 0, 0, 0) 150%);
        }
    }
</style>