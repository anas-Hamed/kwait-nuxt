<script setup>
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Heart, Star, Phone, Mail, Clock, MapPin, Globe, MessageCircle } from 'lucide-vue-next'

const api = useApi()
const route = useRoute()
const { $toast } = useNuxtApp()
const { t } = useI18n()
const { status } = useAuth()

const { data: company } = await useAsyncData(`company-${route.params.id}`, async () => {
  const res = await api.get(`company/${route.params.id}/show`)
  const companyData = { ...res.data }
  if (res.data.location) {
    companyData.location = {
      lat: parseFloat(res.data.location.lat),
      lng: parseFloat(res.data.location.lng)
    }
  }
  return companyData
})

const hoverRating = ref(0)

function submitRating(star) {
  if (status.value !== 'authenticated') {
    $toast.error('يجب تسجيل الدخول')
    return
  }
  api.post('company/rate', {
    company_id: company.value.id,
    rate: star,
  }).then((res) => {
    company.value.average_rate = res?.data ?? star
    $toast.success(t('rate'))
  }).catch(() => {
    $toast.error(t('operation_failed'))
  })
}
</script>

<template>
  <div class="max-w-screen-md mx-auto px-4 pb-12">

    <!-- Gallery -->
    <div class="rounded-2xl overflow-hidden" v-if="company?.images?.length > 0">
      <Ads :ads="company.images" :loading="adsLoading" attribute="path" />
    </div>
    <div class="rounded-2xl overflow-hidden" v-else>
      <ImagePlaceholder :image="company?.image" :top="50" />
    </div>

    <!-- Company Info -->
    <div class="mt-6">
      <!-- Category -->
      <span v-if="company?.category?.name" class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {{ company.category.name }}
      </span>

      <!-- Name + Trust -->
      <div class="flex items-center gap-2 mt-1">
        <h1 class="text-2xl font-bold text-primary" style="font-family: 'Cairo', sans-serif;">
          {{ $i18n.locale === 'ar' ? company?.ar_name : company?.en_name }}
        </h1>
        <img v-if="company?.is_trusted" class="w-5 h-5 shrink-0" src="~/assets/images/trust.svg" alt="trusted" />
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-2 mt-2" @mouseleave="hoverRating = 0">
        <button v-for="n in 5" :key="n" type="button" class="cd-star" @mouseenter="hoverRating = n" @click="submitRating(n)">
          <Star :size="18" :class="n <= (hoverRating || Math.round(company?.average_rate || 0)) ? 'text-secondary fill-secondary' : 'text-gray-300'" />
        </button>
        <span v-if="company?.average_rate > 0" class="text-sm text-muted-foreground">({{ company.average_rate }})</span>
        <span v-else class="text-xs text-muted-foreground">{{ $t('be_first_rate') }}</span>
      </div>

      <!-- About -->
      <p v-if="company?.about" class="mt-4 text-sm text-muted-foreground leading-relaxed">
        {{ company.about }}
      </p>

      <!-- Tags -->
      <div v-if="company?.tags?.length" class="flex flex-wrap gap-1.5 mt-3">
        <Badge v-for="tag in company.tags" :key="tag" variant="secondary" class="text-xs font-normal px-2.5 py-0.5">
          {{ tag }}
        </Badge>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap items-center gap-2 mt-6">
      <a v-if="company?.phone" :href="`tel:${company.phone}`" class="cd-action">
        <Phone :size="15" />
        {{ $t('call') }}
      </a>
      <a v-if="company?.whatsapp" :href="`https://wa.me/${company.whatsapp}`" target="_blank" class="cd-action cd-action--green">
        <MessageCircle :size="15" />
        {{ $t('messaging') }}
      </a>
      <a v-if="company?.email" :href="`mailto:${company.email}`" target="_blank" class="cd-action">
        <Mail :size="15" />
        {{ $t('messaging') }}
      </a>
      <button class="cd-action" :class="{ 'cd-action--fav': company?.has_favorite }" @click="toggleFavorite">
        <Heart :size="15" :class="company?.has_favorite ? 'fill-current' : ''" />
        {{ company?.has_favorite ? $t('remove_from_favorite') : $t('add_to_favorite') }}
      </button>
    </div>

    <Separator class="my-8" />

    <!-- Contact Details -->
    <section>
      <h2 class="text-base font-semibold text-primary mb-4">{{ $t('contacts') }}</h2>
      <div class="space-y-3">
        <div v-if="company?.phone" class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
            <Phone :size="16" class="text-primary" />
          </div>
          <span class="text-sm text-primary flex-1" dir="ltr">{{ company.phone }}</span>
          <a :href="`tel:${company.phone}`" class="text-xs text-muted-foreground underline hover:text-primary">{{ $t('call') }}</a>
        </div>
        <div v-if="company?.whatsapp" class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <MessageCircle :size="16" class="text-green-600" />
          </div>
          <span class="text-sm text-primary flex-1" dir="ltr">{{ company.whatsapp }}</span>
          <a :href="`https://wa.me/${company.whatsapp}`" target="_blank" class="text-xs text-muted-foreground underline hover:text-primary">{{ $t('messaging') }}</a>
        </div>
        <div v-if="company?.email" class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Mail :size="16" class="text-blue-600" />
          </div>
          <span class="text-sm text-primary flex-1" dir="ltr">{{ company.email }}</span>
          <a :href="`mailto:${company.email}`" target="_blank" class="text-xs text-muted-foreground underline hover:text-primary">{{ $t('messaging') }}</a>
        </div>
      </div>
    </section>

    <!-- Social Media -->
    <div v-if="company?.website || company?.instagram || company?.twitter || company?.facebook || company?.snapchat || company?.linkedin" class="mt-6">
      <h3 class="text-sm font-medium text-muted-foreground mb-3">{{ $t('social_media') }}</h3>
      <div class="flex items-center gap-2">
        <a v-if="company?.website" :href="company.website" target="_blank" class="cd-social" title="Website">
          <Globe :size="16" />
        </a>
        <a v-if="company?.instagram" :href="company.instagram" target="_blank" class="cd-social" title="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <a v-if="company?.twitter" :href="company.twitter" target="_blank" class="cd-social" title="X">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a v-if="company?.facebook" :href="company.facebook" target="_blank" class="cd-social" title="Facebook">
          <svg width="16" height="16" viewBox="0 0 30 30" fill="currentColor"><path d="M12,27V15H8v-4h4V8.852C12,4.785,13.981,3,17.361,3c1.619,0,2.475.12,2.88.175V7h-2.305C16.501,7,16,7.757,16,9.291V11h4.205l-.571,4H16v12H12z"/></svg>
        </a>
        <a v-if="company?.snapchat" :href="company.snapchat" target="_blank" class="cd-social" title="Snapchat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.93 16.56a1.2 1.2 0 0 0-.7-.38 7.3 7.3 0 0 1-1.88-.93 8.5 8.5 0 0 1-1.22-1.9l.44-.18c.64-.25 1.35-.53 1.58-1.16a1.15 1.15 0 0 0-.08-.96 1.64 1.64 0 0 0-2.2-.63c.14-2.44-.33-4.28-1.42-5.49A5.36 5.36 0 0 0 12.28 3a5.32 5.32 0 0 0-4.18 1.63c-1.09 1.21-1.57 3.05-1.43 5.48a1.66 1.66 0 0 0-2.2.63 1.15 1.15 0 0 0-.08.96c.23.63.94.91 1.58 1.16l.44.18a8.3 8.3 0 0 1-1.22 1.89 7.1 7.1 0 0 1-1.88.93 1.2 1.2 0 0 0-.7.38.97.97 0 0 0 0 1c.39.77 1.82 1.06 2.58 1.18a1.25 1.25 0 0 0 .48 1.06c.38.26.84.18 1.47.06a4.15 4.15 0 0 1 1.22-.11 5.37 5.37 0 0 1 .93.55A6.25 6.25 0 0 0 12.28 21a6.25 6.25 0 0 0 3.01-1.06 5.37 5.37 0 0 1 .93-.55 4.15 4.15 0 0 1 1.22.11c.63.12 1.09.2 1.47-.06a1.25 1.25 0 0 0 .48-1.06c.76-.12 2.19-.41 2.58-1.18a.97.97 0 0 0-.04-.84z"/></svg>
        </a>
        <a v-if="company?.linkedin" :href="company.linkedin" target="_blank" class="cd-social" title="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
      </div>
    </div>

    <Separator class="my-8" />

    <!-- Work Times -->
    <section>
      <div class="flex items-center gap-2 mb-4">
        <Clock :size="16" class="text-muted-foreground" />
        <h2 class="text-base font-semibold text-primary">{{ $t('work_times') }}</h2>
      </div>
      <WorkTimes :days="company?.work_times" :read-only="true" />
    </section>

    <!-- Location -->
    <template v-if="company?.location">
      <Separator class="my-8" />
      <section>
        <div class="flex items-center gap-2 mb-4">
          <MapPin :size="16" class="text-muted-foreground" />
          <h2 class="text-base font-semibold text-primary">{{ $t('location') }}</h2>
        </div>
        <div class="rounded-xl overflow-hidden border border-border">
          <client-only>
            <CreateMap :read-only="true" v-model="company.location" />
          </client-only>
        </div>
      </section>
    </template>

  </div>
