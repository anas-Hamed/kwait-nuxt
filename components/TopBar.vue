<template>
  <div class=" w-full justify-between px-2 py-1 items-center flex flex-wrap  text-white bg-primary ">
    <div class="flex w-full md:w-1/2  items-center justify-between md:justify-start ">
      <div class="flex">
        <template v-if="setting.facebook">
          <a :href="setting.facebook" >
            <icon class="mx-1 mt-0" name="facebook" size-class="w-4" />
          </a>
          <div class="w-2"></div>
        </template>
        <template v-if="setting.twitter">
          <a :href="setting.twitter" >
            <icon class="mx-1 mt-0" name="twitter" size-class="w-4" />
          </a>
          <div class="w-2"></div>
        </template>
        <template v-if="setting.youtube">
          <a :href="setting.youtube" >
            <icon class="mx-1 mt-0" name="youtube" size-class="w-4" />
          </a>
          <div class="w-2"></div>
        </template>
        <template v-if="setting.linkedin">
          <a :href="setting.linkedin" >
            <icon class="mx-1 mt-0" name="linkedin" size-class="w-4" />
          </a>
          <div class="w-2"></div>
        </template>
        <template v-if="setting.snapchat">
          <a :href="setting.snapchat" >
            <icon class="mx-1 mt-0" name="snapchat" size-class="w-4" />
          </a>
          <div class="w-2"></div>
        </template>
        <template v-if="setting.instagram">
          <a :href="setting.instagram" >
            <icon class="mx-1 mt-0" name="instagram" size-class="w-4" />
          </a>
          <div class="w-2"></div>
        </template>

      </div>
      <div class="mx-1 h-4 w-0 border bg-white hidden md:block"></div>
      <LangSwitch />

    </div>
    <div class="hidden md:flex flex-wrap  w-full md:w-1/2  justify-center items-center md:justify-end">
      <div class="flex" dir="ltr" v-if="setting.phone">
        <icon name="phone" />
        <a :href="`tel:${setting.phone}`" class="text-sm mx-1 font-norma" dir="ltr">{{setting.phone}}</a>
      </div>
      <div class="mx-2 h-4 w-0 border bg-white hidden md:block"></div>
      <div class="flex" dir="ltr" v-if="setting.email">
        <icon name="email" />
        <a :href="`mailto:${setting.email}`" class="text-sm mx-1 font-norma" dir="ltr">{{setting.email}}</a>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: 'TopBar',
    data() {
      return {};
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
