<template>
  <div>
    <!-- Desktop NavBar -->
    <div class="shadow py-3 px-6 bg-white lg:flex hidden justify-between items-center">
      <LLink :to="{ name: 'index' }">
        <img alt="" class="w-40" src="~/assets/images/h_logo.png">
      </LLink>

      <nav class="flex items-center gap-1">
        <LLink :to="{ name: 'index' }" class="nav-item px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors">{{ $t('home') }}</LLink>
        <LLink :to="{ name: 'category' }" class="nav-item px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors">{{ $t('categories') }}</LLink>
        <LLink :to="{ name: 'company' }" class="nav-item px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors">{{ $t('companies') }}</LLink>
        <LLink :to="{ name: 'blog' }" class="nav-item px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors">{{ $t('blog') }}</LLink>
        <LLink :to="{ name: 'about-us' }" class="nav-item px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors">{{ $t('about_us') }}</LLink>
      </nav>

      <div class="flex items-center gap-2">
        <LLink :to="{ name: 'company-create' }">
          <Button variant="secondary" class="rounded-full font-bold gap-1.5">
            <Plus :size="16" />
            {{ $t('add_company') }}
          </Button>
        </LLink>

        <LLink :to="{ name: 'favorite' }">
          <Button variant="ghost" size="icon" class="relative">
            <Heart :size="20" fill="currentColor" />
          </Button>
        </LLink>

        <LLink :to="{ name: 'notification' }">
          <Button variant="ghost" size="icon" class="relative">
            <Bell :size="20" />
            <Badge v-if="unread_notifications"
                   class="absolute -top-1 -start-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] bg-red-600 text-white border-0">
              {{ unread_notifications }}
            </Badge>
          </Button>
        </LLink>

        <LLink v-if="!isAuthenticated" :to="{ name: 'login' }">
          <Button variant="ghost" class="gap-1.5">
            <span class="text-sm font-bold">{{ $t('login') }}</span>
            <User :size="18" />
          </Button>
        </LLink>

        <LLink v-else :to="{ name: 'profile' }">
          <Button variant="ghost" class="gap-1.5">
            <span class="text-sm font-bold">{{ authUser?.name }}</span>
            <User :size="18" />
          </Button>
        </LLink>
      </div>
    </div>

    <!-- Mobile NavBar -->
    <div class="shadow py-3 px-4 bg-white lg:hidden flex justify-between items-center">
      <NavBarMenu />
      <LLink :to="{ name: 'index' }">
        <img alt="" class="w-36" src="~/assets/images/h_logo.png">
      </LLink>
    </div>
  </div>
</template>

<script setup>
import { Heart, Bell, User, Plus } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

const { status, data } = useAuth()

const isAuthenticated = computed(() => status.value === 'authenticated')
const authUser = computed(() => data.value)
</script>
