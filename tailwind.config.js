module.exports = {
  mode: 'jit',
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `plugins/**/*.{js,ts}`,
    `nuxt.config.{js,ts}`
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#1b2c3b',
        secondary: '#ffc909',
        accent: '#ececec',
        accentSecondary: '#464646',
        facebook: '#3b5998',
        twitter: '#1da1f2',
        rate: '#ffc909',
      },
      outline: {
        own: '1px solid #464646',
      },
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
