<template>
  <div class="min-h-screen bg-accent">
    <TopBar />
    <NavBar />
    <div class="max-w-screen-xl min-h-screen mx-auto py-12 px-2">
      <slot />
    </div>
    <BFooter />
  </div>
</template>

<script setup>
const head = useLocaleHead({ addSeoAttributes: true, addDirAttribute: true });
useHead(head);

const validationStore = useValidationStore();
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    validationStore.clearErrors();
  }
);
</script>
