export default {
  loading:{
    color: '#ffc909',
    height: '3px',
    continuous: true
  },
  server:{
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },
  router:{
    middleware: ['notifications-count']
  },
  head: {
    title: 'Kuwait Explorer',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { charset: 'utf-8' },
      {name:"keywords" ,content:"kuwait,explorer,kuwait explorer,companies,دليل الكويت,شركات الكويت,الكويت,اكسبلورر"},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'alternate', hreflang: 'x-default',href: 'https://kuwaitexplorer.com' },
      { rel: 'canonical', href: 'https://kuwaitexplorer.com' },
      { name: 'theme-color', content: '#1b2c3b' },

    ]
  },
  css: [
    '~/assets/app.css'
  ],
  plugins: [
    { src: '~plugins/google-map', ssr: false },
    { src: '~plugins/vue-tags', ssr: false },
    { src: '~plugins/vue-gtag' },
    { src: '~plugins/infinity-loading', ssr: false },
    { src: '~plugins/vue-tel-input', ssr: false },
    { src: '~plugins/mixin' },
    { src: '~plugins/axios-interceptor' },

  ],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/moment'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/i18n',
    '@nuxtjs/dotenv',
    ['nuxt-sweetalert2',{
      confirmButtonColor: '#41b882',
      cancelButtonColor: '#ff7674',
    }],
    '@nuxtjs/toast',

  ],
  axios: {
    baseURL: process.env.BASE_URL
  },
  auth: {
    strategies: {
      'local': {
        maxAge: 2592000,
        token: {
          property: 'data.token',
          global: true
        },
        user: {
          property: 'data.user',
          autoFetch: true
        },
        endpoints: {
          login: { url: `/user/login`, method: 'post' },
          logout: false,
          user: { url: `/user`, method: 'get' }
        }
      }
    }
  },
  build: {},
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en',
        dir: 'ltr',
        iso: 'en-US'
      },
      {
        code: 'ar',
        file: 'ar',
        dir: 'rtl',
        iso: 'ar-EU'
      }
    ],
    defaultLocale: 'ar',
    langDir: 'lang',
    vueI18n: {
      fallbackLocale: 'ar'
    }
  },
};
