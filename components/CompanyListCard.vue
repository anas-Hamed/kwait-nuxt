<template>
  <LLink :to="company.has_paid === false || company.is_active === false ? {} : { name: 'company-id', params: { id: company.slug } }"
         class="block">
    <div class="kc" :class="{ 'opacity-50 pointer-events-none': company.has_paid === false || company.is_active === false }">
      <div class="kc-img">
        <img
          v-if="company.image"
          :src="company.image"
          class="kc-img-inner"
          alt=""
          @error="$event.target.closest('.kc-img').classList.add('kc-img--broken')"
        />
        <div class="kc-img-fallback">
          <span class="kc-img-initial">{{ ($i18n.locale === 'ar' ? company.ar_name : company.en_name)?.charAt(0)?.toUpperCase() || '?' }}</span>
        </div>
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
        </div>
      </div>
    </div>
  </LLink>
</template>

<script>
import { Star } from 'lucide-vue-next'

export default {
  name: 'CompanyListCard',
  components: { Star },
  props: {
    company: { type: Object, required: true },
    showControl: { type: Boolean, required: false },
  },
}
</script>

<!-- .kc* styles are shared with CompanyCard.vue and live in assets/app.css -->
