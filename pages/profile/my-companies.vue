<template>
  <div class="bg-white rounded-2xl shadow-soft p-6">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-lg font-bold text-primary">{{ $t('my_companies') }}</h3>
        <p class="text-sm text-muted-foreground mt-0.5">{{ $t('hidden_companies') }}</p>
      </div>
    </div>

    <div v-if="companies && companies.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <CompanyCard v-for="company in companies" :key="company.id" :show-control="true" :company="company" />
    </div>

    <div v-else class="text-center py-12">
      <Building2 :size="48" class="mx-auto text-muted-foreground/30 mb-3" />
      <p class="text-muted-foreground text-sm">{{ $t('no_companies_added') }}</p>
    </div>
  </div>
</template>

<script>
import { Building2 } from 'lucide-vue-next'

export default {
  name: 'MyCompanies',
  components: { Button, Plus, Building2 },
  props: {
    companies: { type: Array, default: () => [] }
  },
};
</script>
