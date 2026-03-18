<script setup>
import { Button } from '~/components/ui/button'
import { Check, ChevronLeft, ChevronRight, Upload, Phone, MessageCircle, Mail, Globe, Facebook, Twitter, Instagram, Linkedin, Camera, MapPin, Tag, Clock, Images, Navigation, FileCheck, ExternalLink } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'

definePageMeta({ middleware: ['sidebase-auth'] })

const api = useApi()

const { data: categories } = await useAsyncData('create-company-categories', async () => {
  const res = await api.get('category', { all: true, has_children: true })
  return res.data || []
})

const currentStep = ref(1)
const totalSteps = 4
const parent_id = ref(null)
const stepError = ref('')
const fieldErrors = reactive({})

function clearFieldErrors() {
  Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])
}

const parentsCategories = computed(() => {
  return (categories.value?.filter(el => el.parent_id == null) || []).map(el => ({ label: el.name, value: el.id }))
})

const childrenCategories = computed(() => {
  return parent_id.value
    ? (categories.value?.filter(el => el.parent_id === parent_id.value) || []).map(el => ({ label: el.name, value: el.id }))
    : []
})

const steps = computed(() => [
  { number: 1, label: 'base_info' },
  { number: 2, label: 'tags_and_work_times' },
  { number: 3, label: 'contacts' },
  { number: 4, label: 'images_and_location' },
])

// Shared form reactive object — used by both script setup and Options API
const form = reactive({
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
    { day: 7, start_time: '08:00', end_time: '16:00', active: false },
  ],
})

function validateStep(step) {
  clearFieldErrors()
  let valid = true

  if (step === 1) {
    if (!form.ar_name?.trim()) { fieldErrors.ar_name = t('field_required'); valid = false }
    if (!form.en_name?.trim()) { fieldErrors.en_name = t('field_required'); valid = false }
    if (!parent_id.value) { fieldErrors.parent_id = t('field_required'); valid = false }
    if (!form.category_id) { fieldErrors.category_id = t('field_required'); valid = false }
    if (!form.about?.trim()) { fieldErrors.about = t('field_required'); valid = false }
    else if (form.about.trim().length < 15) { fieldErrors.about = t('about_min_15'); valid = false }
  }

  if (step === 2) {
    // Work times: at least one active day
    if (!form.work_times.some(d => d.active)) { fieldErrors.work_times = t('field_required'); valid = false }
  }

  if (step === 3) {
    if (!form.phone?.trim()) { fieldErrors.phone = t('field_required'); valid = false }
    else if (!/^\d{4,16}$/.test(form.phone.trim())) { fieldErrors.phone = t('phone_digits'); valid = false }
    if (!form.whatsapp?.trim()) { fieldErrors.whatsapp = t('field_required'); valid = false }
    else if (!/^\d{4,16}$/.test(form.whatsapp.trim())) { fieldErrors.whatsapp = t('phone_digits'); valid = false }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { fieldErrors.email = t('invalid_email'); valid = false }
    if (form.website && !/^https?:\/\/.+/.test(form.website.trim())) { fieldErrors.website = t('invalid_url'); valid = false }
  }

  if (step === 4) {
    if (!form.accept_terms) { fieldErrors.accept_terms = t('field_required'); valid = false }
  }

  if (!valid) {
    stepError.value = t('please_fill_required')
  }
  return valid
}

function nextStep() {
  if (currentStep.value < totalSteps) {
    if (!validateStep(currentStep.value)) return
    stepError.value = ''
    currentStep.value++
  }
}

function prevStep() {
  stepError.value = ''
  clearFieldErrors()
  if (currentStep.value > 1) currentStep.value--
}

function goToStep(step) {
  if (step < currentStep.value) {
    stepError.value = ''
    currentStep.value = step
    return
  }
  for (let s = currentStep.value; s < step; s++) {
    if (!validateStep(s)) return
  }
  stepError.value = ''
  currentStep.value = step
}

