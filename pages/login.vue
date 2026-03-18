<template>
  <div class="flex flex-col justify-center items-center py-4">
    <Card class="max-w-screen-md w-full">
      <CardContent class="p-0">
        <Tabs default-value="login" class="w-full">
          <TabsList class="w-full rounded-none rounded-t-lg h-12 bg-accent">
            <TabsTrigger value="login" as-child>
              <LLink :to="{ name: 'login' }" class="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 rounded-md">
                {{ $t('login') }}
              </LLink>
            </TabsTrigger>
            <TabsTrigger value="register" as-child>
              <LLink :to="{ name: 'register' }" class="px-6 py-2 rounded-md">
                {{ $t('register') }}
              </LLink>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div class="flex flex-row-reverse flex-wrap p-8">
          <div class="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
            <img src="~/assets/images/h_logo.png" class="w-64" />
          </div>
          <div class="w-full md:w-1/2">
            <form @submit.prevent="login">
              <MyInput id="email" v-model="form.email" placeholder="example@example.com" :label="$t('email')"
                       error="email" input-dir="ltr" />
              <MyInput id="password" v-model="form.password" placeholder="******" type="password" :label="$t('password')"
                       error="password" input-dir="ltr" />
              <Button type="submit" class="w-full mt-4" size="lg">
                <LoadingCircle :loading="loading">{{ $t('login') }}</LoadingCircle>
              </Button>
            </form>
            <div class="text-center py-3">
              <LLink class="text-sm text-blue-600 hover:underline" :to="{ name: 'forget-password' }">{{ $t('forget_password') }}</LLink>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

const { signIn } = useAuth()
const api = useApi()
const appStore = useAppStore()
const validationStore = useValidationStore()

const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)

async function login() {
  loading.value = true
  try {
    await signIn(form.value)
    const countRes = await api.get('notifications/numberUnread')
    appStore.setNotificationsCount(countRes.data)
  } catch (e) {
    const status = e?.response?.status || e?.statusCode
    if (status === 401) {
      validationStore.setErrors({ 'password': ['تأكد من صحة البيانات'] })
    }
  } finally {
    loading.value = false
  }
}
</script>
