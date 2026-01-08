<template>
  <div>
    <div class="shadow py-4 px-6 bg-white lg:flex hidden justify-between items-center">

      <LLink :to="{name: 'index'}">
        <img alt="" class="w-40" src="~/assets/images/h_logo.png">
      </LLink>
      <div class=" flex ">
        <l-link :to="{name: 'index'}" class="mx-2 nav-item">{{$t('home')}}</l-link>
        <l-link :to="{name: 'category'}" class="mx-2 nav-item">{{$t('categories')}}</l-link>
        <l-link :to="{name: 'company'}" class="mx-2 nav-item">{{$t('companies')}}</l-link>
        <l-link :to="{name: 'blog'}" class="mx-2 nav-item">{{$t('blog')}}</l-link>
        <l-link :to="{name: 'about-us'}" class="mx-2 nav-item">{{$t('about_us')}}</l-link>
      </div>
      <div class="flex  space-x-1 ">
        <LLink :to="{name:'company-create'}"
               class="flex items-center space-x-1   py-2 px-4 rounded-full bg-secondary text-white mx-2">
          <span class="text-sm font-bold">{{$t('add_company')}}</span>
        </LLink>
        <LLink :to="{name:'favorite'}" class="flex items-center  nav-item  p-2 rounded mx-2">
          <icon name="filledHeart"></icon>
        </LLink>
        <LLink :to="{name:'notification'}" class="flex items-center  nav-item  p-2 rounded mx-2 relative">
          <icon name="notification"></icon>
          <span class="w-4 h-4 bg-red-700 absolute top-1 left-1 rounded-full flex-centred text-white text-xs"
                v-if="unread_notifications">{{unread_notifications}}</span>
        </LLink>
        <div>
          <LLink :to="{name:'login'}" class="flex items-center  nav-item  p-2 rounded mx-2" v-if="!$auth.loggedIn">
            <span class="text-sm font-bold">{{$t('login')}}</span>
            <div class="w-1"></div>
            <icon name="account"></icon>
          </LLink>
          <LLink :to="{name:'profile'}" class="flex items-center space-x-1 nav-item  p-2 rounded mx-2" v-else>
            <span class="text-sm font-bold">{{$auth.user.name}}</span>
            <div class="w-1"></div>
            <icon name="account"></icon>
          </LLink>
        </div>

      </div>



    </div>
    <div class="shadow py-4 px-6 bg-white lg:hidden flex justify-between items-center">
      <NavBarMenu />
      <LLink :to="{name: 'index'}">
        <img alt="" class="w-40" src="~/assets/images/h_logo.png">
      </LLink>
    </div>
  </div>
</template>

<script>
  import NavBarMenu from './NavBarMenu';
  import LangSwitch from '~/components/LangSwitch';
  import LLink from '~/components/l-link';

  export default {
    name: 'NavBar',
    components: { NavBarMenu, LLink, LangSwitch }
  };
</script>

<style scoped>

</style>
