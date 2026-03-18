<template>
  <Card>
    <CardContent class="p-6">
      <h3 class="text-2xl mb-1">{{$t('my_companies')}}</h3>
      <p class="text-sm text-muted-foreground">
        {{$t('hidden_companies')}}
      </p>
      <Separator class="my-4" />
      <div class="flex flex-wrap">
        <div v-for="company in companies" :key="`company-${company.id}`" class="w-full md:w-2/4 p-1">
          <CompanyCard :show-control="true" :company="company" class=""  />
        </div>
      </div>
      <span v-if="companies && companies.length === 0">{{$t('no_companies_added')}}</span>
      <LLink :to="{name: 'company-create'}" class="mt-8 flex items-center">
        <Button variant="secondary" size="icon" class="rounded-full h-8 w-8">
          <Plus :size="16" />
        </Button>
        <div class="w-1"></div>
        <b>{{$t('add_company')}}</b>
      </LLink>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Plus } from 'lucide-vue-next'

export default {
  name: 'MyCompanies',
  components: { Card, CardContent, Button, Separator, Plus },
  props: {
    companies: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      modal: true
    };
  },
};
</script>

<style scoped>
</style>
