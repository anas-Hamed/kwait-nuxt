<script setup>
import { Button } from '~/components/ui/button'
import { Shield, ShieldCheck, Send } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const api = useApi()
const { t } = useI18n()

const companies = ref([])
const company_id = ref(null)
const loading = ref(false)

const { data: fetchedCompanies } = await useAsyncData('trust-companies', async () => {
  const res = await api.get('company/mine', { not_trusted: true })
  return res.data || []
})

onMounted(() => {
  companies.value = fetchedCompanies.value || []
  if (companies.value.length > 0) company_id.value = companies.value[0].id
})

watch(fetchedCompanies, (val) => {
  companies.value = val || []
  if (companies.value.length > 0) company_id.value = companies.value[0].id
})

const companyOptions = computed(() =>
  companies.value.map(c => ({
    label: locale.value === 'ar' ? c.ar_name : c.en_name,
    value: c.id,
  }))
)

const selectedCompany = computed(() =>
  companies.value.find(c => c.id === company_id.value)
)

const { locale } = useI18n()

async function sendRequest() {
  loading.value = true
  try {
    await api.post('trust-company/' + company_id.value)
    companies.value.splice(companies.value.findIndex(el => el.id == company_id.value), 1)
    if (companies.value.length > 0) company_id.value = companies.value[0].id
    toast.success(t('request_send'))
  } catch (e) {
    toast.error(t('request_fail'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="tc">
    <!-- Header -->
    <div class="tc-header">
      <div class="tc-header-icon" aria-hidden="true">
        <ShieldCheck :size="22" />
      </div>
      <div>
        <h2 class="tc-title">{{ $t('trust_company') }}</h2>
        <p class="tc-desc">{{ $t('trust_company_desc') || 'Request trust verification for your company' }}</p>
      </div>
    </div>

    <!-- Has companies -->
    <template v-if="companies.length > 0">
      <!-- Company selector -->
      <div class="tc-select-wrap">
        <label class="tc-label">{{ $t('company') }}</label>
        <div class="max-w-[400px]">
          <CategorySelect
            :options="companyOptions"
            :placeholder="$t('choose_category')"
            :model-value="company_id"
            @update:model-value="company_id = $event"
          />
        </div>
      </div>

      <!-- Selected company preview -->
      <div v-if="selectedCompany" class="tc-preview">
        <div class="tc-preview-avatar">
          <img
            v-if="selectedCompany.image"
            :src="selectedCompany.image"
            :alt="selectedCompany.ar_name"
            class="tc-preview-img"
            width="48"
            height="48"
          />
          <div v-else class="tc-preview-placeholder">
            <Shield :size="20" aria-hidden="true" />
          </div>
        </div>
        <div class="tc-preview-info">
          <span class="tc-preview-name">
            {{ $i18n.locale === 'ar' ? selectedCompany.ar_name : selectedCompany.en_name }}
          </span>
          <span v-if="selectedCompany.category" class="tc-preview-cat">
            {{ selectedCompany.category.name }}
          </span>
        </div>
      </div>

      <!-- Submit -->
      <Button class="tc-submit" @click="sendRequest" :disabled="loading">
        <LoadingCircle :loading="loading">
          <span class="flex items-center gap-2">
            <Send :size="15" aria-hidden="true" />
            {{ $t('send') }} {{ $t('trust') }}
          </span>
        </LoadingCircle>
      </Button>
    </template>

    <!-- Empty state -->
    <div v-else class="tc-empty">
      <div class="tc-empty-icon" aria-hidden="true">
        <Shield :size="32" />
      </div>
      <p class="tc-empty-text">{{ $t('no_companies_to_trust') }}</p>
      <LLink to="/profile/add-company">
        <Button size="sm" class="rounded-xl gap-2 mt-3">
          {{ $t('create_company') }}
        </Button>
      </LLink>
    </div>
  </div>
</template>

<style>
.tc {
  background: white;
  border-radius: 1.25rem;
  box-shadow: var(--shadow-soft);
  padding: 1.75rem;
  animation: db-in 0.45s ease both;
}

/* ── Header ── */
.tc-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}
.tc-header-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tc-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-primary);
}
.tc-desc {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  margin-top: 0.15rem;
}

/* ── Select ── */
.tc-select-wrap {
  margin-bottom: 1rem;
}
.tc-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.4rem;
}

/* ── Preview Card ── */
.tc-preview {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 0.85rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  margin-bottom: 1.5rem;
  max-width: 400px;
  animation: db-in 0.3s ease both;
}
.tc-preview-img {
  width: 48px;
  height: 48px;
  border-radius: 0.6rem;
  object-fit: cover;
}
.tc-preview-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 0.6rem;
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
}
.tc-preview-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.tc-preview-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tc-preview-cat {
  font-size: 0.72rem;
  color: var(--color-muted-foreground);
  margin-top: 0.1rem;
}

/* ── Submit ── */
.tc-submit {
  border-radius: 0.75rem;
  padding: 0 1.5rem;
  height: 2.75rem;
}

/* ── Empty ── */
.tc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
}
.tc-empty-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
  opacity: 0.4;
  margin-bottom: 0.75rem;
}
.tc-empty-text {
  font-size: 0.85rem;
  color: var(--color-muted-foreground);
  max-width: 280px;
  line-height: 1.5;
}
</style>
