export default defineNuxtRouteMiddleware(async () => {
  const { status } = useAuth();
  if (status.value === 'authenticated') {
    try {
      const config = useRuntimeConfig();
      const token = useCookie('auth:token');
      const data: any = await $fetch('notifications/numberUnread', {
        baseURL: config.public.baseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const appStore = useAppStore();
      appStore.setNotificationsCount(data.data);
    } catch {
      // silently fail
    }
  }
});
