export default defineNuxtPlugin(async () => {
  const appStore = useAppStore();
  await appStore.fetchInitialData();
});
