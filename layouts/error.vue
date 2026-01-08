<template>
  <div class="card text-center">
    <div v-if="error.statusCode === 404">
      <img class="w-72 mx-auto" src="~/assets/images/404.svg" alt="404-error" />
      <h1 class="text-4xl" >Page not found</h1>
    </div>
    <div v-if="error.statusCode === 500">
      <img class="w-72 mx-auto" src="~/assets/images/500.svg" alt="404-error" />
      <h1 class="text-4xl" >Server Error</h1>
    </div>
    <div v-if="error.statusCode === 403">
      <img class="w-72 mx-auto" src="~/assets/images/500.svg" alt="404-error" />
      <h1 class="text-4xl" >Permission Denied</h1>
    </div>
    <a href="/">Home page</a>
  </div>
</template>

<script>
  export default {
    props: ['error'],
  }
</script>
