<template>
  <div v-if="url" class="p-1">
    <a target="_blank" :href="url" class="rounded-full bg-primary text-white w-[2.5rem] h-[2.5rem] flex-centred">
      <icon :name="icon"  size-class="w-8"/>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'SocialIcon',
    props: {
      url: {
        type: String,
        default: ''
      },
      icon:{
        type: String,
        required: true
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
