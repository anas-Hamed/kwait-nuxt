<template>
  <LLink :to="!company.has_paid || !company.is_active ? {} : { name: 'company-id', params: { id: company.slug } }">
    <Card class="flex m-1 relative overflow-hidden transition-shadow hover:shadow-lg"
          :class="{ 'opacity-50': !company.has_paid || !company.is_active }">
      <div class="relative shrink-0">
        <ImagePlaceholder class="w-24 md:w-40 md:h-40 h-32" :image="company.image">
          <Badge class="absolute top-0 bg-primary text-secondary border-0 rounded-none text-xs px-3 py-1"
                 :class="[$i18n.locale === 'ar' ? 'right-0 rounded-bl-xl' : 'left-0 rounded-br-xl']">
            {{ company.category.name }}
          </Badge>
        </ImagePlaceholder>
      </div>
      <Separator orientation="vertical" class="my-3" />
      <CardContent class="flex-auto px-4 py-3 flex flex-col gap-1">
        <div class="flex items-center gap-1.5">
          <p class="text-lg font-bold truncate">{{ $i18n.locale === 'ar' ? company.ar_name : company.en_name }}</p>
          <img v-if="company.is_trusted" class="w-4 h-4" src="~assets/images/trust.svg" alt="trusted">
        </div>

        <p class="text-xs text-muted-foreground line-clamp-2 flex-auto">{{ about }}</p>

        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center gap-0.5 text-sm">
            <span class="font-medium">{{ company.average_rate }}</span>
            <Star :size="14" class="text-secondary fill-secondary" />
          </div>
          <client-only>
            <div v-if="!showControl" class="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" @click.prevent="callPhone">
                <Phone :size="18" />
              </Button>
              <Button variant="ghost" size="icon-sm" class="text-green-600" @click.prevent="chatWhatsapp">
                <span class="w-4 h-4" v-html="socialIcons.whatsapp" />
              </Button>
              <Button variant="ghost" size="icon-sm" @click.prevent="toggleFavorite"
                      :class="{ 'text-red-500': company.has_favorite }">
                <Heart :size="18" :fill="company.has_favorite ? 'currentColor' : 'none'" />
              </Button>
            </div>
            <div v-else class="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" class="text-destructive"
                      :disabled="!company.has_paid || !company.is_active"
                      @click.prevent="deleteCompany">
                <Trash2 :size="18" />
              </Button>
              <Button variant="ghost" size="icon-sm"
                      :disabled="!company.has_paid || !company.is_active"
                      @click.prevent="updateCompany">
                <Pencil :size="18" />
              </Button>
            </div>
          </client-only>
        </div>
      </CardContent>
    </Card>
  </LLink>
</template>

<script>
import { Star, Phone, Heart, Trash2, Pencil } from 'lucide-vue-next'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { socialIcons } from '~/helpers/SocialIcons'

export default {
  name: 'CompanyCard',
  components: { Star, Phone, Heart, Trash2, Pencil, Card, CardContent, Badge, Button, Separator },
  props: {
    company: { type: Object, required: true },
    showControl: { type: Boolean, required: false },
  },
  data() {
    return { socialIcons }
  },
  computed: {
    about() {
      if (this.company.about != null)
        return (this.company.about.length <= 85) ? this.company.about : this.company.about.slice(0, 85) + ' .....'
      return ''
    },
  },
  methods: {
    toggleFavorite() {
      if (this.checkAuth()) {
        useApi().post(`company/${this.company.id}/toggle-favorite`).then(({ data }) => {
          this.company.has_favorite = data.data
          if (!data.data) {
            useEventBus().emit('company-un-favorite', this.company.id)
          }
        })
      }
    },
    chatWhatsapp() {
      window.open(`https://wa.me/${this.company.whatsapp}`)
    },
    callPhone() {
      window.open(`tel:${this.company.phone}`)
    },
    deleteCompany() {
      const self = this
      this.$swal({
        title: self.$t('delete_confirm'),
        text: self.$t('delete_confirm_text'),
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: self.$t('yes'),
        cancelButtonText: self.$t('no'),
      }).then((result) => {
        if (result.value) {
          useApi().delete(`company/${self.company.id}`).then(data => {
            this.$swal({
              icon: 'success',
              text: self.$t('operation_success'),
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', self.$swal.stopTimer)
                toast.addEventListener('mouseleave', self.$swal.resumeTimer)
              },
            })
            useEventBus().emit('company-deleted', self.company.id)
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
                toast.addEventListener('mouseenter', self.$swal.stopTimer)
                toast.addEventListener('mouseleave', self.$swal.resumeTimer)
              },
            })
          })
        }
      })
    },
    updateCompany() {
      this.$router.push(this.localePath({ name: 'company-update-id', params: { id: this.company.id } }))
    },
  },
}
</script>
