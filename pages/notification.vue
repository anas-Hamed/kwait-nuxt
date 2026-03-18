<script setup>
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

definePageMeta({ middleware: ['sidebase-auth'] })

const api = useApi()
const appStore = useAppStore()

const notifications = ref([])
const offset = ref(0)
const limit = ref(10)
const loadingMore = ref(false)
const allLoaded = ref(false)
const loadMoreTrigger = ref(null)

async function loadMore() {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  try {
    const res = await api.get('notifications', {
      offset: offset.value
    })
    const data = res.data
    if (data.length > 0) {
      notifications.value = [...notifications.value, ...data]
      offset.value += limit.value
    } else {
      allLoaded.value = true
    }
  } catch (e) {
    allLoaded.value = true
  } finally {
    loadingMore.value = false
  }
}

function readAll() {
  api.post('notifications/makeAllAsRead').then(() => {
    notifications.value = notifications.value.map(el => {
      el.read_at = true
      return el
    })
    appStore.setNotificationsCount(0)
  })
}

onMounted(() => {
  if (!loadMoreTrigger.value) return
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loadingMore.value && !allLoaded.value) {
      loadMore()
    }
  })
  observer.observe(loadMoreTrigger.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <Card>
    <CardContent class="p-8 leading-8">
      <div class="flex justify-end">
        <Button variant="link" :disabled="notifications.length === 0" @click="readAll">{{$t('read_all')}}</Button>
      </div>
      <div class="max-w-screen-sm mx-auto">
        <NotificationCard
          v-for="(noty, index) in notifications"
          :key="`notification-${index}`"
          :notification="noty"
        />
      </div>
      <client-only>
        <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4 text-center">
          <LoadingCircle :loading="true" />
        </div>
        <div v-if="allLoaded && notifications.length === 0" class="text-center py-8 text-muted-foreground">
          {{ $t('no_result') }}
        </div>
        <div v-if="allLoaded && notifications.length > 0" class="text-center py-4 text-muted-foreground">
          {{ $t('no_more') }}
        </div>
      </client-only>
    </CardContent>
  </Card>
</template>

<script>
export default {
  name: 'Notifications',
};
</script>

<style scoped></style>
