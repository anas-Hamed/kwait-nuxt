<template>
  <div class="mb-3">
    <label :for="id">{{label}} <span v-if="required" class="required"></span></label>
    <div  :dir="inputDir" class="flex  w-full items-center p-0">
      <div v-if="prefix" class="h-full px-2 flex-centred font-bold">
        {{prefix}}
      </div>
      <input v-bind="$attrs" :value="value" :type="type" :placeholder="placeholder"
             class="focus:outline-own flex-auto p-2   bg-accent mt-1 w-full rounded border-gray-300"
              :class="[(errors && errors[error]) ?'border-error' : '']"
             @input="$emit('input', $event.target.value)">
    </div>
    <InputError v-if="error" :name="error" />
  </div>
</template>

<script>
  import InputError from '~/components/InputError';
  export default {
    'name': 'MyInput',
    components: { InputError },
    props:{
      id:{
        required: true,
        type:String,
        default: 'input'
      },
      placeholder:{
        type:String,
        default: ''
      },
      label:{
        type:String,
        default: ''
      },
      error:{
        type:String,
        default: ''
      },
      type:{
        type:String,
        default: 'text'
      },
      prefix:{
        type:String,
        default: ''
      },
      inputDir:{
        type:String,
        required: false
      },
      required:{
        type:Boolean,
        required: false
      },
      value:{
        required: false,
        default: null,
        // eslint-disable-next-line vue/require-prop-type-constructor
        type: String|Number|Object
      },
    },
    mounted() {

    }
  };
</script>

<style scoped>
input::placeholder{
  font-size: 13px;
}

</style>
