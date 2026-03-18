<template>
  <div class="bg-grey-200 flex flex-col justify-center items-center py-4">
    <div class="card p-3" style="width: 100%; max-width: 500px">
      <h2 class="text-primary text-2xl text-center mb-3">{{$t('reset_password')}}</h2>
      <div>
        <MyInput :label="$t('email')" name="email" error="email" v-model="email" input-dir="ltr" placeholder="example@example.com" type="text"/>
      </div>
      <button @click="sendResetEmail" class="rounded bg-secondary mt-3 w-full p-2">
        <LoadingCircle :loading="loading">{{$t('send')}}</LoadingCircle>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgetPassword',
  data() {
    return {
      loading: false,
      email: ''
    };
  },
  methods: {
    sendResetEmail() {
      this.loading = true;
      const api = useApi();
      api.post('password/send-reset-email', { email: this.email }).then(() => {
        this.$swal({
          icon: 'success',
          title: '\u0646\u062C\u0627\u062D',
          text: '\u062A\u0645 \u0627\u0631\u0633\u0627\u0644 \u0631\u0627\u0628\u0637 \u0627\u0644\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u060C \u062A\u0641\u0642\u062F \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0648\u0627\u0631\u062F \u0648 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u063A\u064A\u0631 \u0627\u0644\u0645\u0631\u063A\u0648\u0628 \u0628\u0647\u0627',
          showConfirmButton: false,
          timer: 3000,
        });
      }).catch(e => {
        const status = e?.response?.status || e?.statusCode;
        if (status !== 422) {
          this.$swal({
            icon: 'error',
            title: '\u0641\u0634\u0644',
            text: '\u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0644\u0627\u062D\u0642\u0627',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
</style>
