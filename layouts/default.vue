<template>
  <div class="min-h-screen bg-surface">
    <TopBar />
    <NavBar />
    <main class="max-w-screen-xl min-h-screen mx-auto py-8 px-3 md:px-4">
      <slot />
    </main>
    <AppDownload />
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
