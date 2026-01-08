<template>
  <div class="">
    <template v-if="readOnly">
      <div  v-for="day in days" :key="`day-${day.day}`" class="flex mb-1 shadow-md">
        <div class="w-24  text-center   py-1" :class="[$i18n.locale === 'ar' ? 'rounded-tr rounded-br' : 'rounded-tl rounded-bl',day.active ? 'bg-secondary' : 'bg-gray-300']">
          {{$t(`day_${day.day}`)}}
        </div>
        <div class="flex-auto bg-white flex justify-evenly py-1">
          <template v-if="day.active">
            <span>{{$t('from')}}</span>
            <span>{{day.start_time}}</span>
          </template>
          <template v-else>
            <span>----</span>
          </template>

          <div class="w-1 border-l"></div>
          <template v-if="day.active">
            <span>{{$t('to')}}</span>
            <span>{{day.end_time}}</span>
          </template>
          <template v-else>
            <span>----</span>
          </template>

        </div>
        <div class="w-24 bg-white text-center   py-1 flex " :class="[$i18n.locale === 'ar' ? 'rounded-tl rounded-bl' : 'rounded-tr rounded-br']">
        </div>
      </div>
    </template>
    <div v-else v-for="day in days" :key="`day-${day.day}`" class="flex flex-wrap mb-1 shadow-md rounded-md overflow-hidden" :class="{'opacity-50': !day.active}">
      <div class=" w-full md:w-24 bg-secondary text-center   py-1" >
        {{$t(`day_${day.day}`)}}
      </div>
      <div class="flex w-full md:w-auto">
        <div class="flex-auto bg-white flex justify-evenly py-1 ">
          <label :for="`day-start-${day.day}`" class="px-2">
            <span>{{$t('from')}}</span>
            <input :id="`day-start-${day.day}`" v-model="day.start_time" type="time" class="focus:outline-none">
          </label>
          <div class="w-1 border-l"></div>
          <label :for="`day-end-${day.day}`"  class="px-2">
            <span>{{$t('to')}}</span>
            <input :id="`day-end-${day.day}`" v-model="day.end_time" type="time" class="focus:outline-none">
          </label>
        </div>
        <div class="w-24 bg-white text-center   py-1 flex " :class="[$i18n.locale === 'ar' ? 'rounded-tl rounded-bl' : 'rounded-tr rounded-br']">
          <label :for="`day-active-${day.day}`" class="block px-2 w-full h-full"><input :id="`day-active-${day.day}`" v-model="day.active" type="checkbox"></label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WorkTimes',
    props:{
      days:{
        type: Array,
        required: true
      },
      readOnly:{
        type: Boolean,
        default :false
      }
    },
  };
</script>

<style scoped>

</style>
