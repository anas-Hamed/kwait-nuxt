<script setup>
import { Bell, CheckCheck } from 'lucide-vue-next'
import { Skeleton } from '~/components/ui/skeleton'

definePageMeta({ middleware: ['sidebase-auth'] })

const api = useApi()
const appStore = useAppStore()

const notifications = ref([])
const offset = ref(0)
const limit = ref(10)
const loadingMore = ref(false)
const allLoaded = ref(false)
const initialLoading = ref(true)
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
    initialLoading.value = false
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

let observer = null

onMounted(() => {
  loadMore()
})

watch(loadMoreTrigger, (el) => {
  if (el) {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore.value && !allLoaded.value) {
        loadMore()
      }
    })
    observer.observe(el)
  }
}, { immediate: true })

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="nt-page">
    <!-- Header -->
    <div class="nt-header">
      <h1 class="nt-title">{{ $t('notifications') }}</h1>
      <button v-if="notifications.length > 0" class="nt-read-all" @click="readAll">
        <CheckCheck :size="14" />
        {{ $t('read_all') }}
      </button>
    </div>

    <!-- Notifications list -->
    <div class="nt-list">
      <NotificationCard
        v-for="(noty, index) in notifications"
        :key="`notification-${index}`"
        :notification="noty"
      />
    </div>

    <!-- Skeleton -->
    <div v-if="initialLoading" class="nt-list">
      <div v-for="n in 5" :key="`sk-${n}`" class="nt-skeleton">
        <Skeleton class="nt-sk-dot" />
        <div class="nt-sk-body">
          <Skeleton class="h-3.5 w-2/3 rounded" />
          <Skeleton class="h-2.5 w-full rounded mt-1.5" />
        </div>
        <Skeleton class="h-2.5 w-12 rounded" />
      </div>
    </div>

    <client-only>
      <div v-if="!allLoaded" ref="loadMoreTrigger" class="py-4"></div>

      <div v-if="allLoaded && notifications.length === 0" class="nt-empty">
        <Bell :size="48" class="text-muted-foreground opacity-30" />
        <p>{{ $t('no_result') }}</p>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
};
</script>

<style>
.nt-page {
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.nt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}
.nt-title {
  font-family: 'Cairo', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
}
.nt-read-all {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem 0.65rem;
  border-radius: 9999px;
  transition: all 0.15s ease;
}
.nt-read-all:hover {
  background: var(--color-surface);
  color: var(--color-primary);
}

/* List */
.nt-list {
  animation: fade-in 0.3s ease-out;
}

/* Skeleton */
.nt-skeleton {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--color-border);
}
.nt-skeleton:last-child {
  border-bottom: none;
}
.nt-sk-dot {
  width: 0.5rem;
  height: 0.5rem;
  min-width: 0.5rem;
  border-radius: 50%;
  margin-top: 0.35rem;
  background: #e2e8f0 !important;
}
.nt-sk-body {
  flex: 1;
}
.nt-sk-body > * {
  background: #e2e8f0 !important;
}

/* Empty */
.nt-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}
.nt-empty p {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  opacity: 0.5;
  margin-top: 0.75rem;
}
</style>
