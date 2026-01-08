<template>
  <div class="card ">
    <h3 class="text-2xl mb-1 ">{{$t('my_companies')}}</h3>
    <p class="text-sm text-accentSecondary">
      {{$t('hidden_companies')}}
    </p>
    <div class="w-full border-b my-4"></div>
    <div class="flex flex-wrap">
      <div v-for="company in companies" :key="`company-${company.id}`" class="w-full md:w-2/4 p-1">
        <CompanyCard :show-control="true" :company="company" class=""  />
      </div>
    </div>
    <span v-if="companies && companies.length === 0">{{$t('no_companies_added')}}</span>
    <LLink :to="{name: 'company-create'}" class="mt-8 flex items-center">
      <span class="rounded-full w-8 h-8 bg-secondary flex items-center justify-center text-white"><Icon name="plus" /></span>
      <div class="w-1"></div>
      <b>{{$t('add_company')}}</b>
    </LLink>
  </div>
</template>

<script>
  import Modal from '../../components/Modal';
  export default {
    name: 'MyCompanies',
    components: { Modal },
    props: {
      companies: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        modal:true
      };
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
