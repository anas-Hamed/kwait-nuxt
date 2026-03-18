<template>
  <div>
    <div class="card">
      <div>
        <h3 class="text-2xl font-bold">{{user.name}}</h3>
        <button @click="logout" class="text-blue-500 flex-centred" title="logout">
          <Icon name="login"/>
          <span class="w-1"></span><span>{{$t('logout')}}</span>
        </button>
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
    const { data } = useAuth();
    this.user = { ...data.value };
  },
  methods: {
    async logout() {
      const { signOut } = useAuth();
      await signOut();
    },
    async updateInfo() {
      this.clearErrors();
      this.updateLoading = true;
      try {
        const api = useApi();
        await api.put('user', this.user);
        this.$toast.success(this.$t('operation_success'));
        const { getSession } = useAuth();
        await getSession();
      } catch (e) {
        const response = e?.response?._data || e?.data;
        if (response?.errors) {
          this.setErrors(response.errors);
        }
      } finally {
        this.updateLoading = false;
      }
    },
    async updatePassword() {
      this.clearErrors();
      this.passwordLoading = true;
      try {
        const api = useApi();
        await api.put('user/update-password', this.form);
        this.$toast.success(this.$t('operation_success'));
        this.form = {
          old_password: '',
          new_password: '',
          new_password_confirmation: ''
        };
      } catch (e) {
        const response = e?.response?._data || e?.data;
        if (response?.errors) {
          this.setErrors(response.errors);
        }
      } finally {
        this.passwordLoading = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
