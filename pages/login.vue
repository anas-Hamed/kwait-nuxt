<template>
  <div>
    <h1 class="text-2xl font-bold text-primary mb-1">{{ $t('welcome_back') }}</h1>
    <p class="text-muted-foreground text-sm mb-8">{{ $t('login_subtitle') }}</p>

    <form @submit.prevent="login">
      <MyInput id="email" v-model="form.email" placeholder="example@example.com" :label="$t('email')"
               error="email" input-dir="ltr" />
      <MyInput id="password" v-model="form.password" placeholder="••••••••" type="password" :label="$t('password')"
               error="password" input-dir="ltr" />

      <div class="flex justify-end mb-5">
        <LLink class="text-xs text-muted-foreground hover:text-primary transition-colors"
               :to="{ name: 'forget-password' }">
          {{ $t('forget_password') }}
        </LLink>
      </div>

      <Button type="submit" class="w-full h-11 rounded-xl" size="lg">
        <LoadingCircle :loading="loading">{{ $t('login') }}</LoadingCircle>
      </Button>
    </form>

    <p class="text-center text-sm text-muted-foreground mt-6">
      {{ $t('no_account') }}
      <LLink :to="{ name: 'register' }" class="text-primary font-bold hover:underline">{{ $t('register') }}</LLink>
    </p>
  </div>
</template>

<script setup>
import { Button } from '~/components/ui/button'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'auth' })

const { getSession } = useAuth()
const api = useApi()
const appStore = useAppStore()
const validationStore = useValidationStore()
const localePath = useLocalePath()

const form = ref({ email: '', password: '' })
const loading = ref(false)

async function login() {
  loading.value = true
  try {
    const res = await api.post('user/login', form.value)
    // Set raw token in cookie (nuxt-auth adds "Bearer " prefix automatically)
    useCookie('auth:token', { maxAge: 2592000 }).value = res.data.token
    // Refresh session — nuxt-auth now reads from the correct cookie
    await getSession()
    try {
      const countRes = await api.get('notifications/numberUnread')
      appStore.setNotificationsCount(countRes.data)
    } catch (_) {}
    toast.success('تم تسجيل الدخول بنجاح')
    await navigateTo(localePath({ name: 'profile' }), { external: true })
  } catch (e) {
    validationStore.setErrors({ 'password': ['تأكد من صحة البيانات'] })
    toast.error('تأكد من صحة البيانات')
  } finally {
    loading.value = false
  }
}
</script>
