<template>
  <div class="mx-auto p-1.5">
    <Card class="transition-colors"
          :class="[(notification.read_at != null || read) ? 'bg-accent' : 'bg-blue-50 border-blue-200']">
      <CardContent class="flex items-center gap-3 p-4">
        <div class="shrink-0 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
          <Bell :size="20" class="text-secondary" />
        </div>
        <div class="flex-auto min-w-0">
          <h4 class="text-lg font-bold text-primary truncate">{{ notification.data.title }}</h4>
          <p class="text-sm text-muted-foreground mt-0.5">{{ notification.data.body }}</p>
          <div class="flex justify-end w-full mt-1">
            <client-only>
              <small class="text-xs text-muted-foreground">{{ $dayjs(notification.created_at).format('YYYY-MM-DD H:m') }}</small>
            </client-only>
          </div>
        </div>
        <div class="shrink-0">
          <button v-if="notification.read_at == null && !read"
                  class="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer transition-colors"
                  title="Mark as read" @click="markAsRead" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { Bell } from 'lucide-vue-next'
import { Card, CardContent } from '~/components/ui/card'

export default {
  name: 'NotificationCard',
  components: { Bell, Card, CardContent },
  props: {
    notification: { type: Object, required: true },
  },
  data() {
    return { read: false }
  },
  methods: {
    markAsRead() {
      const appStore = useAppStore()
      useApi().post(`notifications/makeAsRead/${this.notification.id}`).then(data => {
        this.read = true
        appStore.decreaseNotificationsCount()
      })
    },
  },
}
</script>
