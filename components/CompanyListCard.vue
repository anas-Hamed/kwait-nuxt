<template>
  <LLink :to="!company.has_paid || !company.is_active ? {} : { name: 'company-id', params: { id: company.slug } }"
         class="block">
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

<style>
.kc {
  border-radius: 1rem;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.kc:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(27, 44, 59, 0.1);
}

/* Image */
.kc-img {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-surface);
  border-radius: 0.75rem;
}
.kc-img :deep(div) {
  padding: 0 !important;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.kc-img-inner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}
.kc:hover .kc-img-inner {
  transform: scale(1.03);
}

/* Category badge */
.kc-badge {
  position: absolute;
  bottom: 0.5rem;
  inset-inline-start: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.55rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  max-width: 75%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Info */
.kc-info {
  padding: 0.55rem 0.25rem 0.35rem;
}

.kc-top {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.kc-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.kc-verified {
  width: 0.8rem;
  height: 0.8rem;
  flex-shrink: 0;
}

.kc-bottom {
  margin-top: 0.2rem;
}

/* Stars */
.kc-stars {
  display: flex;
  align-items: center;
  gap: 1px;
}
.kc-star-on {
  color: var(--color-secondary);
  fill: var(--color-secondary);
}
.kc-star-off {
  color: var(--color-border);
  fill: var(--color-border);
}
.kc-rate-val {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  margin-inline-start: 0.25rem;
}
</style>
