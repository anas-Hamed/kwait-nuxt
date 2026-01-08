<template>
  <div class="mx-auto text-center ">
    <div v-if="loading" class="loader mx-auto"></div>
    <slot v-else>

    </slot>
  </div>
</template>

<script>
export default {
  name: 'LoadingCircle',
  props:{
    loading:{
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loader {
  border: 2px solid #626262;
  border-radius: 50%;
  border-top: 2px solid transparent;
  width: 30px;
  height: 30px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
