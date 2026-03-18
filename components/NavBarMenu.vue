<template>
  <div>
    <Sheet v-model:open="opened">
      <SheetTrigger as-child>
        <Button variant="ghost" size="icon" class="relative">
          <Menu :size="28" />
          <span v-if="unread_notifications" class="absolute top-0.5 end-0.5 w-2.5 h-2.5 bg-red-600 rounded-full" />
        </Button>
      </SheetTrigger>
      <SheetContent :side="sheetSide" class="w-[280px] p-0">
        <SheetHeader class="p-4 pb-2">
          <SheetTitle class="text-start">
            <template v-if="isAuthenticated">
              <LLink :to="{ name: 'profile' }" class="flex items-center gap-2" @click="opened = false">
                <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <User :size="20" />
                </div>
                <div>
                  <p class="text-lg font-bold">{{ authUser?.name }}</p>
                </div>
              </LLink>
              <button @click="logout" class="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 hover:text-primary transition-colors">
                <LogOut :size="14" />
                <span>{{ $t('logout') }}</span>
              </button>
            </template>
            <template v-else>
              <LLink :to="{ name: 'login' }" class="flex items-center gap-2 text-blue-600" @click="opened = false">
                <User :size="20" />
                <span>{{ $t('login') }}</span>
              </LLink>
            </template>
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <nav class="flex flex-col p-4 gap-1">
          <LLink v-for="link in navLinks" :key="link.name" :to="{ name: link.name }" @click="opened = false"
                 class="flex items-center gap-2 px-3 py-2.5 rounded-md font-medium hover:bg-accent transition-colors">
            {{ $t(link.label) }}
          </LLink>

          <LLink :to="{ name: 'favorite' }" @click="opened = false"
                 class="flex items-center gap-2 px-3 py-2.5 rounded-md font-medium hover:bg-accent transition-colors">
            {{ $t('favorite') }}
          </LLink>

          <LLink :to="{ name: 'notification' }" @click="opened = false"
                 class="flex items-center justify-between px-3 py-2.5 rounded-md font-medium hover:bg-accent transition-colors">
            <span>{{ $t('notifications') }}</span>
            <Badge v-if="unread_notifications" class="bg-red-600 text-white border-0 text-[10px] h-5 min-w-5">
              {{ unread_notifications }}
            </Badge>
          </LLink>
        </nav>

        <div class="px-4 mt-2">
          <LLink :to="{ name: 'company-create' }" @click="opened = false">
            <Button variant="secondary" class="w-full rounded-full font-bold">
              {{ $t('add_company') }}
            </Button>
          </LLink>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup>
import { Menu, User, LogOut } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Separator } from '~/components/ui/separator'

const { locale } = useI18n()
const { status, data, signOut } = useAuth()
const route = useRoute()

const opened = ref(false)
const sheetSide = computed(() => locale.value === 'ar' ? 'right' : 'left')
const isAuthenticated = computed(() => status.value === 'authenticated')
const authUser = computed(() => data.value)

const navLinks = [
  { name: 'index', label: 'home' },
  { name: 'category', label: 'categories' },
  { name: 'company', label: 'companies' },
  { name: 'blog', label: 'blog' },
  { name: 'about-us', label: 'about_us' },
]

watch(() => route.fullPath, () => {
  opened.value = false
})

function logout() {
  signOut()
}
</script>
