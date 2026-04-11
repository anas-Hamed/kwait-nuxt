<template>
  <div class="mb-3">
    <Label :for="id" class="text-sm font-medium">
      {{ label }} <span v-if="required" class="text-destructive">*</span>
    </Label>
    <div dir="ltr" class="flex w-full items-center mt-1">
      <div class="h-11 px-3.5 flex items-center justify-center gap-2 bg-[#f9fafb] rounded-s-xl border border-e-0 border-input text-sm text-foreground shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" class="w-7 h-5 rounded-[3px]">
          <rect width="900" height="600" fill="#fff"/>
          <rect width="900" height="200" fill="#007A3D"/>
          <rect y="400" width="900" height="200" fill="#CE1126"/>
          <path d="M0,0 L300,200 L300,400 L0,600Z" fill="#000"/>
        </svg>
        <span class="text-sm font-semibold">+965</span>
      </div>
      <input
        :id="id"
        ref="phoneInput"
        type="tel"
        maxlength="8"
        placeholder="xxxxxxxx"
        class="flex h-11 w-full rounded-xl rounded-s-none border border-input bg-white px-4 py-2.5 text-sm text-foreground shadow-[0_1px_2px_0_rgba(17,24,39,0.04)] transition-all duration-200 placeholder:text-[#9ca3af] hover:border-[#cbd5e1] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[(errors && errors[error]) ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : '']"
        :value="modelValue"
        @input="onInput"
      />
    </div>
    <InputError v-if="error" :name="error" />
  </div>
</template>

<script>
import { Label } from '~/components/ui/label'

export default {
  name: 'Phone',
  components: { Label },
  props: {
    id: { type: String, default: 'phone' },
    label: { type: String, default: 'Phone' },
    error: { type: String },
    modelValue: { type: String },
    required: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(e) {
      const digits = e.target.value.replace(/\D/g, '')
      e.target.value = digits
      this.$emit('update:modelValue', digits)
    }
  }
}
</script>
