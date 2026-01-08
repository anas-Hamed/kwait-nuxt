<template>
  <LLink :to="{name:'blog-slug',params:{slug:blog.slug}}" class="p-2">
    <div  class="bg-white  rounded-md shadow border">
      <img class="w-full" :src="blog.image" alt="" style="aspect-ratio:16/9">
      <p class="p-2 font-bold">{{blog.title}}</p>

      <div class="flex justify-end w-full text-gray-500 p-2">
        <client-only>
          <small>{{$moment(blog.created_at).format('yyyy-MM-DD H:m')}}</small>
        </client-only>
      </div>
    </div>
  </LLink>
</template>

<script>
  import LLink from './l-link';
  export default {
    name: 'BlogCard',
    components: { LLink },
    props: {
      blog: {
        type: Object,
        required:  true
      }
    },
    data() {
      return {};
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
