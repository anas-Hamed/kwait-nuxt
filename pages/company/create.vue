<script setup>
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/profile/add-company', { redirectCode: 301 })
    }
  ]
})
</script>

<template>
  <div />
</template>
