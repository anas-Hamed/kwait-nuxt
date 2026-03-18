export default defineNuxtPlugin((nuxtApp) => {
  // Global mixin for Options API compatibility
  nuxtApp.vueApp.mixin({
    computed: {
      errors() {
        const store = useValidationStore();
        return store.errors;
      },
      setting() {
        const store = useAppStore();
        return store.setting;
      },
      unread_notifications() {
        const store = useAppStore();
        return store.unread_notifications;
      },
      media() {
        // Provide basic breakpoint info for SSR safety
        if (typeof window === 'undefined') {
          return {
            isPhone: false,
            isTablet: false,
            isDesktop: true,
            canTouch: false,
            breakpoint: 'xl',
          };
        }
        const w = window.innerWidth;
        return {
          isPhone: w < 640,
          isTablet: w >= 640 && w < 1024,
          isDesktop: w >= 1024,
          canTouch: 'ontouchstart' in window,
          breakpoint: w < 640 ? 'sm' : w < 768 ? 'md' : w < 1024 ? 'lg' : 'xl',
        };
      },
    },
    methods: {
      setErrors(errors: Record<string, string[]>) {
        const store = useValidationStore();
        store.setErrors(errors);
      },
      clearErrors() {
        const store = useValidationStore();
        store.clearErrors();
      },
      metaBuilder(
        title: string | null = null,
        description: string | null = null,
        image: string | null = null
      ) {
        const route = useRoute();
        const { t } = useI18n();
        const url = route.fullPath;
        const _title = title
          ? 'Kuwait Explorer | ' + title
          : 'Kuwait Explorer';
        const _description = description ?? t('kuwait_explorer_description');
        const _image = image ?? '/logo.png';
        return {
          title: _title,
          meta: [
            { charset: 'utf-8' },
            { hid: 'og:title', property: 'og:title', content: _title },
            {
              hid: 'og:description',
              property: 'og:description',
              content: _description,
            },
            {
              hid: 'description',
              property: 'description',
              content: _description,
            },
            { name: 'description', content: _description },
            { property: 'og:image', content: _image },
            { itemprop: 'image', content: _image },
            { property: 'og:url', content: url },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: _title },
            { name: 'twitter:description', content: _description },
            { name: 'twitter:image', content: _image },
          ],
        };
      },
      checkAuth(): boolean {
        const { status } = useAuth();
        if (status.value !== 'authenticated') {
          const { $toast } = useNuxtApp();
          if ($toast) {
            ($toast as any).error('يجب تسجيل الدخول', { timeout: 1000 });
          }
          return false;
        }
        return true;
      },
      localePath(route: any, locale?: string) {
        const fn = useLocalePath();
        return fn(route, locale);
      },
      localeRoute(route: any, locale?: string) {
        const fn = useLocaleRoute();
        return fn(route, locale);
      },
      switchLocalePath(locale: string) {
        const fn = useSwitchLocalePath();
        return fn(locale);
      },
    },
  });
});
