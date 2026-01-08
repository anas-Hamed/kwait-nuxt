<template>
  <div class="max-w-screen-lg mx-auto">
    <Ads :ads="company.images" :loading="adsLoading" attribute="path" class="mb-4" v-if="company.images.length > 0"/>
    <div class="bg-white rounded border overflow-hidden shadow flex flex-wrap px-0 relative ">
      <div
        class="absolute bg-primary -translate-y-2/4 shadow-md border -left-16 top-16 py-3 w-64 text-center text-white transform -rotate-45 z-30">
        {{company.category.name}}
      </div>
      <div class="w-72 mx-auto">
        <ImagePlaceholder :image="company.image" :top="100" class="rounded border"/>
      </div>
      <div class="flex-1 p-12">

        <div class="flex-1 flex justify-start items-center">
          <h2 class="text-3xl font-bold">{{$i18n.locale === 'ar' ? company.ar_name : company.en_name}}</h2>
          <div v-if="company.is_trusted" class="px-2"><img class="w-5" src="~assets/images/trust.svg"></div>
        </div>
        <div class="">
          <div class="h-2"></div>
          <button @click.prevent="toggleFavorite" class="flex-centred">
            <Icon :class="{'text-red-600': company.has_favorite}" :name="company.has_favorite ? 'filledHeart' :'heart'"
                  size-class="w-8"/>
            <span class="w-1"></span>
            <span class="text-sm underline">{{company.has_favorite ? $t('remove_from_favorite') : $t('add_to_favorite')}}</span>
          </button>
          <div class="h-2"></div>
          <div class="">
            <template v-if="company.average_rate > 0">
              <span class="flex items-center px-2">
                <span>{{company.average_rate}}</span>
                <Icon class="text-rate" name="filledStar"/>
                <span class="w-1"></span>
                <button @click="openRateModal" class="text-sm underline">{{$t('rate')}}</button>
              </span>
            </template>
            <template v-else>
              <button @click="openRateModal" class="text-sm underline">{{$t('be_first_rate')}}</button>
            </template>
          </div>

        </div>
        <div class="h-4"></div>
        <p class="text-sm text-gray-500 leading-6">
          {{company.about || '__'}}
        </p>
        <div class="flex flex-wrap py-2">
          <span :key="tag" class="bg-accent px-2  rounded mx-1" v-for="tag in company.tags">{{tag}}</span>
        </div>
      </div>
    </div>
    <div class="card mt-6">
      <div class="flex flex-wrap">
        <div class="w-full md:w-2/4 p-2">
          <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('contacts')}}</h3>
          <div class="h-8"></div>
          <div>
            <div class="flex text-primary">
              <icon :border="2" name="phone" size-class="w-6"/>
              <div class="w-2"></div>
              <div class="text-xl" dir="ltr">{{company.phone}}</div>
              <div class="py-1 px-2">
                <div class="h-full border-l border-accentSecondary"></div>
              </div>
              <div class="w-2"></div>
              <a :href="`tel:${company.phone}`" class="underline">{{$t('call')}}</a>
            </div>
            <template v-if="company.whatsapp">
              <div class="h-4"></div>
              <div class="flex">
                <icon name="whatsapp"/>
                <div class="w-2"></div>
                <div class="text-xl" dir="ltr">{{company.whatsapp}}</div>
                <div class="py-1 px-2">
                  <div class="h-full border-l border-accentSecondary"></div>
                </div>
                <div class="w-2"></div>
                <a :href="`https://wa.me/${company.whatsapp}`" class="underline" target="_blank">{{$t('messaging')}}</a>
              </div>
            </template>
            <template v-if="company.email">
              <div class="h-4"></div>
              <div class="flex items-center">
                <icon name="email" size-class="h-6 w-6"/>
                <div class="w-2"></div>
                <div class="text-xl" dir="ltr">{{company.email}}</div>
                <div class="py-1 px-2">
                  <div class="h-full border-l border-accentSecondary"></div>
                </div>
                <div class="w-2"></div>
                <a :href="`mailto:${company.email}`" class="underline" target="_blank">{{$t('messaging')}}</a>
              </div>
            </template>


          </div>
          <div class="h-8"></div>
          <div
            v-show="company.website || company.instagram ||company.twitter || company.facebook ||company.snapchat || company.linkedin">
            <h3 class="text-primary text-xl  font-bold mb-2">{{$t('social_media')}}</h3>
            <div class="flex p-2">
              <SocialIcon :url="company.website" icon="world"/>
              <SocialIcon :url="company.instagram" icon="instagram"/>
              <SocialIcon :url="company.twitter" icon="twitter"/>
              <SocialIcon :url="company.facebook" icon="facebook"/>
              <SocialIcon :url="company.snapchat" icon="snapchat"/>
              <SocialIcon :url="company.linkedin" icon="linkedin"/>
            </div>
          </div>
        </div>
        <div class="w-full md:w-2/4 p-2">

          <WorkTimes :days="company.work_times" :read-only="true"/>
        </div>
      </div>
    </div>


    <div class="card  mt-6" v-if="company.location">
      <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('location')}}</h3>
      <client-only>
        <CreateMap :read-only="true" v-model="company.location"/>
      </client-only>
    </div>
    <RateModal :company-id="company.id" :open="rateOpen" @close="closeRateModal"/>
  </div>
</template>

<script>
  import ImagePlaceholder from '../../components/ImagePlaceholder';
  import WorkTimes from '../../components/WorkTimes';
  import RateModal from '../../components/RateModal';
  import CreateMap from '../../components/CreateMap';
  import Icon from '../../components/Icon';
  import SocialIcon from '../../components/SocialIcon';
  import LLink from '../../components/l-link';

  export default {
    'name': 'CompanyShow',
    components: { LLink, SocialIcon, Icon, CreateMap, RateModal, WorkTimes, ImagePlaceholder },
    async asyncData(ctx) {
      let company = {};
      try {
        const { data } = await ctx.$axios.get(`company/${ctx.params.id}/show`);
        company = { ...data.data };
        if (data.data.location) {
          company = {
            ...company,
            location: { lat: parseFloat(data.data.location.lat), lng: parseFloat(data.data.location.lng) }
          };
        }

      } catch (e) {
        ctx.error({
          status: e.response?.status
        });
      }

      return {
        company
      };
    },
    data() {
      return {
        rateOpen: false,
        adsLoading: true
      };
    },
    head() {
      return this.metaBuilder(this.company.ar_name, this.company.about, this.company.image);
    },
    mounted() {
      this.adsLoading = false;
    },
    methods: {
      closeRateModal(value) {
        if (value != null) this.company.average_rate = value;
        this.rateOpen = false;
      },
      toggleFavorite() {
        if (this.checkAuth()) {
          this.$axios.post(`company/${this.company.id}/toggle-favorite`).then(({ data }) => {
            this.company.has_favorite = data.data;
            if (data.data) {
              this.$toast.success(this.$t('favorite_added')).goAway(1000);
            } else {
              this.$toast.success(this.$t('favorite_removed')).goAway(1000);
            }
          });
        }

      },
      openRateModal() {
        if (this.checkAuth()) {
          this.rateOpen = true;
        }
      }
    }
  };
</script>

<style scoped>

</style>
