<template>
  <div class="flex justify-center items-center">
    <form @submit.prevent="restPass" style="width: 100%; max-width: 500px">
      <div class="bg-white rounded shadow-md py-6 px-12">
        <h3 class="text-xl text-center">{{$t('reset_password')}}</h3>
        <div class="py-3">
          <MyInput
            id="email"
            readonly
            :label="$t('email')"
            v-model="email"
            type="text"
            placeholder="example@example.com"
            inputDir="ltr"
          />
          <MyInput
            id="password"
            :label="$t('password')"
            v-model="form.password"
            type="password"
            error="password"
          />
          <MyInput
            id="password_confirmation"
            :label="$t('')"
            v-model="form.password_confirmation"
            type="password"
            error="password_confirmation"
          />
        </div>
        <button class="w-full bg-secondary text-white p-2 focus:outline-none mt-3">
          <LoadingCircle :loading="loading">{{$t('send')}}</LoadingCircle>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      token: this.$route.query.token,
      email: this.$route.query.email,
      form: {
        password: '',
        password_confirmation: '',
      },
      loading: false,
    };
  },
  methods: {
    restPass() {
      this.loading = true;
      const api = useApi();
      api.post('password/reset', {
        token: this.token,
        email: this.email,
        password: this.form.password,
        password_confirmation: this.form.password_confirmation,
      })
        .then((data) => {
          if (data.success === true) {
            this.loading = false;
            const tokenCookie = useCookie('auth:token');
            tokenCookie.value = data.data.token;
            const { getSession } = useAuth();
            getSession();
          } else {
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
          const status = err?.response?.status || err?.statusCode;
          if (status === 411) {
            this.$swal({
              icon: 'error',
              title: '\u0641\u0634\u0644',
              text: '\u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0644\u0627\u062D\u0642\u0627',
              showConfirmButton: false,
              timer: 3000,
            });
            const validationStore = useValidationStore();
            validationStore.setErrors({ token: ['\u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0631\u0627\u0628\u0637'] });
          }
        });
    },
  },
};
</script>

<style scoped>
</style>
