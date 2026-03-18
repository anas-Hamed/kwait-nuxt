<template>
  <div class="flex-centred py-1 mx-1">
    <NuxtLink v-if="locale === 'en'" class="text-sm" :to="switchLocalePath('ar')">
      <div class="flex-centred">
        <Icon name="world" size-class="w-4" />
        <div class="-mb-1 md:mb-0">AR</div>
      </div>
    </NuxtLink>
    <NuxtLink v-else class="text-sm" :to="switchLocalePath('en')">
      <div class="flex-centred">
        <Icon name="world" size-class="w-4" />
        <div class="-mb-1 md:mb-0">EN</div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const appStore = useAppStore();
const { $dayjs } = useNuxtApp();
const api = useApi();

watch(locale, (newLocale) => {
  $dayjs.locale(newLocale);
  api.get('setting').then((data) => {
    appStore.setSetting(data.data);
  });
});
</script>
