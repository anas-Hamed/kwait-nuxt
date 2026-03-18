<template>
  <div class="relative bg-gray-200 p-1 rounded-full w-full text-center max-w-screen-sm shadow-xs  ">
    <div class="w-8 flex justify-center items-center  h-8 bg-white rounded-full shadow-xs p-1 absolute right-1 ">
      <Icon name="search" />
    </div>
    <input :value="modelValue" type="text" :placeholder="placeholder" class="border-0 bg-transparent focus:outline-hidden w-full text-center h-8" @input="sendEmit" @focus="$emit('focus')" @blur="$emit('blur')">
    <div v-if="false" class="w-8 flex justify-center items-center  h-8 text-gray-600 rounded-full shadow-xs p-1 absolute left-1 bottom-1 ">
      <Icon name="filter" />
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
      modelValue:{
        type: String,
        require: false,
        default: ''
      }
    },
    emits: ['update:modelValue', 'focus', 'blur'],
    methods: {
      sendEmit(v) {
        this.$emit('update:modelValue',v.target.value);
      }
    }
  }
</script>

<style scoped>

</style>
