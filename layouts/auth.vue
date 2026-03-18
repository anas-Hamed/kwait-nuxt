<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-surface">
    <!-- Brand Panel -->
    <div class="hidden lg:flex lg:w-5/12 items-center justify-center relative m-4 me-0 rounded-3xl hero-gradient">
      <div class="hero-corner-tl" />
      <div class="hero-corner-br" />
      <div class="relative z-10 text-center px-12">
        <LLink :to="{ name: 'index' }" class="block mb-3">
          <img src="~/assets/images/logo-white.svg" alt="Kuwait Explorer" class="w-96 mx-auto" />
        </LLink>
        <p class="text-white/40 text-sm max-w-sm mx-auto leading-relaxed mb-10">
          {{ $t('kuwait_explorer_description') }}
        </p>

        <!-- Auth Navigation -->
        <div class="inline-flex items-center gap-1 bg-white/10 rounded-full p-1">
          <LLink :to="{ name: 'login' }"
                 class="py-3 px-8 rounded-full text-sm font-bold transition-all"
                 :class="isLoginPage
                   ? 'bg-secondary text-primary shadow-sm'
                   : 'text-white/60 hover:text-white'">
            {{ $t('login') }}
          </LLink>
          <LLink :to="{ name: 'register' }"
                 class="py-3 px-8 rounded-full text-sm font-bold transition-all"
                 :class="isRegisterPage
                   ? 'bg-secondary text-primary shadow-sm'
                   : 'text-white/60 hover:text-white'">
            {{ $t('register') }}
          </LLink>
        </div>
      </div>
    </div>

    <!-- Form Panel -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 lg:py-12 bg-surface min-h-screen">
      <!-- Mobile logo -->
      <LLink :to="{ name: 'index' }" class="lg:hidden mb-8">
        <img src="~/assets/images/h_logo.png" alt="Kuwait Explorer" class="h-12" />
      </LLink>

      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const head = useLocaleHead({ addSeoAttributes: true, addDirAttribute: true })
useHead(head)

const validationStore = useValidationStore()
const route = useRoute()

const isLoginPage = computed(() => route.path.includes('/login'))
const isRegisterPage = computed(() => route.path.includes('/register'))

watch(
  () => route.fullPath,
  () => { validationStore.clearErrors() }
)
</script>
