<template>
  <div class="mb-3">
    <Label :for="id" class="text-sm font-medium">
      {{ label }} <span v-if="required" class="text-destructive">*</span>
    </Label>
    <div dir="ltr" class="flex w-full items-center mt-1">
      <div class="h-10 px-4 flex items-center justify-center gap-2 bg-accent rounded-s-md border border-e-0 border-input text-sm shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" class="w-7 h-5 rounded-[3px] border border-border/50">
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
        class="flex h-10 w-full rounded-md rounded-s-none border border-input bg-accent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[(errors && errors[error]) ? 'border-destructive focus-visible:ring-destructive' : '']"
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
