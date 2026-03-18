<script setup>
definePageMeta({ middleware: ['auth'] })

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
  <div class="bg-white shadow p-8 leading-8">
    <div class="flex justify-end">
      <button :disabled="notifications.length === 0" class="text-blue-500" @click="readAll">{{$t('read_all')}}</button>
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
      <div v-if="allLoaded && notifications.length === 0" class="text-center py-8 text-gray-500">
        {{ $t('no_result') }}
      </div>
      <div v-if="allLoaded && notifications.length > 0" class="text-center py-4 text-gray-500">
        {{ $t('no_more') }}
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
};
</script>

<style scoped></style>
