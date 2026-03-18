<template>
  <Card class="max-w-screen-sm mx-auto">
    <CardContent class="p-8 leading-8">
      <h3 class="text-2xl mb-3 text-center">{{$t('contact_us')}}</h3>
      <MyInput id="name" v-model="form.name" :label="$t('name')" error="name" placeholder="---"/>
      <MyInput id="email" v-model="form.email" :label="$t('email')" error="email" placeholder="example@example.com" />
      <Phone id="phone" v-model="form.phone" :label="$t('phone')" error="phone" />
      <div class="mb-3">
        <label for="message">{{$t('message')}}</label>
        <textarea id="message" v-model="form.message" class="w-full bg-accent rounded-sm border p-2 mt-1" :class="[(errors && errors['message']) ? 'border border-destructive' : '']"
                  placeholder="-----"
                  rows="4" ></textarea>
        <InputError name="message" />
      </div>
      <Button class="w-full mt-4" @click="sendMessage">
        <LoadingCircle :loading="loading">{{$t('send')}}</LoadingCircle>
      </Button>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

export default {
  name: 'ContactUs',
  components: { Card, CardContent, Button },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        email: '',
        phone: '',
        message: ''
      }
    };
  },
  head() {
    return this.metaBuilder(this.$t('contact_us'));
  },
  methods: {
    async sendMessage() {
      this.loading = true;
      try {
        const api = useApi();
        await api.post('contact-us', this.form);
        this.form = {
          name: '',
          email: '',
          phone: '',
          message: ''
        };
        this.$toast.success(this.$t('operation_success'));
      } catch (e) {
        // handled by useApi
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
