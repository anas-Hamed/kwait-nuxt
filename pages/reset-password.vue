<template>
  <div class="flex justify-center items-center py-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-center text-xl">{{ $t('reset_password') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="restPass">
          <MyInput id="email" readonly :label="$t('email')" v-model="email" type="text"
                   placeholder="example@example.com" inputDir="ltr" />
          <MyInput id="password" :label="$t('password')" v-model="form.password" type="password" error="password" />
          <MyInput id="password_confirmation" :label="$t('')" v-model="form.password_confirmation"
                   type="password" error="password_confirmation" />
          <Button variant="secondary" class="w-full mt-3" size="lg" type="submit">
            <LoadingCircle :loading="loading">{{ $t('send') }}</LoadingCircle>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

export default {
  name: 'ResetPassword',
  components: { Card, CardContent, CardHeader, CardTitle, Button },
  data() {
    return {
      token: this.$route.query.token,
      email: this.$route.query.email,
      form: { password: '', password_confirmation: '' },
      loading: false,
    }
  },
  methods: {
    restPass() {
      this.loading = true
      const api = useApi()
      api.post('password/reset', {
        token: this.token,
        email: this.email,
        password: this.form.password,
        password_confirmation: this.form.password_confirmation,
      }).then((data) => {
        if (data.success === true) {
          this.loading = false
          const tokenCookie = useCookie('auth:token')
          tokenCookie.value = data.data.token
          const { getSession } = useAuth()
          getSession()
        } else {
          this.loading = false
        }
      }).catch((err) => {
        this.loading = false
        const status = err?.response?.status || err?.statusCode
        if (status === 411) {
          this.$swal({
            icon: 'error',
            title: 'فشل',
            text: 'يرجى المحاولة لاحقا',
            showConfirmButton: false,
            timer: 3000,
          })
          const validationStore = useValidationStore()
          validationStore.setErrors({ token: ['انتهت صلاحية الرابط'] })
        }
      })
    },
  },
}
</script>
