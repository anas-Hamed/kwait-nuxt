// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@sidebase/nuxt-auth',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'https://mwaqi3.com/api',
      mapKey: process.env.MAP_KEY || '',
      phonePrefix: process.env.PHONE_PREFIX || '+965',
      debug: process.env.DEBUG || 'false',
      gtagId: 'G-6WEZXW1350',
    },
  },

  app: {
    head: {
      title: 'Kuwait Explorer',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { charset: 'utf-8' },
        {
          name: 'keywords',
          content:
            'kuwait,explorer,kuwait explorer,companies,دليل الكويت,شركات الكويت,الكويت,اكسبلورر',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: 'https://kuwaitexplorer.com',
        },
        { rel: 'canonical', href: 'https://kuwaitexplorer.com' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/app.css'],

  i18n: {
    locales: [
      { code: 'en', file: 'en.js', dir: 'ltr', language: 'en-US' },
      { code: 'ar', file: 'ar.js', dir: 'rtl', language: 'ar-SA' },
    ],
    defaultLocale: 'ar',
    strategy: 'prefix_and_default',
    langDir: '../lang/',
  },

  routeRules: {
    '/api/**': { proxy: 'https://mwaqi3.com/api/**' },
  },

  auth: {
    baseURL: '/api',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/user/login', method: 'post' },
        signOut: false,
        getSession: { path: '/user', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/data/token',
        cookieName: 'auth:token',
        maxAgeInSeconds: 2592000,
        headerName: 'Authorization',
        type: 'Bearer',
      },
      session: {
        dataType: {
          id: 'number',
          name: 'string',
          email: 'string',
          phone: 'string',
        },
        dataResponsePointer: '/data/user',
      },
    },
    globalAppMiddleware: false,
  },
});
