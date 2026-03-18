<template>
  <div>
    <label>{{ label }} <span v-if="required" class="required"></span></label>
    <vue-tel-input
      v-model="phone"
      dir="ltr"
      class="rounded-sides"
      :class="[(errors && errors[error]) ? 'border-error' : '']"
      default-country="KW"
      :only-countries="['KW']"
      :auto-default-country="false"
      :input-options="{ placeholder: '', type: 'tel' }"
      mode="international"
      @on-input="onInput"
    />
    <InputError v-if="error" :name="error" />
  </div>
</template>

<script>
  export default {
    name: 'Phone',
    props: {
      label: {
        type: String,
        default: 'Phone'
      },
      error: {
        type: String
      },
      modelValue: {
        type: String
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    data() {
      return {
        phone: this.modelValue || ''
      };
    },
    watch: {
      modelValue(val) {
        if (val !== this.phone) {
          this.phone = val || '';
        }
      }
    },
    methods: {
      onInput(formattedNumber, phoneObject) {
        if (phoneObject && phoneObject.formatted) {
          this.$emit('update:modelValue', phoneObject.formatted);
        } else {
          this.$emit('update:modelValue', formattedNumber);
        }
      }
    }
  };
</script>

<style>

</style>
