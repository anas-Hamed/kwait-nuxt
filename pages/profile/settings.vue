<template>
  <div class="space-y-6">
    <!-- Personal Info -->
    <div class="bg-white rounded-2xl shadow-soft p-6">
      <h3 class="text-lg font-bold text-foreground mb-5">{{ $t('update_personal_info') }}</h3>
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
      <h3 class="text-lg font-bold text-foreground mb-5">{{ $t('change_password') }}</h3>
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

    <!-- Danger Zone -->
    <div class="da-zone">
      <div class="da-zone-head">
        <div class="da-zone-icon">
          <AlertTriangle :size="18" />
        </div>
        <div>
          <h3 class="da-zone-title">{{ $t('danger_zone') }}</h3>
          <p class="da-zone-sub">{{ $t('delete_account_warning') }}</p>
        </div>
      </div>

      <ul class="da-zone-list">
        <li>{{ $t('delete_account_consequence_1') }}</li>
        <li>{{ $t('delete_account_consequence_2') }}</li>
        <li>{{ $t('delete_account_consequence_3') }}</li>
      </ul>

      <AlertDialog v-model:open="deleteOpen">
        <AlertDialogTrigger as-child>
          <button type="button" class="da-zone-btn">
            <Trash2 :size="14" />
            {{ $t('delete_account') }}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent class="da-dialog">
          <AlertDialogHeader>
            <div class="da-dialog-icon">
              <AlertTriangle :size="22" />
            </div>
            <AlertDialogTitle class="da-dialog-title">{{ $t('delete_account_confirm_title') }}</AlertDialogTitle>
            <AlertDialogDescription class="da-dialog-desc">
              {{ $t('delete_account_confirm_desc') }}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div class="da-confirm">
            <label for="da-confirm-input" class="da-confirm-label">
              {{ $t('delete_account_type_to_confirm', { email: user.email || '' }) }}
            </label>
            <input
              id="da-confirm-input"
              v-model="deleteConfirmText"
              type="text"
              dir="ltr"
              autocomplete="off"
              spellcheck="false"
              :placeholder="user.email"
              class="da-confirm-input"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel class="da-cancel" @click="onDeleteCancel">{{ $t('cancel') }}</AlertDialogCancel>
            <button
              type="button"
              class="da-confirm-btn"
              :disabled="!canConfirmDelete || deleteLoading"
              @click="confirmDelete"
            >
              <LoadingCircle :loading="deleteLoading">{{ $t('delete_account_button') }}</LoadingCircle>
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</template>

<script>
import { Button } from '~/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '~/components/ui/alert-dialog'
import { AlertTriangle, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

export default {
  name: 'ProfileIndex',
  components: {
    Button,
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertTriangle,
    Trash2,
  },
  data() {
    return {
      user: { name: '', email: '', phone: '' },
      originalPhone: '',
      form: { old_password: '', new_password: '', new_password_confirmation: '' },
      updateLoading: false,
      passwordLoading: false,
      deleteOpen: false,
      deleteLoading: false,
      deleteConfirmText: '',
    };
  },
  computed: {
    canConfirmDelete() {
      const target = (this.user.email || '').trim().toLowerCase()
      const typed = (this.deleteConfirmText || '').trim().toLowerCase()
      return target.length > 0 && typed === target
    },
  },
  watch: {
    deleteOpen(open) {
      if (!open) this.deleteConfirmText = ''
    },
  },
  mounted() {
    const { data } = useAuth();
    // Strip +965 prefix for display in Phone input
    const rawPhone = (data.value?.phone || '').replace(/\D/g, '').replace(/^965/, '')
    // Local numbers are 8 digits — if invalid length, clear so user can re-enter
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
    },
    onDeleteCancel() {
      this.deleteConfirmText = ''
    },
    async confirmDelete() {
      if (!this.canConfirmDelete || this.deleteLoading) return
      this.deleteLoading = true
      try {
        const api = useApi()
        await api.delete('user')
        toast.success(this.$t('delete_account_success'))
        this.deleteOpen = false
        const { signOut } = useAuth()
        await signOut({ redirect: false })
        const localePath = useLocalePath()
        await navigateTo(localePath({ name: 'login' }), { external: true })
      } catch (e) {
        const response = e?.response?._data || e?.data
        toast.error(response?.message || this.$t('operation_failed'))
      } finally {
        this.deleteLoading = false
      }
    },
  }
};
</script>

<style>
/* ── Danger Zone card ── */
.da-zone {
  background: #fff;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: var(--shadow-soft, 0 1px 3px rgba(17, 24, 39, 0.04));
  position: relative;
}
@media (min-width: 640px) {
  .da-zone {
    padding: 1.5rem;
  }
}

.da-zone-head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.da-zone-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.da-zone-title {
  font-size: 1rem;
  font-weight: 700;
  color: #ef4444;
  line-height: 1.2;
  letter-spacing: -0.005em;
  margin-bottom: 0.2rem;
}
@media (min-width: 640px) {
  .da-zone-title {
    font-size: 1.05rem;
  }
}
.da-zone-sub {
  font-size: 0.78rem;
  color: var(--color-muted-foreground);
  line-height: 1.55;
}
@media (min-width: 640px) {
  .da-zone-sub {
    font-size: 0.82rem;
  }
}

.da-zone-list {
  list-style: disc;
  padding-inline-start: 1.5rem;
  margin: 0 0 1.25rem;
  font-size: 0.78rem;
  color: var(--color-muted-foreground);
  line-height: 1.7;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.da-zone-list li::marker {
  color: rgba(239, 68, 68, 0.6);
}
@media (min-width: 640px) {
  .da-zone-list {
    font-size: 0.82rem;
  }
}

.da-zone-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  border-radius: 0.7rem;
  background: #fff;
  border: 1px solid #ef4444;
  color: #ef4444;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.da-zone-btn:hover {
  background: #ef4444;
  color: #fff;
}
.da-zone-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}

/* ── Confirmation dialog ── */
.da-dialog {
  background: #fff !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 1rem;
  max-width: 480px;
  box-shadow: 0 24px 60px -12px rgba(17, 24, 39, 0.25);
}

.da-dialog-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.da-dialog-title {
  font-family: 'Poppins', 'Alexandria', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-foreground);
  letter-spacing: -0.005em;
}

.da-dialog-desc {
  font-size: 0.85rem;
  color: var(--color-muted-foreground);
  line-height: 1.6;
  margin-top: 0.25rem;
}

.da-confirm {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.85rem;
  border-radius: 0.65rem;
  background: rgba(239, 68, 68, 0.04);
  border: 1px dashed rgba(239, 68, 68, 0.3);
}

.da-confirm-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-foreground);
  line-height: 1.4;
}

.da-confirm-input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: #fff;
  font-size: 0.85rem;
  color: var(--color-foreground);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}
.da-confirm-input:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
}
.da-confirm-input::placeholder {
  color: var(--color-muted-foreground);
  opacity: 0.6;
}

/* Footer button styling */
.da-cancel {
  padding: 0.55rem 1.1rem;
  border-radius: 0.7rem;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-foreground);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}
.da-cancel:hover {
  background: var(--color-surface);
}

.da-confirm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.1rem;
  border-radius: 0.7rem;
  background: #ef4444;
  color: #fff;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
  min-width: 9rem;
}
.da-confirm-btn:hover:not(:disabled) {
  background: #dc2626;
}
.da-confirm-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.da-confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
