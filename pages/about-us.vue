<template>
  <Card>
    <CardContent class="p-8 leading-8">
      <span v-html="setting.about_us"></span>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from '~/components/ui/card'

export default {
  name: 'AboutUs',
  components: { Card, CardContent },
  head() {
    return this.metaBuilder(this.$t('about_us'));
  },
};
</script>

<style scoped>
</style>
