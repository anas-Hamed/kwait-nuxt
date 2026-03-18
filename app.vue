<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="top-center" :rich-colors="true" />
</template>

<script setup>
import { Toaster } from 'vue-sonner'
</script>
