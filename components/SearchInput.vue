<template>
  <div class="relative bg-gray-200 p-1 rounded-full w-full text-center max-w-screen-sm shadow-sm  ">
    <div class="w-8 flex justify-center items-center  h-8 bg-white rounded-full shadow-sm p-1 absolute right-1 ">
      <icon name="search"></icon>
    </div>
    <input :value="value" type="text" :placeholder="placeholder" class="border-0 bg-transparent focus:outline-none w-full text-center h-8" @input="sendEmit" @focus="$emit('focus')" @blur="$emit('blur')">
    <div v-if="false" class="w-8 flex justify-center items-center  h-8 text-gray-600 rounded-full shadow-sm p-1 absolute left-1 bottom-1 ">
      <icon name="filter"></icon>
    </div>
    <div class="relative">
      <slot>

      </slot>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'SearchInput',
    props:{
      placeholder:{
       type: String,
       default: ''
      },
      value:{
        type: String,
        require: false,
        default: ''
      }
    },
    methods: {
      sendEmit(v) {
        this.$emit('input',v.target.value);
      }
    }
  }
</script>

<style scoped>

</style>
