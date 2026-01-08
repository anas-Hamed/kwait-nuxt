<template>
  <div class="card min-h-screen">
    <div class="flex justify-between items-center">
      <h4 class="text-xl">{{$t('favorite')}}</h4>

    </div>
    <div class="px-8 mx-auto py-8">
      <div class="flex">
        <div class="w-4"></div>
        <div class="py-4 flex flex-wrap  flex-auto">
          <div v-for="company in companies" :key="`company-${company.id}`" class="w-full md:w-2/4 p-1">
            <CompanyCard :company="company" class="" />
          </div>
        </div>
      </div>

      <div class="my-5">
        <client-only>
          <infinite-loading
            :identifier="infiniteId"
            spinner="spiral"
            @infinite="getMore"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    'name': 'Favorite',
    middleware: 'auth',
    data() {
      return {
        companies: [],
        offset: 0,
        limit: 9,
        infiniteId: +new Date()
      };
    },
    mounted() {
      this.$nuxt.$on('company-un-favorite', id => {
        this.companies.splice(this.companies.findIndex(el => el.id === id), 1);
        if (this.companies.length === 0) {
          this.infiniteId = +new Date();
        }
      });
    },
    methods: {
      async getMore($state) {
        const data = await this.$axios.get('favorite', {
          params: {
            offset: this.offset,
            limit: this.limit
          }
        });
        if (data.data.data.length > 0) {
          this.companies = [...this.companies, ...data.data.data];
          this.offset += this.limit;
          $state.loaded();
        } else {
          $state.complete();
        }
      }
    }
  };
</script>

<style scoped>

</style>
