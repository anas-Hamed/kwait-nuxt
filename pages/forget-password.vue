<template>
  <div>
    <h1 class="text-2xl font-bold text-primary mb-1">{{ $t('reset_password') }}</h1>
    <p class="text-muted-foreground text-sm mb-8">{{ $t('reset_password_subtitle') }}</p>

    <form @submit.prevent="sendResetEmail">
      <MyInput id="email" v-model="email" :label="$t('email')" error="email" input-dir="ltr" placeholder="example@example.com" type="text" />

      <Button type="submit" class="w-full h-11 rounded-xl mt-4" size="lg">
        <LoadingCircle :loading="loading">{{ $t('send') }}</LoadingCircle>
      </Button>
    </form>

    <div class="text-center mt-6">
      <LLink :to="{ name: 'login' }" class="text-sm text-muted-foreground hover:text-primary transition-colors">
        {{ $t('login') }}
      </LLink>
    </div>
  </div>
</template>

<script setup>
import { Button } from '~/components/ui/button'

definePageMeta({ layout: 'auth' })

import { toast } from 'vue-sonner'

const api = useApi()
const email = ref('')
const loading = ref(false)

async function sendResetEmail() {
  loading.value = true
  try {
    await api.post('password/send-reset-email', { email: email.value })
    toast.success('تم ارسال رابط الاستعادة ، تفقد البريد الوارد و الرسائل غير المرغوب بها')
  } catch (e) {
    const status = e?.response?.status || e?.statusCode
    if (status !== 422) {
      toast.error('يرجى المحاولة لاحقا')
    }
  } finally {
    loading.value = false
  }
}
</script>
