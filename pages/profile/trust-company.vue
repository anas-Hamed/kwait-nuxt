<template>
  <div class="card">
    <div class="p-2">
      <template v-if="companies.length > 0">
        <div class="pb-2">
          <label for="company">{{$t('company')}}</label>
          <div>
            <select class="w-full max-w-[350px] bg-accent p-2 " id="company" v-model="company_id">
              <option :value="company.id" :key="company.id" class="p-2" v-for="company in companies">{{$i18n.locale === 'ar' ?
                company.ar_name : company.en_name}}
              </option>
            </select>
          </div>
        </div>
        <button @click="sendRequest" class="primary-btn">
          <LoadingCircle :loading="loading">{{$t('trust')}}</LoadingCircle>
        </button>
      </template>
      <template v-else>
        <div class="mb-4">{{$t('no_companies_to_trust')}}</div>
        <NuxtLink class="primary-btn" to="/company/create">
          {{$t('create_company')}}
        </NuxtLink>
      </template>
    </div>

  </div>
</template>

<script>
  import LoadingCircle from '../../components/loading-circle';

  export default {
    name: 'TrustCompany',
    components: { LoadingCircle },
     async fetch(){
      const {data} = await this.$axios.get('company/mine?not_trusted=true');
      this.companies = data.data;
      if (this.companies.length > 0){
        console.log(this.companies[0].id)
        this.company_id = this.companies[0].id;
      }
    },
    data() {
      return {
        loading: false,
        companies: [],
        company_id: null
      };
    },

    methods: {
      async sendRequest() {
        this.loading = true;
        try {
          await this.$axios.post('trust-company/' + this.company_id);
          this.companies.splice(this.companies.findIndex(el => el.id == this.company_id), 1);
          this.loading = false;
          this.$toast.success(this.$t('request_send')).goAway(2000);
        } catch (e) {
          this.$toast.error(this.$t('request_fail')).goAway(2000);
        }
      }
    },
  };
</script>

<style scoped>

</style>
