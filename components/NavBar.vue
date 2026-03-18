<template>
  <div>
    <div class="shadow py-4 px-6 bg-white lg:flex hidden justify-between items-center">

      <LLink :to="{name: 'index'}">
        <img alt="" class="w-40" src="~/assets/images/h_logo.png">
      </LLink>
      <div class=" flex ">
        <LLink :to="{name: 'index'}" class="mx-2 nav-item">{{$t('home')}}</LLink>
        <LLink :to="{name: 'category'}" class="mx-2 nav-item">{{$t('categories')}}</LLink>
        <LLink :to="{name: 'company'}" class="mx-2 nav-item">{{$t('companies')}}</LLink>
        <LLink :to="{name: 'blog'}" class="mx-2 nav-item">{{$t('blog')}}</LLink>
        <LLink :to="{name: 'about-us'}" class="mx-2 nav-item">{{$t('about_us')}}</LLink>
      </div>
      <div class="flex  space-x-1 ">
        <LLink :to="{name:'company-create'}"
               class="flex items-center space-x-1   py-2 px-4 rounded-full bg-secondary text-white mx-2">
          <span class="text-sm font-bold">{{$t('add_company')}}</span>
        </LLink>
        <LLink :to="{name:'favorite'}" class="flex items-center  nav-item  p-2 rounded mx-2">
          <Icon name="filledHeart" />
        </LLink>
        <LLink :to="{name:'notification'}" class="flex items-center  nav-item  p-2 rounded mx-2 relative">
          <Icon name="notification" />
          <span class="w-4 h-4 bg-red-700 absolute top-1 left-1 rounded-full flex-centred text-white text-xs"
                v-if="unread_notifications">{{unread_notifications}}</span>
        </LLink>
        <div>
          <LLink :to="{name:'login'}" class="flex items-center  nav-item  p-2 rounded mx-2" v-if="!isAuthenticated">
            <span class="text-sm font-bold">{{$t('login')}}</span>
            <div class="w-1"></div>
            <Icon name="account" />
          </LLink>
          <LLink :to="{name:'profile'}" class="flex items-center space-x-1 nav-item  p-2 rounded mx-2" v-else>
            <span class="text-sm font-bold">{{authUser?.name}}</span>
            <div class="w-1"></div>
            <Icon name="account" />
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
  export default {
    name: 'NavBar',
    computed: {
      isAuthenticated() {
        return useAuth().status.value === 'authenticated';
      },
      authUser() {
        return useAuth().data.value;
      }
    }
  };
</script>

<style scoped>

</style>