// ── Data (moved from Options API) ──
const open = ref(false)
const loading = ref(false)
const tag = ref('')
const logo_image_init = ref('')
const logo_image = ref('')
const tags = ref([])
const all_days = reactive({ start_time: '08:00', end_time: '16:00' })
const images = ref([])
const logo_image_ref = ref(null)

// ── Watcher ──
watch(parent_id, () => {
  form.category_id = null
})

// ── Methods ──
const router = useRouter()
const validationStore = useValidationStore()
const { errors } = storeToRefs(validationStore)
const { setErrors } = validationStore
const localePath = useLocalePath()
const { t } = useI18n()

async function submit() {
  loading.value = true
  try {
    form.tags = tags.value.map(el => el.text)
    const formData = new FormData()
    images.value.forEach(el => { formData.append('images[]', el) })
    formData.append('image', logo_image.value)
    form.phones.forEach(el => { formData.append('phones[]', JSON.stringify(el)) })
    form.work_times.forEach(el => { formData.append('work_times[]', JSON.stringify(el)) })
    form.tags.forEach(el => { formData.append('tags[]', el) })
    if (form.location) formData.append('location', JSON.stringify(form.location))
    for (const key in form) {
      let value = form[key]
      if (typeof value === 'string' || typeof value === 'number') formData.append(key, value)
    }
    await api.post('company', formData)
    router.push(localePath({ name: 'profile' }))
    toast.success(t('operation_success'))
  } catch (e) {
    const response = e?.response?._data || e?.data
    const status = e?.response?.status || e?.statusCode
    if (status === 422) {
      setErrors(response?.errors)
      toast.error(t('entries_error'))
    } else if (status === 409) {
      toast.error(response?.message || 'Error')
    }
  } finally {
    loading.value = false
  }
}

function validateAndSubmit() {
  if (!validateStep(4)) return
  submit()
}

function setImages(imgs) { images.value = imgs }

function selectLogoImage() {
  const reader = new FileReader()
  reader.onload = e => { logo_image_init.value = e.target.result }
  reader.readAsDataURL(logo_image_ref.value.files[0])
}

function setLogoImage(cropped) { logo_image.value = cropped.image }

function setAllDays() {
  form.work_times.forEach(el => {
    el.start_time = all_days.start_time
    el.end_time = all_days.end_time
    el.active = true
  })
  open.value = false
}

</script>

