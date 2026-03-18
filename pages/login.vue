<template>
  <div class="flex flex-col justify-center items-center py-2">
    <div class="rounded bg-white shadow border px-4 py-2 max-w-screen-md w-full">
      <div class="flex px-2">
        <LLink class="my-1 nav-item mx-3" :to="{name: 'login'}"> {{$t('login')}}</LLink>
        <LLink class="my-1 nav-item mx-3" :to="{name: 'register'}"> {{$t('register')}}</LLink>
      </div>
      <div class="flex flex-row-reverse flex-wrap p-8">
        <div class="w-full md:w-2/4 flex items-center justify-center">
          <img src="~/assets/images/h_logo.png" class="w-64" />
        </div>
        <div class="w-full md:w-2/4">
          <form @submit.prevent="login">
            <MyInput id="email" v-model="form.email" placeholder="example@example.com" :label="$t('email')"
                     error="email" input-dir="ltr" />
            <MyInput id="password" v-model="form.password" placeholder="******" type="password" :label="$t('password')"
                     error="password" input-dir="ltr" />

            <button class="rounded bg-primary text-white mt-4 w-full p-2">
              <LoadingCircle :loading="loading">{{$t('login')}}</LoadingCircle>
            </button>
          </form>
          <div class="text-center py-2">
            <LLink class="text-blue-600 my-1" :to="{name: 'forget-password'}">{{$t('forget_password')}}</LLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
      validationStore.setErrors({'password': ['\u062A\u0623\u0643\u062F \u0645\u0646 \u0635\u062D\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A']})
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
