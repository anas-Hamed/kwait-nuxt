import Toast, { useToast, POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 3000,
  });

  const toast = useToast();

  return {
    provide: {
      toast: {
        success(msg: string, opts?: any) {
          toast.success(msg, opts);
          return {
            goAway(ms: number) {
              // vue-toastification handles timeout automatically
            },
          };
        },
        error(msg: string, opts?: any) {
          toast.error(msg, opts);
          return {
            goAway(ms: number) {
              // vue-toastification handles timeout automatically
            },
          };
        },
        info(msg: string, opts?: any) {
          toast.info(msg, opts);
          return {
            goAway(ms: number) {},
          };
        },
      },
    },
  };
});
