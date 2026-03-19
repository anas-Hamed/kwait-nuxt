<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-surface">
    <!-- Brand Panel with SVG notch card -->
    <div class="hidden lg:flex lg:w-5/12 relative m-4 me-0">
      <!-- SVG card shape with centered top notch (same as homepage hero) -->
      <svg class="auth-card-bg" viewBox="0 0 500 900" fill="none" preserveAspectRatio="none">
        <path d="M20,0 L80,0 Q95,0 100,14 L120,65 Q126,80 146,80 L354,80 Q374,80 380,65 L400,14 Q405,0 420,0 L480,0 Q500,0 500,20 L500,880 Q500,900 480,900 L20,900 Q0,900 0,880 L0,20 Q0,0 20,0 Z" fill="#1b2c3b"/>
      </svg>

      <!-- Tabs in the top notch -->
      <div class="auth-notch-tabs">
        <div class="inline-flex items-center gap-0.5 bg-white rounded-full p-0.5 shadow-sm">
          <LLink :to="{ name: 'login' }"
                 class="py-2 px-6 rounded-full text-sm font-bold transition-all"
                 :class="isLoginPage
                   ? 'bg-secondary text-primary shadow-sm'
                   : 'text-muted-foreground hover:text-primary'">
            {{ $t('login') }}
          </LLink>
          <LLink :to="{ name: 'register' }"
                 class="py-2 px-6 rounded-full text-sm font-bold transition-all"
                 :class="isRegisterPage
                   ? 'bg-secondary text-primary shadow-sm'
                   : 'text-muted-foreground hover:text-primary'">
            {{ $t('register') }}
          </LLink>
        </div>
      </div>

      <!-- Logo & description centered -->
      <div class="auth-card-content">
        <div class="hero-corner-tl" />
        <div class="hero-corner-br" />

        <div class="relative z-10 text-center">
          <LLink :to="{ name: 'index' }" class="block mb-3">
            <img src="~/assets/images/logo-white.svg" alt="Kuwait Explorer" class="w-80 mx-auto" />
          </LLink>
          <p class="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            {{ $t('kuwait_explorer_description') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Form Panel -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 lg:py-12 bg-surface min-h-screen">
      <!-- Mobile logo & tabs -->
      <LLink :to="{ name: 'index' }" class="lg:hidden mb-4">
        <img src="~/assets/images/h_logo.png" alt="Kuwait Explorer" class="h-12" />
      </LLink>
      <div class="lg:hidden inline-flex items-center gap-1 bg-white rounded-full p-1 shadow-soft mb-6">
        <LLink :to="{ name: 'login' }"
               class="py-2.5 px-6 rounded-full text-sm font-bold transition-all"
               :class="isLoginPage
                 ? 'bg-secondary text-primary shadow-sm'
                 : 'text-muted-foreground hover:text-primary'">
          {{ $t('login') }}
        </LLink>
        <LLink :to="{ name: 'register' }"
               class="py-2.5 px-6 rounded-full text-sm font-bold transition-all"
               :class="isRegisterPage
                 ? 'bg-secondary text-primary shadow-sm'
                 : 'text-muted-foreground hover:text-primary'">
          {{ $t('register') }}
        </LLink>
      </div>

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

<style>
.auth-card-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.auth-card-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  padding-top: 5rem;
}

.auth-notch-tabs {
  position: absolute;
  top: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  white-space: nowrap;
  max-width: 70%;
}
.auth-notch-tabs .inline-flex {
  width: 100%;
}
.auth-notch-tabs a {
  flex: 1;
  text-align: center;
}
</style>
