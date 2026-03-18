<template>
  <div>
    <h1 class="text-2xl font-bold text-primary mb-1">{{ $t('new_account') }}</h1>
    <p class="text-muted-foreground text-sm mb-8">{{ $t('register_subtitle') }}</p>

    <form @submit.prevent="register">
      <MyInput id="name" v-model="form.name" :label="$t('name')" :placeholder="$t('account_name')" type="name" error="name" />
      <MyInput id="email" v-model="form.email" :label="$t('email')" placeholder="example@example.com" type="email"
               input-dir="ltr" error="email" />
      <Phone id="phone" v-model="form.phone" :label="$t('phone')" placeholder="+965xxxxxxx" type="tel"
             input-dir="ltr" error="phone" />
      <MyInput id="password" v-model="form.password" :label="$t('password')" placeholder="••••••••" type="password"
               input-dir="ltr" error="password" />
      <MyInput id="password_confirmation" v-model="form.password_confirmation"
               :label="$t('password_confirmation')" input-dir="ltr"
               placeholder="••••••••" type="password" error="password_confirmation" />

      <Button type="submit" class="w-full h-11 rounded-xl mt-4" size="lg">
        <LoadingCircle :loading="loading">{{ $t('register') }}</LoadingCircle>
      </Button>
    </form>

    <p class="text-center text-sm text-muted-foreground mt-6">
      {{ $t('have_account') }}
      <LLink :to="{ name: 'login' }" class="text-primary font-bold hover:underline">{{ $t('login') }}</LLink>
    </p>
  </div>
</template>

<script setup>
import { Button } from '~/components/ui/button'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'auth' })

const api = useApi()
const { getSession } = useAuth()
const localePath = useLocalePath()

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
})
const loading = ref(false)

async function register() {
  loading.value = true
  try {
    await api.post('user/register', form.value)
    // Login after register using api.post to avoid CORS
    const loginRes = await api.post('user/login', {
      email: form.value.email,
      password: form.value.password
    })
    // Set raw token in cookie (nuxt-auth adds "Bearer " prefix automatically)
    useCookie('auth:token', { maxAge: 2592000 }).value = loginRes.data.token
    await getSession()
    toast.success('تم إنشاء الحساب بنجاح')
    await navigateTo(localePath({ name: 'index' }), { external: true })
  } catch (e) {
    toast.error('تأكد من صحة البيانات')
  } finally {
    loading.value = false
  }
}
</script>
