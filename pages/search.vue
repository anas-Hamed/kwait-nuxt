<template>
  <div>
    <div class=" ">
      <div class="bg-white rounded shadow-md p-8 w-full ">
        <div v-if=" searchResult.length > 0">
          <div v-for="item in searchResult" class=" hover:bg-secondary bg-opacity-50 p-2 border-b" :key="item.type + '---' + item.id">
            <LLink
              :to="item.type === 'company'?{name: 'company-id',params:{id: item.slug}}:(item.parent_id != null ? {name: 'company',query:{category_id:item.id} } : {name: 'category-id',params:{id:item.id}})"
              >
              <div class="flex items-center">
                <div class="w-24 h-24 rounded-full p-2 border-secondary">
                  <img :src="item.image" class="w-full rounded-full ">
                </div>
                <div>
                  <div class="font-bold text-xl">{{item.name || item.ar_name}}</div>
                  <div class="text-sm">{{$t(item.type)}}</div>
                </div>
              </div>
            </LLink>
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

  </div>
</template>

<script>
  export default {
    name: 'Search',
    data() {
      return {
        offset:0,
        limit: 10,
        searchResult:[],
        infiniteId: +new Date()
      };
    },
    head() {
      return this.metaBuilder(this.$t('search'));
    },
    mounted() {

    },
    methods: {
      async getMore($state) {
        const data = await this.$axios.get('search', {
          params: {
            offset: this.offset,
            limit: this.limit,
            search_term:this.$route.query.keyword
          }
        });
        if (data.data.data.length > 0) {
          this.searchResult = [...this.searchResult, ...data.data.data];
          this.offset += this.limit;
          $state.loaded();
        } else {
          $state.complete();
        }
      },
    }
  };
</script>

<style scoped>

</style>
