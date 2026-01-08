<template>
  <div>
    <AppDownload />
    <div class="bg-primary px-3 pt-12 text-white">
      <div class="max-w-screen-xl mx-auto">
        <ContactIcons />
        <div class="flex flex-wrap gap-2  py-4 mb-8 justify-center">
          <div class="w-full sm:w-1/3 text-center  sm:text-start">
            <h3 class="text-2xl">{{$t('support')}}</h3>
            <ul class="text-sm font-light">
              <li class="mt-1">
                <LLink :to="{name: 'about-us'}">{{$t('about_us')}}</LLink>
              </li>
              <li class="mt-1">
                <LLink :to="{name: 'privacy'}">{{$t('privacy')}}</LLink>
              </li>
              <li class="mt-1">
                <LLink :to="{name: 'terms'}">{{$t('terms')}}</LLink>
              </li>
              <li class="mt-1">
                <LLink :to="{name: 'contact-us'}">{{$t('contact_us')}}</LLink>
              </li>
            </ul>
          </div>
          <div class="w-full sm:w-1/3 text-center  sm:text-start">
            <h3 class="text-2xl mb-1 ">{{$t('kuwait_explorer')}}</h3>
            <p class=" text-xs font-light leading-6">
              {{$t('kuwait_explorer_description')}}
            </p>
          </div>
        </div>
        <p class="text-sm text-center py-4" v-html="$t('copyrights') +  (new Date()).getFullYear()"></p>
      </div>

    </div>

  </div>
</template>

<script>
  import LLink from './l-link';
  import AppDownload from './AppDownload';
  import ContactIcons from './ContactsIcons';

  export default {
    name: 'BFooter',
    components: { ContactIcons, AppDownload, LLink }
  };
</script>

<style scoped>

</style>
