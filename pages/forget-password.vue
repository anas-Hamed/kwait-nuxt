<template>
  <div class="bg-grey-200 flex flex-col justify-center items-center py-4 ">
    <div class="card  p-3" style="width: 100%; max-width: 500px">
      <h2 class="text-primary text-2xl text-center mb-3">{{$t('reset_password')}}</h2>
      <div>

        <MyInput :label="$t('email')" name="email" error="email" v-model="email" input-dir="ltr" placeholder="example@example.com" type="text"/>
      </div>
      <button @click="sendResetEmail" class="rounded bg-secondary mt-3 w-full p-2 "><LoadingCircle :loading="loading">{{$t('send')}}</LoadingCircle></button>
    </div>
  </div>
</template>

<script>
import LoadingCircle from '../components/loading-circle';
import MyInput from '../components/MyInput';
export default {
  name: 'ForgetPassword',
  components: { MyInput, LoadingCircle },
  data() {
    return {
      loading: false,
      email:''
    };
  },
  methods: {
    sendResetEmail() {
      this.loading = true;
      this.$axios.post('password/send-reset-email',{email: this.email}).then(data => {
        this.$swal({
          icon: 'success',
          title: 'نجاح',
          text: "تم ارسال رابط الاستعادة ، تفقد البريد الوارد و الرسائل غير المرغوب بها",
          showConfirmButton: false,
          timer: 3000,
        })
      }).catch(e => {
        if (e.response?.status !== 422){
          this.$swal({
            icon: "error",
            title: "فشل",
            text: "يرجى المحاولة لاحقا",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }).finally(() => {
        this.loading = false;
      })
    }
  }
};
</script>

<style scoped>

</style>
