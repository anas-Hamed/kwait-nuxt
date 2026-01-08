module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'no-console': 1,
    'vue/no-v-html': 0,
    'prefer-const': 1,
    'eqeqeq': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/no-unused-components': 'off',
    'camelcase': 'off'
  }
}
