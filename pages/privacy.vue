<template>
  <Card>
    <CardContent class="p-8 leading-8">
      <span v-html="setting.privacy"></span>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from '~/components/ui/card'

export default {
  name: 'Privacy',
  components: { Card, CardContent },
  head() {
    return this.metaBuilder(this.$t('privacy'));
  },
};
</script>

<style scoped>
</style>
