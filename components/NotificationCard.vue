<template>
  <div class="nc" :class="{ 'nc--unread': notification.read_at == null && !read }">
    <div class="nc-icon">
      <Bell :size="18" />
      <div class="nc-dot" v-if="notification.read_at == null && !read" @click="markAsRead"></div>
    </div>
    <div class="nc-body">
      <h4 class="nc-title">{{ notification.data.title }}</h4>
      <p class="nc-text">{{ notification.data.body }}</p>
    </div>
    <client-only>
      <span class="nc-time">{{ $dayjs(notification.created_at).fromNow() }}</span>
    </client-only>
  </div>
</template>

<script>
import { Bell } from 'lucide-vue-next'

export default {
  name: 'NotificationCard',
  components: { Bell },
  props: {
    notification: { type: Object, required: true },
  },
  data() {
    return { read: false }
  },
  methods: {
    markAsRead() {
      const appStore = useAppStore()
      useApi().post(`notifications/makeAsRead/${this.notification.id}`).then(() => {
        this.read = true
        appStore.decreaseNotificationsCount()
      })
    },
  },
}
</script>

<style>
.nc {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s ease;
}
.nc:last-child {
  border-bottom: none;
}
.nc--unread {
  background: rgba(59, 130, 246, 0.04);
  margin: 0 -0.75rem;
  padding-inline: 0.75rem;
  border-radius: 0.5rem;
  border-bottom-color: transparent;
}

.nc-icon {
  position: relative;
  width: 3.25rem;
  height: 3.25rem;
  min-width: 3.25rem;
  border-radius: 50%;
  background: var(--color-secondary);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nc-dot {
  position: absolute;
  top: -2px;
  inset-inline-end: -2px;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid #fff;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.nc-dot:hover {
  transform: scale(1.4);
}

.nc-body {
  flex: 1;
  min-width: 0;
}
.nc-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.4;
}
.nc-text {
  font-size: 1rem;
  color: var(--color-muted-foreground);
  line-height: 1.5;
  margin-top: 0.15rem;
}

.nc-time {
  font-size: 0.85rem;
  color: var(--color-muted-foreground);
  white-space: nowrap;
  margin-top: 0.15rem;
  flex-shrink: 0;
}
</style>
