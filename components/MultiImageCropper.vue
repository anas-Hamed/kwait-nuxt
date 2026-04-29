<template>
  <div class="mic">
    <!-- Counter + hint -->
    <div class="mic-head">
      <span class="mic-count">
        {{ thumbs.length }} / {{ MAX_IMAGES }}
      </span>
      <span class="mic-hint">{{ $t('images_counter_hint', { max: MAX_IMAGES }) }}</span>
    </div>

    <!-- Cropper — visible only when an image is being edited -->
    <Transition name="mic-fade">
      <div v-if="active >= 0 && initialImages[active]" class="mic-cropper-wrap">
        <div class="mic-cropper-head">
          <span class="mic-cropper-title">{{ $t('adjust_crop') }}</span>
          <button type="button" class="mic-cropper-close" @click.prevent="active = -1" :aria-label="$t('remove')">
            <X :size="14" />
          </button>
        </div>
        <Cropper
          :key="`cropper-${active}`"
          :index="active"
          :src="initialImages[active]"
          :ratio="10/3"
          class="mic-cropper"
          @cropped="setCroppedData"
        />
      </div>
    </Transition>

    <!-- Gallery grid -->
    <div class="mic-grid">
      <div
        v-for="(img, index) in thumbs"
        :key="`thumb-${index}`"
        class="mic-tile"
        :class="{ 'mic-tile--active': index === active }"
        @click.prevent="active = index"
      >
        <img :src="img" class="mic-tile-img" alt="" />
        <button
          type="button"
          class="mic-tile-remove"
          :aria-label="$t('remove')"
          @click.stop.prevent="dropImage(index)"
        >
          <X :size="13" />
        </button>
        <span v-if="index === 0" class="mic-tile-badge">1</span>
      </div>

      <!-- Add tile: only when under max -->
      <div
        v-if="thumbs.length < MAX_IMAGES"
        class="mic-add"
        :class="{ 'mic-add--dragging': isDragging }"
        role="button"
        tabindex="0"
        :aria-label="$t('drop_images_here')"
        @click.prevent="$refs.files.click()"
        @keydown.enter.prevent="$refs.files.click()"
        @keydown.space.prevent="$refs.files.click()"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <Upload :size="20" :stroke-width="1.6" class="mic-add-icon" />
        <span class="mic-add-label">{{ $t('drop_images_here') }}</span>
      </div>
    </div>

    <!-- Inline error / full banner when max reached -->
    <p v-if="limitError" class="mic-error">{{ limitError }}</p>

    <input id="files" ref="files" hidden accept="image/*" type="file" multiple name="files" @change="onFileInput" />

    <!-- Current (server-side) images section, for edit mode -->
    <div v-if="currentImages.length" class="mic-current">
      <h3 class="mic-current-title">{{ $t('current_images') }}</h3>
      <div class="mic-grid">
        <div
          v-for="(img, index) in currentImages"
          :key="`current-${index}`"
          class="mic-tile mic-tile--current"
        >
          <img :src="img.path" class="mic-tile-img" alt="" />
          <button
            type="button"
            class="mic-tile-remove"
            :aria-label="$t('remove')"
            @click.stop.prevent="dropCurrentImage(img.id)"
          >
            <X :size="13" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { X, Upload } from 'lucide-vue-next'

const MAX_IMAGES = 8
const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB

