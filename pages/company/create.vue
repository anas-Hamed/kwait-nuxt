<template>
  <div>
    <h3 class="text-primary text-4xl mb-4 font-bold">{{$t('add_company')}}</h3>
    <div class="card">
      <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('base_info')}}</h3>
      <div class="px-2 md:px-12">
        <Cropper :index="0" :ratio="1" :src="logo_image_init" @cropped="setLogoImage" class="mb-2"
                 v-if="logo_image_init"/>
        <div class="rounded w-32 h-32 mb-2 bg-accent flex-centred" v-else>{{$t('logo')}}</div>
        <input @change="selectLogoImage" accept="image/*" hidden ref="logo_image" type="file">
        <button @click="$refs.logo_image.click()" class="px-3 py-1 bg-secondary w-32 ">{{$t('choose_image')}}</button>

        <InputError name="image"/>
      </div>
      <div class="flex flex-wrap px-2 md:px-12">
        <div class="w-full lg:w-3/6 p-3">
          <MyInput :label="$t('ar_name')" :placeholder="$t('enter_arabic_name')" :required="true" error="ar_name" id="ar_name"
                   v-model="form.ar_name"/>
          <MyInput :label="$t('en_name')" :placeholder="$t('enter_english_name')" :required="true" error="en_name" id="en_name"
                   v-model="form.en_name"/>
          <div class="flex flex-wrap mb-3">
            <div class="w-full md:w-1/2">
              <label for="parent_id">{{$t('main_category')}}<span class="required"></span></label>
              <div class="flex">
                <v-select :options="parentsCategories" :placeholder="$t('choose_category')" :reduce="item => item.id" class="group flex-auto mt-1"
                          id="parent_id" label="name"
                          v-model="parent_id"/>
                <div class="w-1"></div>
              </div>
            </div>
            <div class="w-full md:w-1/2">
              <label for="category_id">{{$t('category')}}<span class="required"></span></label>
              <div class="flex">
                <div class="w-1"></div>
                <v-select :class="[(errors && errors['category_id']) ?'border-error' : '']" :options="childrenCategories" :placeholder="$t('choose_category')" :reduce="item => item.id"
                          class="group flex-auto mt-1" id="category_id"
                          label="name"
                          v-model="form.category_id"/>
              </div>
              <InputError name="category_id"/>
            </div>
          </div>
          <div class="mb-3">
            <label for="about">{{$t('about_company')}}</label>
            <textarea :class="[(errors && errors['about']) ?'border-error' : '']" :placeholder="$t('enter_some_words_about_company')" class="w-full bg-accent rounded focus:outline-own p-2 mt-1"
                      id="about"
                      rows="4" v-model="form.about"></textarea>
            <InputError name="about"/>
          </div>
        </div>
        <div class="w-full lg:w-3/6 p-3">

          <div class="mb-4">
            <label for="tags">{{$t('tags')}}</label>
            <VueTagsInput :add-on-key="[13,',']" :class="[(errors && errors['tags']) ?'border-error' : '']" :max-tags="20" :placeholder="$t('enter_about_20_tag')" :tags="tags"
                          @tags-changed="newTags => tags = newTags"
                          class="w-full mx-0 mt-1" id="tags" style="max-width: unset"
                          v-model="tag"/>
          </div>
          <div>
            <div class="flex justify-between pb-1">
              <h3 class="  ">{{$t('work_times')}}<span class="required"></span></h3>
              <button @click="open = true" class="text-sm text-blue-500">{{$t('edit_all')}}</button>

            </div>
            <WorkTimes :days="form.work_times"/>
            <Modal v-model="open">

              <div class="flex mb-1 shadow-md">
                <div :class="[$i18n.locale === 'ar' ? 'rounded-tr rounded-br' : 'rounded-tl rounded-bl']"
                     class="w-24 bg-secondary text-center   py-1">
                  {{$t(`all_days`)}}
                </div>
                <div class="flex-auto bg-white flex justify-evenly py-1 ">
                  <label :for="`day-start-all-days`" class="px-2">
                    <span>{{$t('from')}}</span>
                    <input :id="`day-start-all-days`" class="focus:outline-none" type="time"
                           v-model="all_days.start_time">
                  </label>
                  <div class="w-1 border-l"></div>
                  <label :for="`day-end-all-days`" class="px-2">
                    <span>{{$t('to')}}</span>
                    <input :id="`day-end-all-days`" class="focus:outline-none" type="time" v-model="all_days.end_time">
                  </label>
                </div>
              </div>
              <div class="text-center p-3 flex justify-start">
                <button @click="setAllDays" class="bg-primary text-white p-2 rounded">{{$t('accept')}}</button>
                <div class="w-2"></div>
                <button @click="open = false" class="bg-accent p-2 rounded">{{$t('cancel')}}</button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-2">
      <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('contacts')}}</h3>
      <div class="flex flex-wrap px-2 md:px-12">
        <div class="w-full md:w-2/6 p-3">
          <MyInput  input-dir="ltr" :label="$t('phone')"  :required="true" error="phone" id="phone" placeholder="05xxxxxxxx"
                   v-model="form.phone"/>

        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput  input-dir="ltr" :label="$t('whatsapp')"  :required="true" error="whatsapp" id="whatsapp" placeholder="05xxxxxxxx"
                    v-model="form.whatsapp"/>
        </div>
        <div class="w-full py-4 border-b"></div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('email')" error="email" id="email" input-dir="ltr" placeholder="example@example.com"
                   v-model="form.email"/>
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('website')" error="website" id="website" input-dir="ltr"
                   placeholder="https://example.com" v-model="form.website"/>
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('facebook')" error="facebook" id="facebook" input-dir="ltr"
                   placeholder="https://facebook.com/example" v-model="form.facebook"/>
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('twitter')" error="twitter" id="twitter" input-dir="ltr"
                   placeholder="https://twitter.com/example" v-model="form.twitter"/>
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('snapchat')" error="snapchat" id="snapchat" input-dir="ltr"
                   placeholder="https://snapchat.com/example" v-model="form.snapchat"/>
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('instagram')" error="instagram" id="instagram" input-dir="ltr"
                   placeholder="https://instagram.com/example" v-model="form.instagram"/>
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('linkedin')" error="linkedin" id="linkedin" input-dir="ltr"
                   placeholder="https://linkedin.com/example" v-model="form.linkedin"/>
        </div>
      </div>
    </div>
    <div class="card mt-2">
      <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('images_and_location')}}</h3>

      <MultiImageCropper @changed="setImages"/>
      <InputError name="images"/>
      <CreateMap v-model="form.location"/>
    </div>
    <div class="card my-2">
      <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('terms')}}</h3>
      <label for="accept-terms">
        <input id="accept-terms" type="checkbox" v-model="form.accept_terms">
        <span class="px-2">{{$t('i_am_approve_on')}} <LLink :to="{name: 'terms'}" class="text-blue-400" target="_blank">{{$t('terms')}}</LLink> {{$t('append_on_website')}}</span>

      </label>
    </div>
    <div class="text-center py-8">
      <button :class="{'opacity-50':!form.accept_terms}" :disabled="!form.accept_terms"
              @click="submit" class="bg-primary text-white py-2 px-8 w-full max-w-screen-sm rounded">
        <LoadingCircle :loading="loading">
          {{$t('save')}}
        </LoadingCircle>
      </button>
    </div>
  </div>
