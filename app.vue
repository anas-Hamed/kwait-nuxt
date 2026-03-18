<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <Toaster position="top-center" :rich-colors="true" />
  </ClientOnly>
</template>

<script setup>
import { Toaster } from 'vue-sonner'
</script>
