<template>
  <div>
    <label>{{ label }} <span v-if="required" class="required"></span></label>
    <vue-tel-input :value="value"  class="rounded-sides " dir="ltr" :class="[(errors && errors[error]) ?'border-error' : '']"
                   placeholder=""
                   @input="setPhone" />
    <InputError v-if="error" :name="error" />
  </div>
</template>

<script>
  import InputError from './InputError';
  export default {
    name: 'Phone',
    components: { InputError },
    props: {
      label: {
        type: String,
        default: 'Phone'
      },
      error: {
        type: String
      },
      value: {
        type: String
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        countries: [
          'KW'
        ]
      };
    },
    methods: {
      setPhone(formattedNumber, { number, valid, country }) {
        this.$emit('input', number);
      }
    }
  };
</script>

<style>


</style>
