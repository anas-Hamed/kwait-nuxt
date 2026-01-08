<template>
  <div class=" flex flex-col justify-center items-center py-2 ">
    <div class="rounded bg-white shadow border px-4 py-2 max-w-screen-md w-full">
      <div class="flex  px-2">
        <LLink class=" my-1 nav-item mx-3" :to="{name: 'login'}"> {{$t('login')}}</LLink>
        <LLink class=" my-1 nav-item mx-3" :to="{name: 'register'}"> {{$t('register')}}</LLink>
      </div>
      <div class="flex flex-row-reverse flex-wrap p-8">
        <div class="w-full md:w-2/4 flex items-center justify-center">
          <img src="~assets/images/h_logo.png" class="w-64" />
        </div>
        <div class="w-full md:w-2/4">
          <form @submit.prevent="login">
            <MyInput id="email" v-model="form.email" placeholder="example@example.com" :label="$t('email')"
                     error="email" input-dir="ltr" />
            <MyInput id="password" v-model="form.password" placeholder="******" type="password" :label="$t('password')"
                     error="password" input-dir="ltr" />

            <button class="rounded bg-primary text-white mt-4 w-full p-2 ">
              <LoadingCircle :loading="loading">{{$t('login')}}</LoadingCircle>
            </button>
          </form>
          <div class="text-center py-2">
              <l-link class="text-blue-600 my-1" :to="{name: 'forget-password'}">{{$t('forget_password')}}</l-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import LLink from '~/components/l-link';
  import MyInput from '~/components/MyInput';

  export default {
    name: 'Login',
    components: { MyInput, LLink },
    middleware: 'auth',
    auth: 'guest',
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        loading: false
      };
    },
    head() {
      return this.metaBuilder(this.$t('login'));
    },
    methods: {
      async login() {
        this.loading = true;
        try {
          await this.$auth.loginWith('local', { data: this.form });
          const count = ((await this.$axios.get('notifications/numberUnread')).data.data);
          this.$store.dispatch('setNotificationsCount',count);
        } catch ({ response }) {
          if(response.status === 401){
            this.$store.dispatch('validations/setErrors',{'password': ['تأكد من صحة البيانات']});
          }

        } finally {
          this.loading = false;
        }

      }
    }
  };
</script>

<style scoped>

</style>
