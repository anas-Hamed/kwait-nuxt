<template>
  <div class="flex flex-wrap mb-8 justify-evenly items-center">
    <div class="w-full sm:w-1/3 flex flex-col justify-center items-center mb-3 p-2">
      <Globe :size="32" class="text-secondary" />
      <a target="_blank" :href="`${setting.website}`" class="text-xs mt-2 hover:text-secondary transition-colors" dir="ltr">{{ setting.website }}</a>
    </div>
    <div class="w-full sm:w-1/3 flex flex-col justify-center items-center mb-3 p-2">
      <Mail :size="32" class="text-secondary" />
      <a :href="`mailto:${setting.email}`" class="text-xs mt-2 hover:text-secondary transition-colors" dir="ltr">{{ setting.email }}</a>
    </div>
    <div class="w-full sm:w-1/3 flex flex-col justify-center items-center mb-3 p-2">
      <Phone :size="32" class="text-secondary" />
      <a :href="`tel:${setting.phone}`" class="text-xs mt-2 hover:text-secondary transition-colors" dir="ltr">{{ setting.phone }}</a>
    </div>
  </div>
</template>

<script setup>
import { Globe, Mail, Phone } from 'lucide-vue-next'
</script>
