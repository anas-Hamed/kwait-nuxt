import { defineStore } from 'pinia';

export const useValidationStore = defineStore('validations', {
  state: () => ({
    errors: {} as Record<string, string[]>,
  }),

  actions: {
    setErrors(errors: Record<string, string[]>) {
      this.errors = errors;
    },
    clearErrors() {
      this.errors = {};
    },
  },
});
