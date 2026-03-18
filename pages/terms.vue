<template>
  <Card>
    <CardContent class="p-8 leading-8">
      <span v-html="setting.terms"></span>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from '~/components/ui/card'

export default {
  name: 'Terms',
  components: { Card, CardContent },
  head() {
    return this.metaBuilder(this.$t('terms'));
  },
};
</script>

<style scoped>
</style>
