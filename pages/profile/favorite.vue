<template>
  <Card>
    <CardContent class="p-6">
      <h3 class="text-2xl mb-4">{{$t('favorite')}}</h3>
      <div class="flex flex-wrap">
        <div :key="`company-${company.id}`" class="w-full md:w-2/4 p-1" v-for="company in favorite">
          <CompanyCard :company="company" class=""/>
        </div>
        <div class="w-full">
          <span v-if="favorite && favorite.length === 0">{{$t('no_favorite_companies')}}</span>
          <div class="py-2">
            <LLink :to="{name: 'company'}" class="font-bold">{{$t('explore_companies')}}</LLink>
          </div>
        </div>
      </div>
      <LLink :to="{name: 'favorite'}" class="mt-8 flex items-center">
        <Button variant="secondary" size="icon" class="rounded-full h-8 w-8">
          <Plus :size="16" />
        </Button>
        <div class="w-1"></div>
        <b>{{$t('show_all')}}</b>
      </LLink>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-vue-next'

export default {
  name: 'Favorite',
  components: { Card, CardContent, Button, Plus },
  props: {
    favorite: {
      type: Array,
      default: () => []
    }
  },
};
</script>

<style scoped>
</style>