</template>

<script>
export default {
  name: 'CompanyShow',
  data() {
    return {
      adsLoading: true
    };
  },
  head() {
    return this.metaBuilder(this.company?.ar_name, this.company?.about, this.company?.image);
  },
  mounted() {
    this.adsLoading = false;
  },
  methods: {
    toggleFavorite() {
      if (this.checkAuth()) {
        const api = useApi();
        api.post(`company/${this.company.id}/toggle-favorite`).then((data) => {
          this.company.has_favorite = data.data;
          if (data.data) {
            this.$toast.success(this.$t('favorite_added'));
          } else {
            this.$toast.success(this.$t('favorite_removed'));
          }
        });
      }
    }
  }
};
</script>

<style scoped>
/* Star rating buttons */
.cd-star {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.cd-star:hover {
  transform: scale(1.25);
}

/* Action pill buttons */
.cd-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--color-border);
  color: var(--color-primary);
  background: white;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cd-action:hover {
  border-color: var(--color-primary);
  background: var(--color-surface);
}
.cd-action--green {
  border-color: #25d366;
  color: #25d366;
}
.cd-action--green:hover {
  background: #f0fdf4;
}
.cd-action--fav {
  border-color: #ef4444;
  color: #ef4444;
}

/* Social media circles */
.cd-social {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
  background: var(--color-surface);
  transition: all 0.15s ease;
  text-decoration: none;
}
.cd-social:hover {
  color: var(--color-primary);
  background: var(--color-border);
}
</style>
