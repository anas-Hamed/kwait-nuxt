import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    setting: {} as Record<string, any>,
    unread_notifications: 0 as number | string,
  }),

  actions: {
    async fetchInitialData() {
      const config = useRuntimeConfig();
      try {
        const settingRes: any = await $fetch('setting', {
          baseURL: config.public.baseUrl,
        });
        this.setting = settingRes.data;
      } catch (e) {
        // silently fail
      }

      try {
        const token = useCookie('auth:token');
        if (token.value) {
          const countRes: any = await $fetch('notifications/numberUnread', {
            baseURL: config.public.baseUrl,
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          });
          const count = countRes.data;
          this.unread_notifications = count <= 9 ? count : '+9';
        }
      } catch (e) {
        // silently fail
      }
    },

    setNotificationsCount(count: number) {
      this.unread_notifications = count <= 9 ? count : '+9';
    },

    increaseNotificationsCount() {
      if (this.unread_notifications !== '+9') {
        (this.unread_notifications as number)++;
      }
    },

    decreaseNotificationsCount() {
      if (this.unread_notifications !== 0) {
        (this.unread_notifications as number)--;
      }
    },

    resetNotificationsCount() {
      this.unread_notifications = 0;
    },

    setSetting(setting: Record<string, any>) {
      this.setting = setting;
    },
  },
});
