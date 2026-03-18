<script setup>
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

const api = useApi()

const companies = ref([])
const company_id = ref(null)
const loading = ref(false)

const { data: fetchedCompanies } = await useAsyncData('trust-companies', async () => {
  const res = await api.get('company/mine', { not_trusted: true })
  return res.data || []
})

onMounted(() => {
  companies.value = fetchedCompanies.value || []
  if (companies.value.length > 0) {
    company_id.value = companies.value[0].id
  }
})

watch(fetchedCompanies, (val) => {
  companies.value = val || []
  if (companies.value.length > 0) {
    company_id.value = companies.value[0].id
  }
})
</script>

<template>
  <Card>
    <CardContent class="p-6">
      <template v-if="companies.length > 0">
        <div class="pb-2">
          <label for="company">{{$t('company')}}</label>
          <div>
            <select class="w-full max-w-[350px] bg-accent p-2 rounded-md border" id="company" v-model="company_id">
              <option :value="company.id" :key="company.id" class="p-2" v-for="company in companies">{{$i18n.locale === 'ar' ?
                company.ar_name : company.en_name}}
              </option>
            </select>
          </div>
        </div>
        <Button @click="sendRequest">
          <LoadingCircle :loading="loading">{{$t('trust')}}</LoadingCircle>
        </Button>
      </template>
      <template v-else>
        <div class="mb-4">{{$t('no_companies_to_trust')}}</div>
        <Button as-child>
          <NuxtLink to="/company/create">
            {{$t('create_company')}}
          </NuxtLink>
        </Button>
      </template>
    </CardContent>
  </Card>
</template>

<script>
export default {
  name: 'TrustCompany',
  methods: {
    async sendRequest() {
      const api = useApi();
      const { $toast } = useNuxtApp();
      this.loading = true;
      try {
        await api.post('trust-company/' + this.company_id);
        this.companies.splice(this.companies.findIndex(el => el.id == this.company_id), 1);
        this.loading = false;
        $toast.success(this.$t('request_send'));
      } catch (e) {
        $toast.error(this.$t('request_fail'));
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
</style>
