<template>
  <div>
    <div class="card">
      <div>

        <h3 class="text-2xl font-bold">{{user.name}}</h3>
        <button @click="$auth.logout()" class="text-blue-500 flex-centred" title="logout">
          <icon name="login"/>
          <span class="w-1"></span><span>{{$t('logout')}}</span></button>
      </div>
      <div class="h-12"></div>
      <div class="flex flex-wrap">
        <div class="w-full md:w-2/6 p-2">
          <h3 class="text-2xl mb-4">{{$t('update_personal_info')}}</h3>
          <MyInput :label="$t('name')" error="name" id="name" v-model="user.name"/>
          <Phone :label="$t('phone')" error="phone" id="phone" input-dir="ltr" v-model="user.phone"/>
          <MyInput :label="$t('email')" error="email" id="email" input-dir="ltr" v-model="user.email"/>
          <button @click="updateInfo" class="primary-btn">
            <LoadingCircle :loading="updateLoading">{{$t('save')}}</LoadingCircle>
          </button>
        </div>
        <div class="w-full md:w-2/6 p-2">
          <h3 class="text-2xl mb-4">{{$t('change_password')}}</h3>
          <MyInput :label="$t('old_password')" error="old_password" id="old_password" type="password"
                   v-model="form.old_password"/>
          <MyInput :label="$t('new_password')" error="new_password" id="new_password" type="password"
                   v-model="form.new_password"/>
          <MyInput :label="$t('new_password_confirmation')" error="new_password_confirmation"
                   id="new_password_confirmation" type="password"
                   v-model="form.new_password_confirmation"/>
          <button @click="updatePassword" class="primary-btn">
            <LoadingCircle :loading="passwordLoading">{{$t('save')}}</LoadingCircle>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProfileIndex',
    data() {
      return {
        user: {
          name: '',
          email: '',
          phone: ''
        },
        form: {
          old_password: '',
          new_password: '',
          new_password_confirmation: ''
        },
        updateLoading: false,
        passwordLoading: false
      };
    },
    mounted() {
      this.user = { ...this.$auth.user };
    },
    methods: {
      async updateInfo() {
        this.clearErrors();
        this.updateLoading = true;
        try {
          await this.$axios.put('user', this.user);
          this.$toast.success(this.$t('operation_success')).goAway(1000);
          this.$auth.fetchUser();
        } catch ({ response }) {
          this.setErrors(response.data.errors);
        } finally {
          this.updateLoading = false;
        }
      },
      async updatePassword() {
        this.clearErrors();
        this.passwordLoading = true;
        try {
          await this.$axios.put('user/update-password', this.form);
          this.$toast.success(this.$t('operation_success')).goAway(1000);
          this.form = {
            old_password: '',
            new_password: '',
            new_password_confirmation: ''
          };
        } catch ({ response }) {
          this.setErrors(response.data.errors);
        } finally {
          this.passwordLoading = false;
        }
      }
    }
  };
</script>

<style scoped>

</style>
