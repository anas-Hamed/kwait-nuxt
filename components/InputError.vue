<template>
  <ul v-if="_errors.length" class="mt-1 space-y-0.5">
    <li v-for="(error, key) in _errors" :key="key" class="text-destructive text-xs">{{ error }}</li>
  </ul>
</template>

<script>
export default {
  name: 'InputError',
  props: {
    name: { type: String, required: true },
  },
  computed: {
    _errors() {
      return this.errors && this.errors[this.name] ? this.errors[this.name] : []
    },
  },
}
</script>