export default {
  name: 'MultiImageCropper',
  components: { X, Upload },
  props: {
    currentImages: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      MAX_IMAGES,
      initialImages: [],
      images: [],
      thumbs: [],
      active: -1,
      isDragging: false,
      limitError: '',
    }
  },
  watch: {
    images(newValue) {
      this.$emit('changed', newValue)
    },
  },
  methods: {
    onFileInput(e) {
      this.processFiles(e.target.files)
      if (this.$refs.files) this.$refs.files.value = ''
    },
    onDrop(e) {
      this.isDragging = false
      this.processFiles(e.dataTransfer?.files)
    },
    processFiles(fileList) {
      this.limitError = ''
      if (!fileList || fileList.length === 0) return

      const remaining = MAX_IMAGES - this.thumbs.length
      if (remaining <= 0) {
        this.limitError = this.$t('max_images_reached', { max: MAX_IMAGES })
        return
      }

      const files = Array.from(fileList).filter(f => f.type.startsWith('image/'))
      if (files.length === 0) {
        this.limitError = this.$t('invalid_image')
        return
      }

      const toAccept = files.slice(0, remaining)
      if (files.length > remaining) {
        this.limitError = this.$t('max_images_reached', { max: MAX_IMAGES })
      }

      toAccept.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          this.limitError = this.$t('file_size_ignored') || 'File too large'
          return
        }
        const reader = new FileReader()
        reader.onload = (ev) => {
          this.initialImages.push(ev.target.result)
          this.thumbs.push(ev.target.result)
          // Pre-populate images[] with the raw File blob so it's always
          // submit-safe even if the user skips the crop step. Cropper's
          // ready()/cropend callbacks will overwrite with cropped blob.
          this.images.push(file)
          this.active = this.thumbs.length - 1
        }
        reader.readAsDataURL(file)
      })
    },
    dropImage(index) {
      this.initialImages.splice(index, 1)
      this.thumbs.splice(index, 1)
      this.images.splice(index, 1)
      // Clamp active index
      if (this.active === index) {
        this.active = this.thumbs.length > 0 ? Math.max(0, index - 1) : -1
      } else if (this.active > index) {
        this.active -= 1
      }
      this.limitError = ''
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

<style scoped>
.mic {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Head: counter + hint ── */
.mic-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.mic-count {
  background: #F3ECFF;
  color: #362061;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}
.mic-hint {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 400;
}

/* ── Cropper panel ── */
.mic-cropper-wrap {
  background: #ffffff;
  border-radius: 1rem;
  padding: 0.75rem;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.06);
}
.mic-cropper-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem 0.6rem;
}
.mic-cropper-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}
.mic-cropper-close {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms ease-out;
}
.mic-cropper-close:hover {
  background: #e5e7eb;
  color: #111827;
}

.mic-cropper :deep(.img-wrapper) {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 10 / 3;
}

/* ── Gallery grid ── */
.mic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.6rem;
}

/* ── Image tile ── */
.mic-tile {
  position: relative;
  aspect-ratio: 10 / 7;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  cursor: pointer;
  transition: all 180ms ease-out;
  box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04);
}
.mic-tile:hover {
  box-shadow: 0 6px 16px rgba(17, 24, 39, 0.08);
  transform: translateY(-1px);
}
.mic-tile--active {
  outline: 2px solid #6B4DD1;
  outline-offset: 2px;
}
.mic-tile--current {
  cursor: default;
}
.mic-tile--current:hover {
  transform: none;
}

.mic-tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mic-tile-remove {
  position: absolute;
  top: 0.4rem;
  inset-inline-end: 0.4rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: rgba(17, 24, 39, 0.75);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: all 180ms ease-out;
  backdrop-filter: blur(2px);
}
.mic-tile:hover .mic-tile-remove,
.mic-tile-remove:focus-visible {
  opacity: 1;
}
.mic-tile-remove:hover {
  background: #ef4444;
}

.mic-tile-badge {
  position: absolute;
  top: 0.4rem;
  inset-inline-start: 0.4rem;
  background: #6B4DD1;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

/* ── Add tile (dropzone) ── */
.mic-add {
  aspect-ratio: 10 / 7;
  border: 1px dashed #e5e7eb;
  border-radius: 0.75rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem;
  cursor: pointer;
  text-align: center;
  outline: none;
  transition: border-color 180ms ease-out, background-color 180ms ease-out;
}
.mic-add:hover {
  border-color: #9ca3af;
}
.mic-add:hover .mic-add-icon,
.mic-add:hover .mic-add-label {
  color: #4b5563;
}
.mic-add:focus-visible {
  border-color: #6B4DD1;
  box-shadow: 0 0 0 3px rgba(107, 77, 209, 0.15);
}
.mic-add--dragging,
.mic-add--dragging:hover {
  border-color: #6B4DD1;
  background: #faf7ff;
}
.mic-add--dragging .mic-add-icon,
.mic-add--dragging .mic-add-label {
  color: #6B4DD1;
}
.mic-add-icon {
  color: #9ca3af;
  transition: color 180ms ease-out;
}
.mic-add-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.2;
  transition: color 180ms ease-out;
}

/* ── Error banner ── */
.mic-error {
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
  margin-top: -0.25rem;
}

/* ── Current images ── */
.mic-current {
  border-top: 1px dashed #e5e7eb;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.mic-current-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
}

/* ── Cropper transition ── */
.mic-fade-enter-active,
.mic-fade-leave-active {
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
.mic-fade-enter-from,
.mic-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
