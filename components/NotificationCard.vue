<template>
  <div class="mx-auto  p-3">
    <div class="  w-full px-2 border rounded transition duration-200"
         :class="[(notification.read_at != null || read)?'bg-accent':'bg-blue-100' ]">
      <div class="flex items-center py-2">
        <div class="w-12 text-secondary">
          <Icon name="notification" size-class="w-8" />
        </div>
        <div class="flex-auto">
          <h4 class="text-2xl font-bold mb-0 text-primary">{{ notification.data.title }}</h4>
          <div class="px-2 text-accentSecondary">{{ notification.data.body }}</div>
          <div class="flex justify-end w-full">
            <client-only>
              <small>{{$moment(notification.created_at).format('yyyy-MM-DD H:m')}}</small>
            </client-only>
          </div>
        </div>
        <div class="w-4">
          <button v-if="notification.read_at == null" class="w-4 h-4 rounded-full bg-gray-400 cursor-pointer" title="تعيين كمقروء"
                  @click="markAsRead"></button>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import Icon from './Icon';

  export default {
    name: 'NotificationCard',
    components: { Icon },
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        read: false
      };
    },
    methods: {
      markAsRead() {
        this.$axios.post(`notifications/makeAsRead/${this.notification.id}`).then(data => {
          this.read = true;
          this.$store.dispatch('decreaseNotificationsCount')
        });
      }
    }
  };
</script>

<style scoped></style>
