<template>
  <div v-if="value"
       class="fixed w-full h-full bg-black bg-opacity-50 top-0 left-0 flex justify-center items-center z-30">
    <button type="button" class="absolute left-1 top-0 p-2 text-white text-4xl" aria-label="Close" @click="close">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="dialog overflow-hidden bg-white rounded  z-50  -mt-12 text-center px-4 py-6 w-max-content">
      <slot>

      </slot>

    </div>
  </div>
</template>

<script>

  export default {
    name: 'Modal',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      const self = this;
      document.addEventListener('keyup', function(evt) {
        if (evt.keyCode === 27) {
          self.close();
        }
      });
    },
    methods: {
      close() {
        this.$emit('input', false);
      }
    }
  };
</script>

<style scoped>
  .dialog {
    animation: animate-dialog 0.1s ease-in-out;

  }

  @keyframes animate-dialog {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
