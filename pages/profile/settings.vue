<template>
  <div class="space-y-6">
    <!-- Personal Info -->
    <div class="bg-white rounded-2xl shadow-soft p-6">
      <h3 class="text-lg font-bold text-primary mb-5">{{ $t('update_personal_info') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <MyInput :label="$t('name')" error="name" id="name" v-model="user.name" :placeholder="$t('account_name')" />
        <MyInput :label="$t('email')" error="email" id="email" input-dir="ltr" v-model="user.email" placeholder="example@example.com" />
        <Phone id="phone" v-model="user.phone" :label="$t('phone')" placeholder="+965xxxxxxx" type="tel"
               input-dir="ltr" error="phone" />
      </div>
      <Button class="mt-2 rounded-xl" @click="updateInfo">
        <LoadingCircle :loading="updateLoading">{{ $t('save') }}</LoadingCircle>
      </Button>
    </div>

    <!-- Change Password -->
    <div class="bg-white rounded-2xl shadow-soft p-6">
      <h3 class="text-lg font-bold text-primary mb-5">{{ $t('change_password') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <MyInput :label="$t('old_password')" error="old_password" id="old_password" type="password"
                 v-model="form.old_password" placeholder="••••••••" />
        <MyInput :label="$t('new_password')" error="new_password" id="new_password" type="password"
                 v-model="form.new_password" placeholder="••••••••" />
        <MyInput :label="$t('new_password_confirmation')" error="new_password_confirmation"
                 id="new_password_confirmation" type="password"
                 v-model="form.new_password_confirmation" placeholder="••••••••" />
      </div>
      <Button class="mt-2 rounded-xl" @click="updatePassword">
        <LoadingCircle :loading="passwordLoading">{{ $t('save') }}</LoadingCircle>
      </Button>
    </div>
  </div>
</template>

<script>
import { Button } from '~/components/ui/button'
import { toast } from 'vue-sonner'

export default {
  name: 'ProfileIndex',
  components: { Button },
  data() {
    return {
      user: { name: '', email: '', phone: '' },
      originalPhone: '',
      form: { old_password: '', new_password: '', new_password_confirmation: '' },
      updateLoading: false,
      passwordLoading: false
    };
  },
  mounted() {
    const { data } = useAuth();
    // Strip +965 prefix for display in Phone input
    const rawPhone = (data.value?.phone || '').replace(/\D/g, '').replace(/^965/, '')
    // Kuwait numbers are 8 digits — if invalid length, clear so user can re-enter
    const phone = rawPhone.length === 8 ? rawPhone : ''
    this.user = { ...data.value, phone };
  },
  methods: {
    async updateInfo() {
      this.clearErrors();
      this.updateLoading = true;
      try {
        const api = useApi();
        const digits = (this.user.phone || '').replace(/\D/g, '')
        const phone = digits ? '+965' + digits : ''
        await api.put('user', { name: this.user.name, email: this.user.email, phone });
        toast.success(this.$t('operation_success'));
        const { getSession } = useAuth();
        await getSession();
      } catch (e) {
        const response = e?.response?._data || e?.data;
        if (response?.errors) this.setErrors(response.errors);
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
        toast.success(this.$t('operation_success'));
        this.form = { old_password: '', new_password: '', new_password_confirmation: '' };
      } catch (e) {
        const response = e?.response?._data || e?.data;
        if (response?.errors) this.setErrors(response.errors);
      } finally {
        this.passwordLoading = false;
      }
    }
  }
};
</script>
