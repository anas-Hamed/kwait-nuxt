<template>
  <div class="bg-white rounded-2xl shadow-soft p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-primary">{{ $t('favorite') }}</h3>
      <LLink :to="{ name: 'favorite' }">
        <Button variant="outline" size="sm" class="rounded-full text-xs">{{ $t('show_all') }}</Button>
      </LLink>
    </div>

    <div v-if="favorite && favorite.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <CompanyCard v-for="company in favorite" :key="company.id" :company="company" />
    </div>

    <div v-else class="text-center py-12">
      <Heart :size="48" class="mx-auto text-muted-foreground/30 mb-3" />
      <p class="text-muted-foreground text-sm">{{ $t('no_favorite_companies') }}</p>
      <LLink :to="{ name: 'company' }">
        <Button class="mt-4 rounded-xl">{{ $t('explore_companies') }}</Button>
      </LLink>
    </div>
  </div>
</template>

<script>
import { Button } from '~/components/ui/button'
import { Heart } from 'lucide-vue-next'

export default {
  name: 'Favorite',
  components: { Button, Heart },
  props: {
    favorite: { type: Array, default: () => [] }
  },
};
</script>
