<template>
  <Dialog :open="open" @update:open="val => { if (!val) close(null) }">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle class="text-center">{{ $t('rate_company') }}</DialogTitle>
      </DialogHeader>
      <div class="flex justify-center gap-1 py-4">
        <button v-for="star in 5" :key="star" type="button" @click="rate = star"
                class="focus:outline-none transition-transform hover:scale-110">
          <Star :size="32"
                :class="star <= rate ? 'text-secondary fill-secondary' : 'text-muted-foreground'"
          />
        </button>
      </div>
      <DialogFooter class="justify-center">
        <Button @click="rateCompany" class="min-w-24">
          <LoadingCircle :loading="rating">
            {{ $t('rate') }}
          </LoadingCircle>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import { Star } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

export default {
  name: 'RateModal',
  components: { Star, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button },
  props: {
    open: { type: Boolean, default: false },
    companyId: { type: Number, required: true },
  },
  data() {
    return { rate: 1, rating: false }
  },
  methods: {
    rateCompany() {
      this.rating = true
      useApi().post('company/rate', {
        company_id: this.companyId,
        rate: this.rate,
      }).then(data => {
        this.close(data.data.data)
        this.$toast.success('Rating submitted successfully')
      }).catch(e => {
        this.$toast.error('Rating failed, please try again later')
      }).finally(() => {
        this.rating = false
      })
    },
    close(value = null) {
      this.$emit('close', value)
    },
  },
}
</script>