</template>

<script>
  import vSelect from 'vue-select';
  import Phone from '../../components/Phone';
  import Modal from '../../components/Modal';
  import LLink from '~/components/l-link';
  import 'vue-select/dist/vue-select.css';
  import MyInput from '~/components/MyInput';
  import InputError from '~/components/InputError';
  import WorkTimes from '~/components/WorkTimes';
  import MultiImageCropper from '~/components/MultiImageCropper';
  import CreateMap from '~/components/CreateMap';
  import LoadingCircle from '~/components/loading-circle';
  import Cropper from '~/components/Cropper';

  export default {
    name: 'CompanyCreate',
    components: {
      Phone,
      Modal,
      LLink,
      Cropper,
      LoadingCircle,
      CreateMap,
      MultiImageCropper,
      WorkTimes,
      InputError,
      MyInput,
      vSelect
    },
    middleware: 'auth',
    async asyncData(ctx) {
      let categories = [];
      try {
        const { data } = (await ctx.$axios.get(`category?all=true&has_children=true`)).data;
        categories = data;
      } catch ({ response }) {
        ctx.error({
          statusCode: response?.status,
          message: response?.message
        });
      }
      return { categories };
    },
    data() {
      return {
        open: false,
        loading: false,
        tag: '',
        logo_image_init: '',
        logo_image: '',
        tags: [],
        all_days: { start_time: '08:00', end_time: '16:00' },
        location: { lat: 29.3, lng: 47.6 },
        form: {
          accept_terms: false,
          ar_name: '',
          en_name: '',
          email: '',
          phone: '',
          whatsapp: '',
          about: '',
          category_id: '',
          phones: [],
          tags: [],
          website: '',
          facebook: '',
          instagram: '',
          twitter: '',
          snapchat: '',
          linkedin: '',
          location: null,
          work_times: [
            { day: 1, start_time: '08:00', end_time: '16:00', active: true },
            { day: 2, start_time: '08:00', end_time: '16:00', active: true },
            { day: 3, start_time: '08:00', end_time: '16:00', active: true },
            { day: 4, start_time: '08:00', end_time: '16:00', active: true },
            { day: 5, start_time: '08:00', end_time: '16:00', active: true },
            { day: 6, start_time: '08:00', end_time: '16:00', active: true },
            { day: 7, start_time: '08:00', end_time: '16:00', active: false }
          ]
        },
        parent_id: null,
        images: []
      };
    },
    head() {
      return this.metaBuilder(this.$t('create_company'));
    },
    computed: {
      parentsCategories() {
        return this.categories.filter(el => el.parent_id == null);
      },
      childrenCategories() {
        return this.parent_id ? this.categories.filter(el => el.parent_id === this.parent_id) : [];
      }
    },
    watch: {
      parent_id() {
        this.form.category_id = null;
      }
    },
    mounted() {

    },
    methods: {
      async submit() {
        this.loading = true;
        try {
          this.form.tags = this.tags.map(el => el.text);
          const formData = new FormData();
          this.images.forEach(el => {
            formData.append('images[]', el);
          });
          formData.append('image', this.logo_image);
          this.form.phones.forEach(el => {
            formData.append('phones[]', JSON.stringify(el));
          });
          this.form.work_times.forEach(el => {
            formData.append('work_times[]', JSON.stringify(el));
          });
          this.form.tags.forEach(el => {
            formData.append('tags[]', el);
          });
          if (this.form.location) {
            formData.append('location', JSON.stringify(this.form.location));
          }

          for (const key in this.form) {
            let value = this.form[key];
            if (typeof value === 'string' || typeof value === 'number') formData.append(key, value);
          }
          await this.$axios.post('company', formData);
          this.$router.push(this.localePath({ name: 'profile' }));
          this.$toast.success(this.$t('operation_success')).goAway(3000);

        } catch ({ response }) {
          if (response.status === 422) {
            this.setErrors(response.data.errors);
            this.$toast.error(this.$t('entries_error')).goAway(3000);
            for (const k in response.data.errors) {
              this.$toast.error(this.$t(response.data.errors[k].join('\n'))).goAway(3000);
            }
          } else if (response.status === 409) {
            this.$swal({
              icon: 'error',
              title: 'خطأ',
              text: response.data.message,
              showConfirmButton: false,
              timer: 3000
            });
          }
        } finally {
          this.loading = false;
        }
      },
      setImages(images) {
        this.images = images;
      },
      selectLogoImage(v) {
        const self = this;
        const reader = new FileReader();
        reader.onload = e => {
          self.logo_image_init = (e.target.result);
        };
        reader.readAsDataURL(this.$refs.logo_image.files[0]);
      },
      setLogoImage(cropped) {
        this.logo_image = cropped.image;
      },
      setAllDays() {
        this.form.work_times.forEach(el => {
          el.start_time = this.all_days.start_time;
          el.end_time = this.all_days.end_time;
          el.active = true;
          this.open = false;
        });
      }
    }
  };
</script>

<style>
  .v-select {
    @apply bg-accent cursor-pointer ;
  }

  .vs__selected-options {
    @apply p-1 cursor-pointer ;
  }

  .vs__dropdown-toggle {
    @apply border-0 cursor-pointer ;
  }
</style>
