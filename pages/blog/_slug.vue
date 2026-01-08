<template>
  <div class="max-w-screen-lg mx-auto">
    <div class="">
      <img alt="" :src="blog.image" class=" mx-auto rounded shadow" style="aspect-ratio:16/9">
    </div>
    <div class="card mt-8">
      <p class="px-2 mt-3 font-bold text-4xl">{{blog.title}}</p>
      <div class="flex px-2   text-gray-500">
        <client-only>
          <small>{{$moment(blog.created_at).format('yyyy-MM-DD H:m')}}</small>
        </client-only>
      </div>
      <div class="mt-6 prose " v-html="blog.text">

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BlogShow',
    async asyncData(ctx) {
      let blog = {};
      try {
        const { data } = await ctx.$axios.get(`blog/${ctx.params.slug}`);
        blog = data.data;
      } catch (e) {
        ctx.error({
          status: e.response.status
        });
      }
      return {
        blog
      };
    },
    data() {
      return {};
    },
    head() {
      return this.metaBuilder(this.blog.title, '', this.blog.image);
    },
    mounted() {

    }
  };
</script>

<style >

</style>
