<template>
  <div class="card">
    <div class="flex flex-wrap">
      <BlogCard  v-for="blog in blogs" :key="`blog-${blog.id}`" :blog="blog"  class="w-full md:w-1/3"/>
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
</template>

<script>
  import BlogCard from '../../components/BlogCard';
  export default {
    name: 'BlogIndex',
    components: { BlogCard },
    data() {
      return {
        offset: 0,
        limit: 9,
        blogs:[],
        infiniteId: + new Date()
      };
    },
    mounted() {

    },
    methods: {
      async getMore($state) {
        const data = await this.$axios.get('blog', {
          params: {
            offset: this.offset,
            limit: this.limit
          }
        });
        if (data.data.data.length > 0) {
          this.blogs = [...this.blogs, ...data.data.data];
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
