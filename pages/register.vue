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
          <form @submit.prevent="register">
            <MyInput id="name" v-model="form.name" :label="$t('name')" :placeholder="$t('account_name')" type="name"
                     error="name" />
            <MyInput id="email" v-model="form.email" :label="$t('email')" placeholder="example@example.com" type="email"
                     input-dir="ltr"
                     error="email" />
            <Phone id="phone" v-model="form.phone" :label="$t('phone')" placeholder="+965xxxxxxx" type="tel"
                   input-dir="ltr"
                   error="phone" />
            <MyInput id="password" v-model="form.password" :label="$t('password')" placeholder="******" type="password"
                     input-dir="ltr"
                     error="password" />
            <MyInput id="password_confirmation" v-model="form.password_confirmation"
                     :label="$t('password_confirmation')" input-dir="ltr"
                     placeholder="******" type="password" error="password_confirmation" />
            <button class="rounded bg-primary text-white mt-4 w-full p-2 ">
              <LoadingCircle :loading="loading">{{$t('register')}}</LoadingCircle>
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import LLink from '~/components/l-link';
  import MyInput from '~/components/MyInput';
  import LoadingCircle from '~/components/loading-circle';

  export default {
    name: 'Register',
    components: { LoadingCircle, MyInput, LLink },
    middleware: 'auth',
    auth: 'guest',
    head() {
      return this.metaBuilder(this.$t('register'));
    },
    data() {
      return {
        form: {
          name: '',
          email: '',
          phone: '',
          password: '',
          password_confirmation: ''
        },
        loading: false
      };
    },
    methods: {
      async register() {
        this.loading = true;
        try {
          await this.$axios.post('user/register', this.form);
          await this.$auth.loginWith('local', { data: this.form });
        } catch ({ response }) {

        } finally {
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped>

</style>
