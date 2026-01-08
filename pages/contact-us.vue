<template>
  <div class="bg-white shadow p-8 leading-8 max-w-screen-sm mx-auto">
    <h3 class="text-2xl mb-3 text-center">{{$t('contact_us')}}</h3>
    <MyInput id="name" v-model="form.name" :label="$t('name')" error="name" placeholder="---"/>
    <MyInput id="email" v-model="form.email" :label="$t('email')" error="email" placeholder="example@example.com" />
    <Phone id="phone" v-model="form.phone" :label="$t('phone')" error="phone" />
    <div class="mb-3">
      <label for="message">{{$t('message')}}</label>
      <textarea id="message" v-model="form.message" class="w-full bg-accent rounded border p-2 mt-1" :class="[(errors && errors['message']) ?'border-error' : '']"
                placeholder="-----"
                rows="4" ></textarea>
      <Error name="message" />
    </div>
    <button class="rounded bg-primary text-white mt-4 w-full p-2 " @click="sendMessage">
      <LoadingCircle :loading="loading">{{$t('send')}}</LoadingCircle>
    </button>
  </div>
</template>

<script>
  import MyInput from '../components/MyInput';
  import Error from '../components/InputError';
  import LoadingCircle from '../components/loading-circle';
  import Phone from '../components/Phone';

  export default {
    name: 'ContactUs',
    components: { Phone, LoadingCircle, Error, MyInput },
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
          await this.$axios.post('contact-us', this.form);
          this.form = {
            name: '',
            email: '',
            phone: '',
            message: ''
          };
          this.$toast.success(this.$t('operation_success')).goAway(1000);
        } catch ({ response }) {

        } finally {
          this.loading = false;
        }

      }
    }
  };
</script>

<style scoped>

</style>
