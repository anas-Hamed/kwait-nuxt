<template>
  <div v-if="open"
       class="fixed w-full h-full bg-black bg-opacity-50 top-0 left-0 flex justify-center items-center z-30" >
    <button type="button" class="absolute left-0 top-0 p-2 text-white text-2xl" aria-label="Close" @click="close(null)">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="dialog overflow-hidden bg-white rounded  z-50 p-2 -mt-12 text-center">
      <h3 class="w-full">{{$t('rate_company')}}</h3>
      <Rate v-model="rate" :length="5" :min="1" class="mx-auto mb-2" />
      <button class="mx-auto py-1 px-3 bg-primary text-white rounded " @click="rateCompany">
        <LoadingCircle :loading="rating">
          {{$t('rate')}}
        </LoadingCircle>
      </button>
    </div>
  </div>
</template>

<script>
  import { Rate } from 'vue-rate';
  import 'vue-rate/dist/vue-rate.css';
  import LoadingCircle from './loading-circle';

  export default {
    name: 'RateModal',
    components: { LoadingCircle, Rate },
    props: {
      open: {
        type: Boolean,
        default: false
      },
      companyId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        rate: 1,
        rating: false
      };
    },
    mounted() {

    },
    destroyed() {

    },
    methods: {
      rateCompany() {
        this.rating = true;
        this.$axios.post('company/rate', {
          company_id: this.companyId,
          rate: this.rate
        }).then(data => {
          this.close(data.data.data);
          this.$toast.success('تم تقييم الشركة بنجاح').goAway(1000);
        }).catch(e => {
          this.$toast.error('خطأ في التقييم يرجى المحاولة لاحقا').goAway(1000);
        })
          .finally(() => {
            this.rating = false;
          });
      },
      close(value = null) {
        this.$emit('close', value);
      }
    }
  };
</script>

<style scoped>
  .dialog {
    animation: animate-dialog 0.1s ease-in-out;

  }

  @keyframes animate-dialog {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
