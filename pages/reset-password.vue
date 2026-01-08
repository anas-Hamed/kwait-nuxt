<template>
  <div class="flex justify-center items-center">
    <form @submit.prevent="restPass"     style="width: 100%; max-width: 500px">
      <div
        class="bg-white rounded shadow-md py-6 px-12 "

      >
        <h3 class="text-xl text-center">{{$t('reset_password')}} </h3>
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
        <button
          class="w-full bg-secondary text-white p-2 focus:outline-none mt-3"
        >
          <LoadingCircle :loading="loading"
          >{{$t('send')}}</LoadingCircle
          >
        </button>

      </div>
    </form>
  </div>
</template>

<script>
  import MyInput from '../components/MyInput';
  import LoadingCircle from '../components/loading-circle';
  export default {
    name: 'ResetPassword',
    components: { LoadingCircle, MyInput },
    data() {
      return {
        token: this.$route.query.token,
        email: this.$route.query.email,
        form: {
          password: "",
          password_confirmation: "",
        },
        loading: false,
      };
    },
    methods: {
      restPass() {
        this.loading = true;
        this.$axios
          .post("password/reset", {
            token: this.token,
            email: this.email,
            password: this.form.password,
            password_confirmation: this.form.password_confirmation,
          })
          .then((data) => {
            if (data.data.success === true) {
              this.loading = false;
              this.$auth.setUserToken(data.data.data.token);
            } else {
              this.loading = false;
            }
          })
          .catch((err) => {
            this.loading = false;
            if (err.response?.status === 411) {
              this.$swal({
                icon: "error",
                title: "فشل",
                text: "يرجى المحاولة لاحقا",
                showConfirmButton: false,
                timer: 3000,
              });
              this.$validation.setErrors({ token: ["انتهت صلاحية الرابط"] });
            }
          });
      },
    },
  };
</script>

<style scoped>

</style>
