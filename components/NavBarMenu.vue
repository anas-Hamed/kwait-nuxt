<template>
  <div class="">
    <button @click="opened = true" class="relative" :class="{'flipped-menu': $i18n.locale === 'en'}">
      <Icon name="menu" size-class="w-8" />
      <div class="rounded-full w-3 h-3 inset-0 absolute bg-red-600" v-if="unread_notifications"></div>
    </button>

    <transition name="slide">
      <div @click.self="opened = false" class="fixed w-full h-full bg-black bg-opacity-50 z-50 inset-0" v-if="opened">
        <div class="bg-white overflow-y-scroll h-screen py-5  px-4 absolute inset-0 w-3/4 max-w-[250px]">
          <div class="flex flex-col">
            <div class="w-full flex justify-end">
              <button @click="opened = false" class="rounded-full ">
                <Icon name="close" size-class="w-8"/>
              </button>
            </div>
            <div class="my-2">
              <LLink :to="{name:'login'}" class="flex items-center    p-2 rounded-sm mx-2" v-if="!isAuthenticated">
                <span class=" text-blue-500 flex-centred">{{$t('login')}}</span>
                <div class="w-1"></div>
                <Icon name="account" />
              </LLink>
              <template v-else>
                <LLink :to="{name:'profile'}" class="flex items-center    p-2 rounded-sm mx-2">
                  <span class="text-2xl font-bold">{{authUser?.name}}</span>
                  <div class="w-1"></div>
                  <Icon name="account" />
                </LLink>
                <button @click="logout" class="text-blue-500 flex-centred" title="logout">
                  <Icon name="login"/>
                  <span class="w-1"></span><span>{{$t('logout')}}</span></button>
              </template>

            </div>
            <div class="w-full border-t border-accent-secondary opacity-50 mb-4"></div>
            <LLink :to="{name: 'index'}" class=" mb-3 font-bold">{{$t('home')}}</LLink>
            <LLink :to="{name: 'category'}" class=" mb-3 font-bold">{{$t('categories')}}</LLink>
            <LLink :to="{name: 'company'}" class=" mb-3 font-bold">{{$t('companies')}}</LLink>
            <LLink :to="{name: 'blog'}" class=" mb-3 font-bold">{{$t('blog')}}</LLink>
            <LLink :to="{name: 'about-us'}" class=" mb-3 font-bold">{{$t('about_us')}}</LLink>
            <LLink :to="{name:'favorite'}" class=" mb-3 font-bold">{{$t('favorite')}}</LLink>
            <LLink :to="{name:'notification'}" class=" mb-3 font-bold">
              <span>{{$t('notifications')}}    </span>
              <span class="w-4 h-4 bg-red-700 absolute top-1 left-1 rounded-full flex-centred text-white text-xs"
                    v-if="unread_notifications">{{unread_notifications}}</span></LLink>

            <LLink :to="{name:'company-create'}"
                   class="flex items-center justify-center space-x-1   py-2  rounded-full bg-secondary text-white ">
              <span class=" font-bold">{{$t('add_company')}}</span>
            </LLink>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  export default {
    name: 'NavBarMenu',
    data() {
      return {
        opened: false
      };
    },
    computed: {
      isAuthenticated() {
        return useAuth().status.value === 'authenticated';
      },
      authUser() {
        return useAuth().data.value;
      }
    },
    mounted() {
      this.opened = false;
    },
    watch: {
      '$route': {
        handler() {
          this.opened = false;
        }
      }
    },
    methods: {
      logout() {
        useAuth().signOut();
      }
    }
  };
</script>

<style scoped>

</style>
