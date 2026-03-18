<template>
  <div class="bg-white rounded-2xl shadow-soft p-6">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-lg font-bold text-primary">{{ $t('my_companies') }}</h3>
        <p class="text-sm text-muted-foreground mt-0.5">{{ $t('hidden_companies') }}</p>
      </div>
      <LLink :to="{ name: 'company-create' }">
        <button class="btn-gold rounded-full px-4 py-2 text-sm flex items-center gap-1.5">
          <Plus :size="16" />
          {{ $t('add_company') }}
        </button>
      </LLink>
    </div>

    <div v-if="companies && companies.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <CompanyCard v-for="company in companies" :key="company.id" :show-control="true" :company="company" />
    </div>

    <div v-else class="text-center py-12">
      <Building2 :size="48" class="mx-auto text-muted-foreground/30 mb-3" />
      <p class="text-muted-foreground text-sm">{{ $t('no_companies_added') }}</p>
      <LLink :to="{ name: 'company-create' }">
        <Button class="mt-4 rounded-xl">{{ $t('add_company') }}</Button>
      </LLink>
    </div>
  </div>
</template>

<script>
import { Button } from '~/components/ui/button'
import { Plus, Building2 } from 'lucide-vue-next'

export default {
  name: 'MyCompanies',
  components: { Button, Plus, Building2 },
  props: {
    companies: { type: Array, default: () => [] }
  },
};
</script>
