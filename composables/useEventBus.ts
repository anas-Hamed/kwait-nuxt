import { ref } from 'vue';

type EventCallback = (...args: any[]) => void;

const listeners = ref<Record<string, EventCallback[]>>({});

export const useEventBus = () => {
  const emit = (event: string, ...args: any[]) => {
    if (listeners.value[event]) {
      listeners.value[event].forEach((cb) => cb(...args));
    }
  };

  const on = (event: string, callback: EventCallback) => {
    if (!listeners.value[event]) {
      listeners.value[event] = [];
    }
    listeners.value[event].push(callback);
  };

  const off = (event: string, callback: EventCallback) => {
    if (listeners.value[event]) {
      listeners.value[event] = listeners.value[event].filter(
        (cb) => cb !== callback
      );
    }
  };

  return { emit, on, off };
};
