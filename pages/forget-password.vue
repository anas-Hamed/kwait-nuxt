<template>
  <div class="flex flex-col justify-center items-center py-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-center text-2xl text-primary">{{ $t('reset_password') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <MyInput :label="$t('email')" name="email" error="email" v-model="email" input-dir="ltr" placeholder="example@example.com" type="text" />
        <Button variant="secondary" class="w-full mt-3" size="lg" @click="sendResetEmail">
          <LoadingCircle :loading="loading">{{ $t('send') }}</LoadingCircle>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

export default {
  name: 'ForgetPassword',
  components: { Card, CardContent, CardHeader, CardTitle, Button },
  data() {
    return { loading: false, email: '' }
  },
  methods: {
    sendResetEmail() {
      this.loading = true
      const api = useApi()
      api.post('password/send-reset-email', { email: this.email }).then(() => {
        this.$swal({
          icon: 'success',
          title: 'نجاح',
          text: 'تم ارسال رابط الاستعادة ، تفقد البريد الوارد و الرسائل غير المرغوب بها',
          showConfirmButton: false,
          timer: 3000,
        })
      }).catch(e => {
        const status = e?.response?.status || e?.statusCode
        if (status !== 422) {
          this.$swal({
            icon: 'error',
            title: 'فشل',
            text: 'يرجى المحاولة لاحقا',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>
