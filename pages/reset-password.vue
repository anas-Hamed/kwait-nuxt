<template>
  <div>
    <h1 class="text-2xl font-bold text-primary mb-1">{{ $t('reset_password') }}</h1>
    <p class="text-muted-foreground text-sm mb-8">{{ $t('new_password_subtitle') }}</p>

    <form @submit.prevent="resetPassword">
      <MyInput id="email" readonly :label="$t('email')" v-model="email" type="text"
               placeholder="example@example.com" input-dir="ltr" />
      <MyInput id="password" :label="$t('new_password')" v-model="form.password" type="password"
               placeholder="••••••••" error="password" input-dir="ltr" />
      <MyInput id="password_confirmation" :label="$t('new_password_confirmation')" v-model="form.password_confirmation"
               type="password" placeholder="••••••••" error="password_confirmation" input-dir="ltr" />

      <Button type="submit" class="w-full h-11 rounded-xl mt-4" size="lg">
        <LoadingCircle :loading="loading">{{ $t('reset_password') }}</LoadingCircle>
      </Button>
    </form>
  </div>
</template>

<script setup>
import { Button } from '~/components/ui/button'

definePageMeta({ layout: 'auth' })

import { toast } from 'vue-sonner'

const api = useApi()
const route = useRoute()
const { getSession } = useAuth()

const token = route.query.token
const email = ref(route.query.email || '')
const form = ref({ password: '', password_confirmation: '' })
const loading = ref(false)

async function resetPassword() {
  loading.value = true
  try {
    const data = await api.post('password/reset', {
      token,
      email: email.value,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    })
    if (data.success === true) {
      const tokenCookie = useCookie('auth:token')
      tokenCookie.value = data.data.token
      getSession()
    }
  } catch (err) {
    const status = err?.response?.status || err?.statusCode
    if (status === 411) {
      toast.error('يرجى المحاولة لاحقا')
      const validationStore = useValidationStore()
      validationStore.setErrors({ token: ['انتهت صلاحية الرابط'] })
    }
  } finally {
    loading.value = false
  }
}
</script>
