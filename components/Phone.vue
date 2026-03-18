<template>
  <div>
    <label>{{ label }} <span v-if="required" class="required"></span></label>
    <vue-tel-input :model-value="modelValue"  class="rounded-sides " dir="ltr" :class="[(errors && errors[error]) ?'border-error' : '']"
                   placeholder=""
                   @update:model-value="setPhone" />
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
        countries: [
          'KW'
        ]
      };
    },
    methods: {
      setPhone(phone, phoneObject) {
        if (phoneObject && phoneObject.number) {
          this.$emit('update:modelValue', phoneObject.number);
        }
      }
    }
  };
</script>

<style>


</style>
