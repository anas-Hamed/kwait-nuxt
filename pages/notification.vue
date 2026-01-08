<template>
  <div class="bg-white shadow p-8 leading-8">
    <div class="flex justify-end">
      <button :disabled="notifications.length === 0" class="text-blue-500" @click="readAll">{{$t('read_all')}}</button>
    </div>
    <div class="max-w-screen-sm mx-auto">
      <notification-card
        v-for="(noty, index) in notifications"
        :key="`notification-${index}`"
        :notification="noty"
      />
    </div>
    <client-only>
      <infinite-loading
        :identifier="infiniteId"
        spinner="spiral"
        @infinite="getNotifications"
      />
    </client-only>
  </div>
</template>

<script>

  import NotificationCard from '~/components/NotificationCard';

  export default {
    name: 'Notifications',
    components: { NotificationCard },
    middleware: 'auth',
    data: () => {
      return {
        offset: 0,
        notifications: [],
        infiniteId: +new Date(),
        limit: 10
      };
    },
    mounted() {
    },
    methods: {
      async getNotifications($state) {
        let data = [];
        try {
          data = (await this.$axios.get('notifications', {
            params: {
              offset: this.offset
            }
          })).data.data;
          if (data.length > 0) {
            this.notifications = [...this.notifications, ...data];
            this.offset += this.limit;
            $state.loaded();
          } else {
            $state.complete();
          }
        } catch (e) {

        }
      },
      readAll() {
        this.$axios.post('notifications/makeAllAsRead').then(data => {
          this.notifications = this.notifications.map(el => {
            el.read_at = true;
            return el;
          });
          this.$store.dispatch('setNotificationsCount',0)
        });
      }
    }
  };
</script>

<style scoped></style>
