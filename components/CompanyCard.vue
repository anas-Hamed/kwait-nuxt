<template>
  <LLink :to="!company.has_paid || !company.is_active ? {}:{name: 'company-id',params:{id: company.slug}}">
    <div class="bg-white rounded md:rounded-xl shadow  border flex m-1 relative overflow-hidden"
         :class="{'opacity-50': !company.has_paid || !company.is_active}">
      <div class="px-1 relative">
        <ImagePlaceholder class="w-24 md:w-40 md:h-40 h-32 rounded-0 " :image="company.image" >
          <div class="absolute  px-3 py-1  bg-primary text-secondary text-xs text-center"
               :class="[$i18n.locale === 'ar' ? 'right-0 rounded-bl-xl' : 'left-0 rounded-br-xl']">
            {{company.category.name}}
          </div>
        </ImagePlaceholder>
      </div>
      <div class="py-4 ">
        <div class="w-0 h-full border"></div>
      </div>
      <div class="flex-auto px-4 py-3 flex flex-col">
        <div class="flex-1 flex justify-start items-center">
          <p class="text-xl  font-bold  overflow-ellipsis overflow-hidden h-8 " >{{$i18n.locale === 'ar' ? company.ar_name : company.en_name}}</p>
          <div v-if="company.is_trusted" class="px-2"><img class="w-5" src="~assets/images/trust.svg"></div>
        </div>

        <p class="flex-auto text-xs text-gray-500 overflow-ellipsis overflow-hidden  h-8">{{about}} </p>
        <div class="text-xl flex-1 flex justify-between">
          <div class="flex items-center">
            <span>{{company.average_rate}}</span>
            <Icon class="text-rate" name="filledStar" />
          </div>
          <client-only>
            <div v-if="!showControl"
                 class="flex items-center justify-center h-full">

              <button class="transform transition duration-400 hover:-translate-y-1" @click.prevent="callPhone">
                <Icon class="transform transition duration-400 hover:-translate-y-1" name="phone" size-class="w-6" />
              </button>
              <div class="w-2"></div>
              <button class="transform transition duration-400 hover:-translate-y-1" @click.prevent="chatWhatsapp">
                <Icon class="transform transition duration-400 hover:-translate-y-1" name="whatsapp" size-class="w-4" />
              </button>
              <div class="w-2"></div>
              <button class="transform transition duration-400 hover:-translate-y-1" @click.prevent="toggleFavorite">
                <Icon :name=" company.has_favorite ? 'filledHeart' :'heart'" size-class="w-6"
                      :class="{'text-red-600': company.has_favorite}" />
              </button>
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <button :disabled="!company.has_paid || !company.is_active" class="transform transition duration-400 hover:-translate-y-1 text-red-700" @click.prevent="deleteCompany">
                <Icon class="transform transition duration-400 hover:-translate-y-1" name="trash" size-class="w-6" />
              </button>
              <div class="w-6"></div>
              <button :disabled="!company.has_paid || !company.is_active" class="transform transition duration-400 hover:-translate-y-1" @click.prevent="updateCompany">
                <Icon name="update" size-class="w-6" />
              </button>
            </div>
          </client-only>

        </div>
      </div>


    </div>
  </LLink>
</template>

<script>

  import ImagePlaceholder from './ImagePlaceholder';
  import Icon from './Icon';
  import LLink from './l-link';

  export default {
    name: 'CompanyCard',
    components: { LLink, Icon, ImagePlaceholder },
    props: {
      company: {
        type: Object,
        required: true
      },
      showControl: {
        type: Boolean,
        required: false
      },
    },
    computed: {
      about() {
        if (this.company.about != null)
          return (this.company.about.length <= 85) ? this.company.about : this.company.about.slice(0,85) + ' .....';
        return  '';
      }
    },
    methods: {
      toggleFavorite() {
        if (this.checkAuth()) {
          this.$axios.post(`company/${this.company.id}/toggle-favorite`).then(({ data }) => {
            // eslint-disable-next-line vue/no-mutating-props
            this.company.has_favorite = data.data;
            if (!data.data) {
              this.$nuxt.$emit('company-un-favorite', this.company.id);
            }
          });
        }

      },
      chatWhatsapp() {
        window.open(`https://wa.me/${this.company.whatsapp}`);
      },
      callPhone() {
        window.open(`tel:${this.company.phone}`);
      },
      deleteCompany() {
        const self = this;
        this.$swal({
          title: self.$t('delete_confirm'),
          text: self.$t('delete_confirm_text'),
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: self.$t('yes'),
          cancelButtonText: self.$t('no')
        }).then((result) => {
          if (result.value) {
            this.$axios.delete(`company/${self.company.id}`).then(data => {
              this.$swal({
                icon: 'success',
                text: self.$t('operation_success'),
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,

                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', self.$swal.stopTimer);
                  toast.addEventListener('mouseleave', self.$swal.resumeTimer);
                }
              });
              this.$nuxt.$emit('company-deleted', self.company.id);
            }).catch(e => {
              this.$swal({
                icon: 'error',
                text: self.$t('operation_failed'),
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', self.$swal.stopTimer);
                  toast.addEventListener('mouseleave', self.$swal.resumeTimer);
                }
              });
            });
          }
        });
      },
      updateCompany() {
        this.$router.push(this.localePath({ name: 'company-update-id', params: { id: this.company.id } }));
      }
    }
  };
</script>

<style scoped>

</style>
