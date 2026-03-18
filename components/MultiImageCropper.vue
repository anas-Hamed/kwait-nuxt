<template>
  <div>
    <div class="my-4 rounded-md bg-accent w-full py-8 flex flex-wrap p-2" :class="[(errors && errors['images']) ? 'border border-destructive' : '']">
      <div class="w-full md:w-2/6 flex items-center justify-center p-1">
        <template v-for="(src, index) in initialImages" :key="`Image___${index}`">
          <Cropper v-if="index === active" :index="index" :src="src" class="w-4/6 mx-auto"
                   :ratio="10/3" @cropped="setCroppedData" />
        </template>
        <div v-if="initialImages.length === 0" class="text-sm font-light text-center px-2">
          <ImageIcon :size="64" class="mx-auto text-muted-foreground mb-3" />
          <div>{{ $t('crop_slug') }}</div>
          <small class="text-muted-foreground">{{ $t('maximum_image_size') }}</small>
        </div>
      </div>

      <div class="w-full md:w-4/6 flex items-center justify-center flex-col p-1">
        <HorizontalSlider v-if="thumbs.length > 0">
          <div v-for="(img, index) in thumbs" :key="index" class="relative p-1 cursor-pointer h-24">
            <button type="button" class="absolute left-0 -top-2 rounded-full bg-destructive text-white w-6 h-6 flex items-center justify-center"
                    aria-label="Close" @click="dropImage(index)">
              <X :size="14" />
            </button>
            <img :id="index" class="w-full h-full object-cover rounded" :src="img" @click="active = index" />
          </div>
        </HorizontalSlider>
        <Button variant="secondary" class="my-2 mt-5 gap-1.5" @click.prevent="$refs.files.click()">
          <Upload :size="16" />
          <span>{{ thumbs.length === 0 ? $t('choose_images') : $t('add_images') }}</span>
        </Button>
      </div>
      <input id="files" ref="files" hidden accept="image/*" type="file" multiple name="files" @change="selectFiles">
    </div>

    <div v-if="currentImages.length" class="my-4 rounded-md bg-accent w-full p-4">
      <h3 class="text-primary text-xl font-bold mb-4">{{ $t('current_images') }}</h3>
      <HorizontalSlider v-if="currentImages.length > 0">
        <div v-for="(img, index) in currentImages" :key="index" class="relative p-1 h-24">
          <button type="button" class="absolute left-0 -top-2 rounded-full bg-destructive text-white w-6 h-6 flex items-center justify-center"
                  aria-label="Close" @click="dropCurrentImage(img.id)">
            <X :size="14" />
          </button>
          <img :id="index" class="w-full h-full object-cover rounded" :src="img.path" />
        </div>
      </HorizontalSlider>
      <div v-else class="h-16 flex items-center justify-center text-muted-foreground">
        {{ $t('empty_images') }}
      </div>
    </div>
  </div>
</template>

<script>
import { ImageIcon, X, Upload } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

export default {
  name: 'MultiImageCropper',
  components: { ImageIcon, X, Upload, Button },
  props: {
    currentImages: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      initialImages: [],
      images: [],
      thumbs: [],
      active: -1,
    }
  },
  watch: {
    images(newValue) {
      this.$emit('changed', newValue)
    },
  },
  methods: {
    selectFiles() {
      const files = this.$refs.files.files
      const self = this

      let count = Array.from(files).length - 1;
      (function myLoop() {
        const el = Array.from(files)[count]
        if (el.size < (1024 * 1024 * 3)) {
          setTimeout(function () {
            const reader = new FileReader()
            reader.onload = e => {
              self.thumbs.push(e.target.result)
              self.initialImages.push(e.target.result)
              self.active++
            }
            reader.readAsDataURL(el)
            if (--count >= 0) myLoop(count)
          }, 500)
        } else {
          self.$toast.error(self.$t('file_size_ignored'))
          if (--count >= 0) myLoop(count)
        }
      })()
      files.value = null
    },
    dropImage(index) {
      this.initialImages.splice(index, 1)
      this.thumbs.splice(index, 1)
      this.images.splice(index, 1)
      this.initialImages.splice(index, 1)
    },
    dropCurrentImage(id) {
      this.$emit('delete-image', id)
    },
    setCroppedData(data) {
      this.thumbs.splice(data.index, 1, data.thumb)
      this.images.splice(data.index, 1, data.image)
    },
  },
}
</script>
