import { ref, onMounted, onUnmounted } from 'vue';

export const useBreakpoint = () => {
  const isPhone = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);
  const canTouch = ref(false);
  const breakpoint = ref('');

  const update = () => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    isPhone.value = w < 640;
    isTablet.value = w >= 640 && w < 1024;
    isDesktop.value = w >= 1024;
    canTouch.value = 'ontouchstart' in window;

    if (w < 640) breakpoint.value = 'sm';
    else if (w < 768) breakpoint.value = 'md';
    else if (w < 1024) breakpoint.value = 'lg';
    else breakpoint.value = 'xl';
  };

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', update);
    }
  });

  return { isPhone, isTablet, isDesktop, canTouch, breakpoint };
};
