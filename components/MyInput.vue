<template>
  <div class="mb-3">
    <Label :for="id" class="text-sm font-medium">
      {{ label }} <span v-if="required" class="text-destructive">*</span>
    </Label>
    <div :dir="inputDir" class="flex w-full items-center mt-1">
      <div v-if="prefix" class="h-10 px-3 flex items-center justify-center font-bold bg-accent rounded-s-md border border-e-0 border-input text-sm">
        {{ prefix }}
      </div>
      <Input
        v-bind="$attrs"
        :id="id"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :class="[
          prefix ? 'rounded-s-none' : '',
          (errors && errors[error]) ? 'border-destructive focus-visible:ring-destructive' : ''
        ]"
        class="bg-accent"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <InputError v-if="error" :name="error" />
  </div>
</template>

<script>
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export default {
  name: 'MyInput',
  components: { Input, Label },
  inheritAttrs: false,
  props: {
    id: { required: true, type: String, default: 'input' },
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
    error: { type: String, default: '' },
    type: { type: String, default: 'text' },
    prefix: { type: String, default: '' },
    inputDir: { type: String, required: false },
    required: { type: Boolean, required: false },
    modelValue: { required: false, default: null, type: [String, Number, Object] },
  },
  emits: ['update:modelValue'],
}
</script>
