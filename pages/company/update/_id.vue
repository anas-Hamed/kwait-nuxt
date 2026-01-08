<template>
  <div>
    <h3 class="text-primary text-4xl mb-4 font-bold">{{$t('update_company')}}</h3>
    <div class="card">
      <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('base_info')}}</h3>
      <div class="px-2  md:px-12">
        <Cropper :index="0" :ratio="1" :src="logo_image_init" @cropped="setLogoImage" class="mb-2"
                 v-if="logo_image_init" />
        <div class="rounded w-32 h-32 mb-2 bg-accent flex-centred" v-else>{{$t('logo')}}</div>
        <input @change="selectLogoImage" accept="image/*" hidden ref="logo_image" type="file">
        <button @click="$refs.logo_image.click()" class="px-3 py-1 bg-secondary w-32 ">{{$t('choose_image')}}</button>

        <InputError name="image" />
      </div>
      <div class="flex flex-wrap px-2  md:px-12">
        <div class="w-full lg:w-3/6 p-3">
          <MyInput :label="$t('ar_name')" error="ar_name" id="ar_name" v-model="form.ar_name" :required="true"/>
          <MyInput :label="$t('en_name')" error="en_name" id="en_name" v-model="form.en_name" :required="true"/>
          <div class="flex flex-wrap mb-3">
            <div class="w-full md:w-1/2">
              <label for="parent_id">{{$t('main_category')}}</label>
              <div class="flex flex-wrap">
                <v-select :options="parentsCategories" :placeholder="$t('choose_category')" :reduce="item => item.id" class="group flex-auto mt-1" disabled=""
                          id="parent_id" label="name"
                          v-model="parent_id" />
                <div class="w-1"></div>
              </div>
            </div>
            <div class="w-full md:w-1/2">
              <label for="category_id">{{$t('category')}}<span  class="required"></span></label>
              <div class="flex">
                <div class="w-1"></div>
                <v-select :options="childrenCategories" :placeholder="$t('choose_category')" :reduce="item => item.id" class="group flex-auto mt-1"
                          id="category_id" label="name"
                          v-model="form.category_id" />
              </div>
              <InputError name="category_id" />
            </div>
          </div>
          <div class="mb-3">
            <label for="about">{{$t('about_company')}}</label>
            <textarea class="w-full bg-accent rounded focus:outline-own p-2 mt-1" id="about" rows="4"
                      v-model="form.about"></textarea>
            <InputError name="about" />
          </div>
        </div>
        <div class="w-full lg:w-3/6 p-3">

          <div class="mb-2">
            <label for="tags">{{$t('tags')}}</label>
            <VueTagsInput :add-on-key="[13,',']" :max-tags="20" :tags="tags" @tags-changed="newTags => tags = newTags" class="w-full mx-0 mt-1"
                          id="tags" placeholder="" style="max-width: unset"
                          v-model="tag" />
          </div>
          <div>
            <div class="flex justify-between pb-1">
              <h3 class="  ">{{$t('work_times')}}</h3>
              <button @click="open = true" class="text-sm text-blue-500">{{$t('edit_all')}}</button>

            </div>
            <WorkTimes :days="form.work_times" />
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
          <Phone :label="$t('phone')" error="phone" id="phone" input-dir="ltr" v-model="form.phone" :required="true" />
        </div>
        <div class="w-full md:w-2/6 p-3">
          <Phone :label="$t('whatsapp')" error="whatsapp" id="whatsapp" input-dir="ltr"
                 v-model="form.whatsapp" />
        </div>
        <div class="w-full py-4 border-b"></div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('email')" error="email" id="email" input-dir="ltr" v-model="form.email" />
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('website')" error="website" id="website" input-dir="ltr" v-model="form.website" />
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('facebook')" error="facebook" id="facebook" input-dir="ltr" v-model="form.facebook" />
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('twitter')" error="twitter" id="twitter" input-dir="ltr" v-model="form.twitter" />
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('snapchat')" error="snapchat" id="snapchat" input-dir="ltr" v-model="form.snapchat" />
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('instagram')" error="instagram" id="instagram" input-dir="ltr" v-model="form.instagram" />
        </div>
        <div class="w-full md:w-2/6 p-3">
          <MyInput :label="$t('linkedin')" error="linkedin" id="linkedin" input-dir="ltr" v-model="form.linkedin" />
        </div>
      </div>
    </div>
    <div class="card mt-2">
      <h3 class="text-primary text-xl mb-4 font-bold mb-2">{{$t('images_and_location')}}</h3>

      <MultiImageCropper :current-images="current_images" @changed="setImages" @delete-image="deleteImage" />
      <InputError name="images" />
      <CreateMap v-model="form.location" />
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
  import Modal from '../../../components/Modal';
  import Phone from '../../../components/Phone';
  import 'vue-select/dist/vue-select.css';
  import MyInput from '~/components/MyInput';
  import InputError from '~/components/InputError';
  import WorkTimes from '~/components/WorkTimes';
  import MultiImageCropper from '~/components/MultiImageCropper';
  import CreateMap from '~/components/CreateMap';
  import LoadingCircle from '~/components/loading-circle';
  import Cropper from '~/components/Cropper';

  export default {
    name: 'CompanyUpdate',
    components: {
      Phone,
      Modal,
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
      let company = {};
      try {
        const { data } = await ctx.$axios.get(`company/${ctx.params.id}`);
        company = data.data;
      } catch (e) {
        ctx.error({
          status: e.response.status
        });
      }
      if (company.user_id !== ctx.$auth.user.id) {
        ctx.error({
          status: 403,
          message: 'Permission Denied'
        });
      }
      return { categories, company };
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
        form: {
          accept_terms: true,
          ar_name: '',
          en_name: '',
          email: '',
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
          work_times: [],
          images_to_delete: []
        },
        parent_id: null,
        images: [],
        current_images: []
      };
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
    beforeMount() {
      this.setCategoryIds();
      this.setStringNumberKeys();
      this.logo_image_init = this.company.image;
      if (this.company.location) {
        this.form.location = this.company.location;
      }
      if (this.company.tags) {
        this.tags = this.company.tags.map(el => {
          return { text: el, tiClasses: ['ti-valid'] };
        });

      }

      this.form.work_times = this.company.work_times.map(el => {
        return { id: el.id,day: el.day, start_time: el.start_time, end_time: el.end_time, active: el.active };
      });
      this.current_images = [...this.company.images];

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
          if (typeof (this.logo_image) == 'object') {
            formData.append('image', this.logo_image);
          }

          this.form.phones.forEach(el => {
            formData.append('phones[]', el);
          });
          this.form.work_times.forEach(el => {
            formData.append('work_times[]', JSON.stringify(el));
          });
          this.form.tags.forEach(el => {
            formData.append('tags[]', el);
          });
          this.form.images_to_delete.forEach(el => {
            formData.append('images_to_delete[]', el);
          });
          formData.append('location', JSON.stringify(this.form.location));
          for (const key in this.form) {
            const value = this.form[key];
            if (typeof value === 'string' || typeof value === 'number') formData.append(key, value);
          }
          await this.$axios.post(`company/update/${this.company.id}`, formData);
          this.$router.push(this.localePath({ name: 'profile' }));
          this.$toast.success(this.$t('operation_success')).goAway(1000);
          this.$toast.success(this.$t('some_updates_wont_appear')).goAway(3000);

        } catch ({ response }) {
          if (response.status === 422) {
            this.setErrors(response.data.errors);
            this.$toast.error(this.$t('entries_error')).goAway(1000);
          } else if (response.status === 409) {
            this.$swal({
              icon: 'error',
              title: 'خطأ',
              text: response.data.message,
              showConfirmButton: false,
              timer: 3000
            });
          } else {
            this.$toast.error(this.$t('server_error')).goAway(3000);
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
      deleteImage(id) {
        this.current_images.splice(this.current_images.findIndex(el => el.id === id), 1);
        this.form.images_to_delete.push(id);
      },
      setCategoryIds() {
        const category = this.categories.find(el => el.id === this.company.category_id);
        this.parent_id = category.parent_id;
        setTimeout(() => {
          this.form.category_id = category.id;
        }, 100);
      },
      setStringNumberKeys() {
        for (const key in this.company) {
          const value = this.company[key];
          if ((typeof value === 'string' || typeof value === 'number') && key !== 'image') this.form[key] = value;
        }
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
