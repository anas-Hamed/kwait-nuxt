<template>
  <div v-if="open"
       class="fixed w-full h-full bg-black bg-opacity-50 top-0 left-0 flex justify-center items-center z-30" >
    <button type="button" class="absolute left-0 top-0 p-2 text-white text-2xl" aria-label="Close" @click="close(null)">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="dialog overflow-hidden bg-white rounded  z-50 p-2 -mt-12 text-center">
      <h3 class="w-full">{{$t('rate_company')}}</h3>
      <div class="flex justify-center mb-2 space-x-1">
        <button v-for="star in 5" :key="star" type="button" @click="rate = star" class="focus:outline-none">
          <Icon
            :name="star <= rate ? 'filledStar' : 'star'"
            size-class="w-8 h-8"
            :class="star <= rate ? 'text-yellow-400' : 'text-gray-300'"
          />
        </button>
      </div>
      <button class="mx-auto py-1 px-3 bg-primary text-white rounded " @click="rateCompany">
        <LoadingCircle :loading="rating">
          {{$t('rate')}}
        </LoadingCircle>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RateModal',
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
    unmounted() {

    },
    methods: {
      rateCompany() {
        this.rating = true;
        useApi().post('company/rate', {
          company_id: this.companyId,
          rate: this.rate
        }).then(data => {
          this.close(data.data.data);
          this.$toast.success('Rating submitted successfully');
        }).catch(e => {
          this.$toast.error('Rating failed, please try again later');
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
