export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseUrl;

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    // Add locale header
    try {
      const { locale } = useI18n();
      headers.locale = locale.value;
    } catch {
      headers.locale = 'ar';
    }

    // Add auth token
    const token = useCookie('auth:token');
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }

    return headers;
  };

  const handleError = (error: any) => {
    const status = error?.response?.status || error?.statusCode;
    const data = error?.response?._data || error?.data;

    if (status === 401) {
      const { signOut } = useAuth();
      signOut();
    }

    if (status === 422 && data?.errors) {
      const validationStore = useValidationStore();
      validationStore.setErrors(data.errors);
    }

    throw error;
  };

  const request = async (url: string, options: any = {}) => {
    const validationStore = useValidationStore();
    validationStore.clearErrors();

    const params = { ...options.params };
    if (config.public.debug === 'true') {
      params.XDEBUG_SESSION_START = 'PHPSTORM';
    }

    try {
      return await $fetch(url, {
        baseURL,
        headers: {
          ...getHeaders(),
          ...options.headers,
        },
        ...options,
        params,
      });
    } catch (error) {
      return handleError(error);
    }
  };

  return {
    get: (url: string, params?: Record<string, any>) =>
      request(url, { method: 'GET', params }),

    post: (url: string, body?: any, options?: any) =>
      request(url, { method: 'POST', body, ...options }),

    put: (url: string, body?: any) =>
      request(url, { method: 'PUT', body }),

    delete: (url: string) =>
      request(url, { method: 'DELETE' }),
  };
};
