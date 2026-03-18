<template>
  <div class="flex flex-col justify-center items-center py-4">
    <Card class="max-w-screen-md w-full">
      <CardContent class="p-0">
        <Tabs default-value="register" class="w-full">
          <TabsList class="w-full rounded-none rounded-t-lg h-12 bg-accent">
            <TabsTrigger value="login" as-child>
              <LLink :to="{ name: 'login' }" class="px-6 py-2 rounded-md">
                {{ $t('login') }}
              </LLink>
            </TabsTrigger>
            <TabsTrigger value="register" as-child>
              <LLink :to="{ name: 'register' }" class="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 rounded-md">
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
            <form @submit.prevent="register">
              <MyInput id="name" v-model="form.name" :label="$t('name')" :placeholder="$t('account_name')" type="name" error="name" />
              <MyInput id="email" v-model="form.email" :label="$t('email')" placeholder="example@example.com" type="email"
                       input-dir="ltr" error="email" />
              <Phone id="phone" v-model="form.phone" :label="$t('phone')" placeholder="+965xxxxxxx" type="tel"
                     input-dir="ltr" error="phone" />
              <MyInput id="password" v-model="form.password" :label="$t('password')" placeholder="******" type="password"
                       input-dir="ltr" error="password" />
              <MyInput id="password_confirmation" v-model="form.password_confirmation"
                       :label="$t('password_confirmation')" input-dir="ltr"
                       placeholder="******" type="password" error="password_confirmation" />
              <Button type="submit" class="w-full mt-4" size="lg">
                <LoadingCircle :loading="loading">{{ $t('register') }}</LoadingCircle>
              </Button>
            </form>
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

const api = useApi()
const { signIn } = useAuth()

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
    await signIn(form.value)
  } catch (e) {
    // handled by useApi
  } finally {
    loading.value = false
  }
}
</script>
