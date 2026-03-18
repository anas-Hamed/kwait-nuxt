<script setup>
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Heart, Star, Phone, Mail } from 'lucide-vue-next'

const api = useApi()
const route = useRoute()

const { data: company } = await useAsyncData(`company-${route.params.id}`, async () => {
  const res = await api.get(`company/${route.params.id}/show`)
  const companyData = { ...res.data }
  if (res.data.location) {
    companyData.location = {
      lat: parseFloat(res.data.location.lat),
      lng: parseFloat(res.data.location.lng)
    }
  }
  return companyData
})
</script>

<template>
  <div class="max-w-screen-lg mx-auto">
    <Ads :ads="company?.images" :loading="adsLoading" attribute="path" class="mb-4" v-if="company?.images?.length > 0"/>
    <Card class="overflow-hidden relative">
      <div
        class="absolute bg-primary -translate-y-2/4 shadow-md border -left-16 top-16 py-3 w-64 text-center text-white transform -rotate-45 z-30">
        {{company?.category?.name}}
      </div>
      <CardContent class="flex flex-wrap px-0 p-0">
        <div class="w-72 mx-auto">
          <ImagePlaceholder :image="company?.image" :top="100" class="rounded-sm border"/>
        </div>
        <div class="flex-1 p-12">
          <div class="flex-1 flex justify-start items-center">
            <h2 class="text-3xl font-bold">{{$i18n.locale === 'ar' ? company?.ar_name : company?.en_name}}</h2>
            <div v-if="company?.is_trusted" class="px-2"><img class="w-5" src="~/assets/images/trust.svg"></div>
          </div>
          <div class="">
            <div class="h-2"></div>
            <Button variant="ghost" size="sm" @click.prevent="toggleFavorite" class="flex items-center justify-center px-0">
              <Heart :size="20" :class="{'text-red-600 fill-red-600': company?.has_favorite}" />
              <span class="w-1"></span>
              <span class="text-sm underline">{{company?.has_favorite ? $t('remove_from_favorite') : $t('add_to_favorite')}}</span>
            </Button>
            <div class="h-2"></div>
            <div class="">
              <template v-if="company?.average_rate > 0">
                <span class="flex items-center px-2">
                  <span>{{company.average_rate}}</span>
                  <Star :size="18" class="text-yellow-500 fill-yellow-500" />
                  <span class="w-1"></span>
                  <Button variant="link" size="sm" @click="openRateModal" class="text-sm underline p-0 h-auto">{{$t('rate')}}</Button>
                </span>
              </template>
              <template v-else>
                <Button variant="link" size="sm" @click="openRateModal" class="text-sm underline p-0 h-auto">{{$t('be_first_rate')}}</Button>
              </template>
            </div>
          </div>
          <div class="h-4"></div>
          <p class="text-sm text-muted-foreground leading-6">
            {{company?.about || '__'}}
          </p>
          <div class="flex flex-wrap py-2 gap-1">
            <Badge v-for="tag in company?.tags" :key="tag" variant="secondary">{{tag}}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card class="mt-6">
      <CardContent class="p-6">
        <div class="flex flex-wrap">
          <div class="w-full md:w-2/4 p-2">
            <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('contacts')}}</h3>
            <div class="h-8"></div>
            <div>
              <div class="flex text-primary items-center">
                <Phone :size="20" class="shrink-0" />
                <div class="w-2"></div>
                <div class="text-xl" dir="ltr">{{company?.phone}}</div>
                <Separator orientation="vertical" class="mx-2 h-6" />
                <a :href="`tel:${company?.phone}`" class="underline">{{$t('call')}}</a>
              </div>
              <template v-if="company?.whatsapp">
                <div class="h-4"></div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-green-600 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  <div class="w-2"></div>
                  <div class="text-xl" dir="ltr">{{company.whatsapp}}</div>
                  <Separator orientation="vertical" class="mx-2 h-6" />
                  <a :href="`https://wa.me/${company.whatsapp}`" class="underline" target="_blank">{{$t('messaging')}}</a>
                </div>
              </template>
              <template v-if="company?.email">
                <div class="h-4"></div>
                <div class="flex items-center">
                  <Mail :size="20" class="shrink-0" />
                  <div class="w-2"></div>
                  <div class="text-xl" dir="ltr">{{company.email}}</div>
                  <Separator orientation="vertical" class="mx-2 h-6" />
                  <a :href="`mailto:${company.email}`" class="underline" target="_blank">{{$t('messaging')}}</a>
                </div>
              </template>
            </div>
            <div class="h-8"></div>
            <div
              v-show="company?.website || company?.instagram || company?.twitter || company?.facebook || company?.snapchat || company?.linkedin">
              <h3 class="text-primary text-xl font-bold mb-2">{{$t('social_media')}}</h3>
              <div class="flex p-2">
                <SocialIcon :url="company?.website" icon="world"/>
                <SocialIcon :url="company?.instagram" icon="instagram"/>
                <SocialIcon :url="company?.twitter" icon="twitter"/>
                <SocialIcon :url="company?.facebook" icon="facebook"/>
                <SocialIcon :url="company?.snapchat" icon="snapchat"/>
                <SocialIcon :url="company?.linkedin" icon="linkedin"/>
              </div>
            </div>
          </div>
          <div class="w-full md:w-2/4 p-2">
            <WorkTimes :days="company?.work_times" :read-only="true"/>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="mt-6" v-if="company?.location">
      <CardContent class="p-6">
        <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('location')}}</h3>
        <client-only>
          <CreateMap :read-only="true" v-model="company.location"/>
        </client-only>
      </CardContent>
    </Card>
    <RateModal :company-id="company?.id" :open="rateOpen" @close="closeRateModal"/>
  </div>
</template>

<script>
export default {
  name: 'CompanyShow',
  data() {
    return {
      rateOpen: false,
      adsLoading: true
    };
  },
  head() {
    return this.metaBuilder(this.company?.ar_name, this.company?.about, this.company?.image);
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
        const api = useApi();
        api.post(`company/${this.company.id}/toggle-favorite`).then((data) => {
          this.company.has_favorite = data.data;
          if (data.data) {
            this.$toast.success(this.$t('favorite_added'));
          } else {
            this.$toast.success(this.$t('favorite_removed'));
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
