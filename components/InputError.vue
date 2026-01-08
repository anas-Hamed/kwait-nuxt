<template>
  <div>
    <ul class="text-red-600 my-1 text-sm">
      <li v-for="(error,key) in _errors" :key="key">{{error}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    'name': 'InputError',
    props:{
      name:{
        type: String,
        required: true
      }
    },
    computed:{
      _errors(){
        return this.errors && this.errors[this.name] ? this.errors[this.name] : [];
      }
    }
  };
</script>

<style scoped>

</style>