<template>
  <div class="bg-white rounded-2xl shadow-soft p-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-primary">{{ $t('add_company') }}</h2>
      <p class="text-sm text-muted-foreground mt-1">{{ $t('fill_company_info') || 'Fill in your company information below' }}</p>
    </div>

    <!-- Step Indicator -->
    <div class="stepper-wrapper">
      <template v-for="(step, idx) in steps" :key="step.number">
        <!-- Step column: circle + label -->
        <div class="stepper-item cursor-pointer" @click="goToStep(step.number)">
          <div
            class="stepper-circle"
            :class="
              currentStep === step.number
                ? 'stepper-active'
                : step.number < currentStep
                  ? 'stepper-done'
                  : 'stepper-pending'
            "
          >
            <Check v-if="step.number < currentStep" :size="14" stroke-width="3" />
            <span v-else>{{ step.number }}</span>
          </div>
          <span
            class="stepper-label"
            :class="currentStep === step.number ? 'text-primary font-semibold' : 'text-muted-foreground'"
          >
            {{ $t(step.label) }}
          </span>
        </div>
        <!-- Connector -->
        <div
          v-if="idx < steps.length - 1"
          class="stepper-connector-wrap"
        >
          <div
            class="stepper-connector"
            :class="step.number < currentStep ? 'stepper-connector-done' : ''"
          />
        </div>
      </template>
    </div>

    <!-- Step 1: Basic Info -->
    <div v-show="currentStep === 1" class="step-content">
      <!-- Logo Upload -->
      <div class="section-block">
        <div class="section-header">
          <Upload :size="16" class="text-primary" />
          <span>{{ $t('logo') }}</span>
        </div>
        <div class="flex items-center gap-5">
          <Cropper v-if="logo_image_init" :index="0" :ratio="1" :src="logo_image_init" @cropped="setLogoImage" />
          <div v-else class="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground border-2 border-dashed border-border shrink-0">
            <Camera :size="24" class="text-muted-foreground/50" />
          </div>
          <div>
            <input @change="selectLogoImage" accept="image/*" hidden ref="logo_image_ref" type="file">
            <Button variant="outline" size="sm" class="rounded-xl" @click="logo_image_ref.click()">{{ $t('choose_image') }}</Button>
            <p class="text-xs text-muted-foreground mt-1.5">PNG, JPG (max 2MB)</p>
            <InputError name="image" />
          </div>
        </div>
      </div>

      <!-- Company Name -->
      <div class="section-block">
        <div class="section-header">
          <span>{{ $t('company') }} {{ $t('ar_name') }} & {{ $t('en_name') }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <MyInput :label="$t('ar_name')" :placeholder="$t('enter_arabic_name')" :required="true" error="ar_name" id="ar_name" v-model="form.ar_name" />
            <span v-if="fieldErrors.ar_name" class="text-xs text-destructive mt-1 block">{{ fieldErrors.ar_name }}</span>
          </div>
          <div>
            <MyInput :label="$t('en_name')" :placeholder="$t('enter_english_name')" :required="true" error="en_name" id="en_name" v-model="form.en_name" />
            <span v-if="fieldErrors.en_name" class="text-xs text-destructive mt-1 block">{{ fieldErrors.en_name }}</span>
          </div>
        </div>
      </div>

      <!-- Category -->
      <div class="section-block">
        <div class="section-header">
          <span>{{ $t('category') }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="parent_id" class="text-sm font-medium mb-1 block">{{ $t('main_category') }} <span class="text-destructive">*</span></label>
            <CategorySelect :options="parentsCategories" :placeholder="$t('choose_category')" v-model="parent_id" />
            <span v-if="fieldErrors.parent_id" class="text-xs text-destructive mt-1 block">{{ fieldErrors.parent_id }}</span>
          </div>
          <div>
            <label for="category_id" class="text-sm font-medium mb-1 block">{{ $t('category') }} <span class="text-destructive">*</span></label>
            <CategorySelect :options="childrenCategories" :placeholder="$t('choose_category')" v-model="form.category_id" />
            <InputError name="category_id" />
            <span v-if="fieldErrors.category_id" class="text-xs text-destructive mt-1 block">{{ fieldErrors.category_id }}</span>
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="section-block last">
        <div class="section-header">
          <span>{{ $t('about_company') }} <span class="text-destructive">*</span></span>
        </div>
        <textarea
          :class="[fieldErrors.about || (errors && errors['about']) ? 'border-destructive' : '']"
          :placeholder="$t('enter_some_words_about_company')"
          class="w-full bg-accent rounded-xl border border-input p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          id="about" rows="4" v-model="form.about"
        />
        <div class="flex justify-between items-center mt-1">
          <div>
            <InputError name="about" />
            <span v-if="fieldErrors.about" class="text-xs text-destructive">{{ fieldErrors.about }}</span>
          </div>
          <span class="text-xs text-muted-foreground">{{ form.about.trim().length }} / 15 {{ t('min') || 'min' }}</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Tags & Work Times -->
    <div v-show="currentStep === 2" class="step-content">
      <!-- Tags -->
      <div class="section-block">
        <div class="section-header">
          <Tag :size="16" class="text-primary" />
          <span>{{ $t('tags') }}</span>
        </div>
        <p class="text-xs text-muted-foreground mb-2">{{ $t('enter_about_20_tag') }}</p>
        <VueTagsInput
          :add-on-key="[13, ',']"
          :class="[(errors && errors['tags']) ? 'border border-destructive' : '']"
          :max-tags="20"
          :placeholder="$t('tags')"
          :tags="tags"
          @tags-changed="newTags => tags = newTags"
          class="w-full mx-0" id="tags" style="max-width: unset"
          v-model="tag"
        />
      </div>

      <!-- Work Times -->
      <div class="section-block last">
        <div class="section-header">
          <Clock :size="16" class="text-primary" />
          <span>{{ $t('work_times') }}</span>
          <span class="text-destructive text-xs">*</span>
          <Button variant="outline" size="sm" @click="open = true" class="rounded-lg text-xs ms-auto h-7 px-3">{{ $t('edit_all') }}</Button>
        </div>
        <WorkTimes :days="form.work_times" />
        <span v-if="fieldErrors.work_times" class="text-xs text-destructive mt-1 block">{{ fieldErrors.work_times }}</span>
        <Modal v-model="open">
          <div class="edit-all-modal">
            <div class="edit-all-header">
              <Clock :size="18" class="text-primary" />
              <div>
                <h4 class="text-sm font-bold text-primary">{{ $t('edit_all') }}</h4>
                <p class="text-xs text-muted-foreground mt-0.5">{{ $t('all_days') }}</p>
              </div>
            </div>

            <div class="edit-all-fields">
              <div class="edit-all-field">
                <label class="text-xs font-medium text-muted-foreground mb-1.5 block">{{ $t('from') }}</label>
                <TimePicker v-model="all_days.start_time" />
              </div>
              <div class="edit-all-field">
                <label class="text-xs font-medium text-muted-foreground mb-1.5 block">{{ $t('to') }}</label>
                <TimePicker v-model="all_days.end_time" />
              </div>
            </div>

            <div class="edit-all-actions">
              <Button class="rounded-xl flex-1" @click="setAllDays">{{ $t('accept') }}</Button>
              <Button variant="outline" class="rounded-xl flex-1" @click="open = false">{{ $t('cancel') }}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>

    <!-- Step 3: Contact & Social -->
    <div v-show="currentStep === 3" class="step-content">
      <!-- Primary Contact -->
      <div class="section-block">
        <div class="section-header">
          <Phone :size="16" class="text-primary" />
          <span>{{ $t('phone') }} & {{ $t('whatsapp') }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <MyInput input-dir="ltr" :label="$t('phone')" :required="true" error="phone" id="phone" placeholder="05xxxxxxxx" :model-value="form.phone" @update:model-value="form.phone = $event.replace(/\D/g, '')" maxlength="16" />
            <span v-if="fieldErrors.phone" class="text-xs text-destructive mt-1 block">{{ fieldErrors.phone }}</span>
          </div>
          <div>
            <MyInput input-dir="ltr" :label="$t('whatsapp')" :required="true" error="whatsapp" id="whatsapp" placeholder="05xxxxxxxx" :model-value="form.whatsapp" @update:model-value="form.whatsapp = $event.replace(/\D/g, '')" maxlength="16" />
            <span v-if="fieldErrors.whatsapp" class="text-xs text-destructive mt-1 block">{{ fieldErrors.whatsapp }}</span>
          </div>
        </div>
      </div>

      <!-- Email & Website -->
      <div class="section-block">
        <div class="section-header">
          <Globe :size="16" class="text-primary" />
          <span>{{ $t('email') }} & {{ $t('website') }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <MyInput :label="$t('email')" error="email" id="c-email" input-dir="ltr" placeholder="example@example.com" v-model="form.email" />
            <span v-if="fieldErrors.email" class="text-xs text-destructive mt-1 block">{{ fieldErrors.email }}</span>
          </div>
          <div>
            <MyInput :label="$t('website')" error="website" id="website" input-dir="ltr" placeholder="https://example.com" v-model="form.website" />
            <span v-if="fieldErrors.website" class="text-xs text-destructive mt-1 block">{{ fieldErrors.website }}</span>
          </div>
        </div>
      </div>

      <!-- Social Media -->
      <div class="section-block last">
        <div class="section-header">
          <Instagram :size="16" class="text-primary" />
          <span>{{ $t('social_media') || 'Social Media' }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MyInput :label="$t('facebook')" error="facebook" id="facebook" input-dir="ltr" placeholder="https://facebook.com/example" v-model="form.facebook" />
          <MyInput :label="$t('instagram')" error="instagram" id="instagram" input-dir="ltr" placeholder="https://instagram.com/example" v-model="form.instagram" />
          <MyInput :label="$t('twitter')" error="twitter" id="twitter" input-dir="ltr" placeholder="https://twitter.com/example" v-model="form.twitter" />
          <MyInput :label="$t('snapchat')" error="snapchat" id="snapchat" input-dir="ltr" placeholder="https://snapchat.com/example" v-model="form.snapchat" />
          <MyInput :label="$t('linkedin')" error="linkedin" id="linkedin" input-dir="ltr" placeholder="https://linkedin.com/example" v-model="form.linkedin" />
        </div>
      </div>
    </div>

    <!-- Step 4: Images, Location & Terms -->
    <div v-show="currentStep === 4" class="step-content">
      <!-- Gallery Images -->
      <div class="section-block">
        <div class="section-header">
          <Images :size="16" class="text-primary" />
          <span>{{ $t('images') || 'Gallery Images' }}</span>
        </div>
        <p class="text-xs text-muted-foreground mb-3">{{ $t('upload_gallery_hint') || 'Upload images to showcase your business. Max 3MB per image.' }}</p>
        <div class="s4-gallery-wrap">
          <MultiImageCropper @changed="setImages" />
        </div>
        <InputError name="images" />
      </div>

      <!-- Location -->
      <div class="section-block">
        <div class="section-header">
          <Navigation :size="16" class="text-primary" />
          <span>{{ $t('location') || 'Location' }}</span>
        </div>
        <p class="text-xs text-muted-foreground mb-3">{{ $t('location_hint') || 'Drag the pin to set your business location on the map.' }}</p>
        <div class="s4-map-wrap">
          <CreateMap v-model="form.location" />
        </div>
      </div>

      <!-- Terms & Conditions -->
      <div class="section-block last">
        <div class="section-header">
          <FileCheck :size="16" class="text-primary" />
          <span>{{ $t('terms') }}</span>
        </div>
        <div class="s4-terms-card" :class="fieldErrors.accept_terms ? 'border-destructive' : ''">
          <div class="s4-terms-inner">
            <input
              id="accept-terms"
              type="checkbox"
              :checked="form.accept_terms"
              @change="form.accept_terms = $event.target.checked"
              class="accent-primary w-4 h-4 shrink-0 mt-1 cursor-pointer rounded"
            />
            <label for="accept-terms" class="s4-terms-text cursor-pointer">
              {{ $t('i_am_approve_on') }}
              <LLink :to="{ name: 'terms' }" class="s4-terms-link" target="_blank">
                {{ $t('terms') }}
                <ExternalLink :size="11" class="inline-block ms-0.5 -mt-0.5" />
              </LLink>
              {{ $t('append_on_website') }}
            </label>
          </div>
          <span v-if="fieldErrors.accept_terms" class="text-xs text-destructive mt-2 block px-3 pb-2">{{ fieldErrors.accept_terms }}</span>
        </div>
      </div>
    </div>

    <!-- Validation Error -->
    <Transition name="fade">
      <div v-if="stepError" class="step-error">
        <span class="step-error-icon">!</span>
        <span>{{ $t('please_fill_required') || 'Please fill the required fields' }}: <strong>{{ stepError }}</strong></span>
      </div>
    </Transition>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between mt-8 pt-5 border-t border-border">
      <Button
        v-if="currentStep > 1"
        variant="outline"
        class="rounded-xl px-5 h-10 gap-2"
        @click="prevStep"
      >
        <ChevronLeft :size="16" />
        {{ $t('back') }}
      </Button>
      <div v-else />

      <div class="flex items-center gap-3">
        <span class="text-xs text-muted-foreground">{{ currentStep }} / {{ totalSteps }}</span>
        <Button
          v-if="currentStep < totalSteps"
          class="btn-gold border-0 rounded-xl px-6 h-10 gap-2 text-sm font-bold"
          @click="nextStep"
        >
          {{ $t('next') }}
          <ChevronRight :size="16" />
        </Button>

        <Button
          v-else
          @click="validateAndSubmit"
          class="rounded-xl px-6 h-10 gap-2 min-w-[130px]"
        >
          <LoadingCircle :loading="loading">{{ $t('save') }}</LoadingCircle>
        </Button>
      </div>
    </div>
  </div>
</template>


<style>
/* ── Stepper ── */
.stepper-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 30px;
  flex-shrink: 0;
}

.stepper-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.stepper-active {
  background: linear-gradient(135deg, #ffc909 0%, #f0b800 100%);
  color: #1b2c3b;
  box-shadow: 0 3px 12px rgba(255, 201, 9, 0.4);
}

.stepper-done {
  background: #1b2c3b;
  color: white;
}

.stepper-pending {
  background: #f1f3f5;
  color: #9ca3af;
  border: 2px solid #e5e7eb;
}

.stepper-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  text-align: center;
}

.stepper-connector-wrap {
  flex: 1;
  padding-top: 14px; /* half of 30px circle = center the line */
}

.stepper-connector {
  height: 2px;
  background: #e5e7eb;
  border-radius: 99px;
  margin: 0 10px;
  transition: background 0.3s ease;
}

.stepper-connector-done {
  background: #1b2c3b;
}

/* ── Step Content ── */
.step-content {
  /* container for sections */
}

.section-block {
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.section-block.last {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1b2c3b;
  margin-bottom: 0.875rem;
}

@media (max-width: 480px) {
  .stepper-label {
    font-size: 0.625rem;
  }
  .stepper-circle {
    width: 30px;
    height: 30px;
    font-size: 0.75rem;
  }
  .stepper-connector-wrap {
    padding-top: 14px;
  }
  .stepper-connector {
    margin: 0 6px;
  }
}

/* ── Edit All Modal ── */
.edit-all-modal {
  padding: 0.25rem;
}

.edit-all-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.edit-all-fields {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.edit-all-field {
  flex: 1;
}

.edit-all-time-input {
  width: 100%;
  height: 2.75rem;
  padding: 0 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #f8f9fa;
  font-size: 1rem;
  font-weight: 600;
  color: #1b2c3b;
  text-align: center;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.edit-all-time-input:focus {
  border-color: #1b2c3b;
  box-shadow: 0 0 0 2px rgba(27, 44, 59, 0.1);
}

.edit-all-actions {
  display: flex;
  gap: 0.75rem;
}

/* ── Step 4: Gallery ── */
.s4-gallery-wrap {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.s4-gallery-wrap .bg-accent {
  margin: 0 !important;
  border-radius: 0 !important;
  border: none !important;
  background: #fafbfc !important;
}

/* ── Step 4: Map ── */
.s4-map-wrap {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* Force the map to have rounded corners and better height */
.s4-map-wrap .text-center {
  text-align: center;
  position: relative;
}

.s4-map-wrap .vue-map-container,
.s4-map-wrap [style*="height: 300px"] {
  height: 280px !important;
  border-radius: 0 !important;
}

/* Style the "Add/Remove my location" button */
.s4-map-wrap .text-blue-500 {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  margin: 0;
  background: #1b2c3b;
  color: white;
  border: none;
  border-top: 1px solid #e5e7eb;
  border-radius: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  width: 100%;
  justify-content: center;
  transition: background 0.15s;
  cursor: pointer;
}

.s4-map-wrap .text-blue-500:hover {
  background: #263d4f;
}

/* Remove default margin from map parent */
.s4-map-wrap .my-3 {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* ── Step 4: Terms ── */
.s4-terms-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.s4-terms-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.s4-terms-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

.s4-terms-link {
  color: #1b2c3b;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1.5px solid #ffc909;
  transition: border-color 0.15s;
}

.s4-terms-link:hover {
  border-color: #1b2c3b;
}

/* ── Validation Error ── */
.step-error {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  color: #991b1b;
  line-height: 1.4;
}

.step-error-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dc2626;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
