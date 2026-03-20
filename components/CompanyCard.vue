<template>
  <LLink :to="!company.has_paid || !company.is_active ? {} : { name: 'company-id', params: { id: company.slug } }">
    <div class="kc" :class="{ 'opacity-50 pointer-events-none': !company.has_paid || !company.is_active }">
      <div class="kc-img">
        <ImagePlaceholder :image="company.image" class="kc-img-inner" />
        <div class="kc-badge">{{ company.category.name }}</div>
      </div>
      <div class="kc-info">
        <div class="kc-top">
          <h3 class="kc-title">{{ $i18n.locale === 'ar' ? company.ar_name : company.en_name }}</h3>
          <img v-if="company.is_trusted" class="kc-verified" src="~assets/images/trust.svg" alt="">
        </div>
        <div class="kc-bottom">
          <div class="kc-stars">
            <Star v-for="n in 5" :key="n" :size="10"
                  :class="n <= Math.round(company.average_rate || 0) ? 'kc-star-on' : 'kc-star-off'" />
            <span class="kc-rate-val">{{ company.average_rate }}</span>
          </div>
          <client-only>
            <div v-if="showControl" class="kc-ctrls">
              <button class="kc-ctrl kc-ctrl--del" :disabled="!company.has_paid || !company.is_active" @click.prevent="deleteCompany">
                <Trash2 :size="13" />
              </button>
              <button class="kc-ctrl" :disabled="!company.has_paid || !company.is_active" @click.prevent="updateCompany">
                <Pencil :size="13" />
              </button>
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </LLink>
</template>

<script>
import { Star, Trash2, Pencil } from 'lucide-vue-next'

export default {
  name: 'CompanyCard',
  components: { Star, Trash2, Pencil },
  props: {
    company: { type: Object, required: true },
    showControl: { type: Boolean, required: false },
  },
  methods: {
    deleteCompany() {
      const self = this
      this.$swal({
        title: self.$t('delete_confirm'),
        text: self.$t('delete_confirm_text'),
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: self.$t('yes'),
        cancelButtonText: self.$t('no'),
      }).then((result) => {
        if (result.value) {
          useApi().delete(`company/${self.company.id}`).then(() => {
            this.$swal({ icon: 'success', text: self.$t('operation_success'), toast: true, position: 'center', showConfirmButton: false, timer: 3000, timerProgressBar: true })
            useEventBus().emit('company-deleted', self.company.id)
          }).catch(() => {
            this.$swal({ icon: 'error', text: self.$t('operation_failed'), toast: true, position: 'center', showConfirmButton: false, timer: 3000, timerProgressBar: true })
          })
        }
      })
    },
    updateCompany() {
      this.$router.push(this.localePath({ name: 'company-update-id', params: { id: this.company.id } }))
    },
  },
}
</script>

<style>
/* Shared .kc styles in CompanyListCard */
.kc-ctrls {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-inline-start: auto;
}
.kc-ctrl {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  padding: 0;
  background: transparent;
  color: var(--color-muted-foreground);
  transition: all 0.15s ease;
}
.kc-ctrl:hover {
  background: var(--color-surface);
  color: var(--color-primary);
}
.kc-ctrl--del { color: #ef4444; }
.kc-ctrl--del:hover { background: #fef2f2; }
</style>
