import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs,
      moment: dayjs, // backward compat alias
    },
  };
});
