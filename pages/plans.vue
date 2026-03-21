<script setup>
import { CreditCard, Crown, ChevronDown, ChevronUp, HelpCircle } from 'lucide-vue-next'
import { Skeleton } from '~/components/ui/skeleton'

const api = useApi()

const { data: plans, pending } = await useAsyncData('plans', async () => {
  const res = await api.get('plan')
  return res.data || []
})

const expandedPlans = ref({})

function isFree(price) {
  return parseFloat(price) === 0
}

function toggleExpand(id) {
  expandedPlans.value[id] = !expandedPlans.value[id]
}

const openFaq = ref(null)

function toggleFaq(index) {
  openFaq.value = openFaq.value === index ? null : index
}

const faqItems = ['faq_q1', 'faq_q2', 'faq_q3', 'faq_q4']
</script>

<template>
  <div>
    <!-- Hero with bottom notch -->
    <section class="co-hero-wrap">
      <svg width="0" height="0" class="absolute">
        <defs>
          <clipPath id="plHeroClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.720,1 Q 0.690,1 0.670,0.850 Q 0.650,0.650 0.620,0.650 L 0.380,0.650 Q 0.350,0.650 0.330,0.850 Q 0.310,1 0.280,1 L 0,1 Z" />
          </clipPath>
          <clipPath id="plHeroClipMobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.920,1 Q 0.870,1 0.840,0.850 Q 0.810,0.680 0.770,0.680 L 0.230,0.680 Q 0.190,0.680 0.160,0.850 Q 0.130,1 0.080,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div class="co-hero-section pl-hero-clip">
        <div class="hero-corner-tl"></div>
        <div class="hero-corner-br"></div>

        <div class="co-hero-inner">
          <h1 class="font-cairo text-white text-2xl sm:text-3xl font-bold">
            {{ $t('plans') }}
          </h1>
          <p class="text-white/50 text-[11px] sm:text-sm mt-1.5">{{ $t('plans_subtitle') }}</p>
        </div>
      </div>

      <!-- Logo in the notch -->
      <div class="au-notch-logo-wrap">
        <img src="~/assets/images/logo-notch.png" alt="Logo" class="au-notch-logo" />
      </div>
    </section>

    <!-- Plans Section -->
    <div class="pl-section">
      <!-- Skeleton Loading -->
      <div v-if="pending" class="pl-grid">
        <div v-for="n in 3" :key="`sk-${n}`" class="pl-sk-card">
          <Skeleton class="h-5 w-20 rounded" />
          <Skeleton class="h-3 w-28 rounded mt-2" />
          <Skeleton class="h-10 w-24 rounded mt-5" />
          <Skeleton class="h-3 w-14 rounded mt-1.5" />
          <Skeleton class="h-px w-full rounded mt-5" />
          <Skeleton class="h-9 w-full rounded mt-5" />
        </div>
      </div>

      <!-- Plans Cards -->
      <div v-else-if="plans && plans.length" class="pl-grid">
        <div
          v-for="(plan, index) in plans"
          :key="plan.id"
          class="pl-card"
          :class="{ 'pl-card--featured': index === 1 }"
        >
          <!-- Featured badge -->
          <div v-if="index === 1" class="pl-badge">
            <Crown :size="12" class="text-white" />
          </div>

          <!-- Top: Name + Price -->
          <h3 class="pl-name">{{ plan.name }}</h3>

          <div class="pl-price-wrap">
            <template v-if="isFree(plan.price)">
              <span class="pl-price">{{ $t('free') }}</span>
            </template>
            <template v-else>
              <span class="pl-currency">$</span>
              <span class="pl-price">{{ plan.price }}</span>
              <span class="pl-period">{{ $t('monthly') }}</span>
            </template>
          </div>

          <!-- Description Section (clamped to 4 lines) -->
          <div class="pl-desc-section">
            <div
              class="pl-desc"
              :class="{ 'pl-desc--expanded': expandedPlans[plan.id] }"
              v-html="plan.description"
            ></div>
            <button class="pl-show-more" @click="toggleExpand(plan.id)">
              <template v-if="expandedPlans[plan.id]">
                {{ $t('show_less') }}
                <ChevronUp :size="12" />
              </template>
              <template v-else>
                {{ $t('show_more') }}
                <ChevronDown :size="12" />
              </template>
            </button>
          </div>

          <!-- CTA (pushed to bottom) -->
          <div class="pl-cta-wrap">
            <button
              class="pl-cta"
              :class="index === 1 ? 'pl-cta--primary' : ''"
            >
              {{ $t('choose_plan') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="pl-empty">
        <CreditCard :size="52" class="text-secondary opacity-40" />
        <p>{{ $t('no_result') }}</p>
      </div>

    </div>

    <!-- FAQ -->
    <section class="pl-faq">
      <div class="text-center mb-5 sm:mb-8">
        <h2 class="font-cairo text-lg sm:text-2xl font-bold text-primary">{{ $t('faq') }}</h2>
        <div class="hero-divider mt-2.5"></div>
      </div>

      <div class="pl-faq-list">
        <div v-for="(q, i) in faqItems" :key="i" class="pl-faq-item" :class="{ 'pl-faq-item--open': openFaq === i }">
          <button class="pl-faq-q" @click="toggleFaq(i)">
            <HelpCircle :size="16" class="pl-faq-icon" />
            <span>{{ $t(q) }}</span>
            <ChevronDown :size="16" class="pl-faq-chevron" />
          </button>
          <div v-if="openFaq === i" class="pl-faq-a">
            {{ $t(q.replace('_q', '_a')) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA Banner — same hero+notch as every other page -->
    <section class="co-hero-wrap">
      <svg width="0" height="0" class="absolute">
        <defs>
          <clipPath id="plCtaClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.620,1 Q 0.600,1 0.585,0.850 Q 0.570,0.650 0.550,0.650 L 0.450,0.650 Q 0.430,0.650 0.415,0.850 Q 0.400,1 0.380,1 L 0,1 Z" />
          </clipPath>
          <clipPath id="plCtaClipMobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.780,1 Q 0.740,1 0.710,0.850 Q 0.680,0.680 0.640,0.680 L 0.360,0.680 Q 0.320,0.680 0.290,0.850 Q 0.260,1 0.220,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div class="co-hero-section pl-cta-clip">
        <div class="hero-corner-tl"></div>
        <div class="hero-corner-br"></div>
        <div class="co-hero-inner">
          <h2 class="font-cairo text-white text-lg sm:text-2xl font-bold">{{ $t('plans_cta_title') }}</h2>
          <p class="text-white/50 text-xs sm:text-sm mt-1.5">{{ $t('plans_cta_desc') }}</p>
        </div>
      </div>

      <!-- CTA button in the notch -->
      <div class="pl-cta-notch">
        <LLink :to="{ name: 'register' }" class="pl-bottom-btn">
          {{ $t('start_now') }}
        </LLink>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'Plans',
  head() {
    return this.metaBuilder(this.$t('plans'));
  },
};
</script>

<style>
/* ── Hero clip ── */
.pl-hero-clip {
  clip-path: url(#plHeroClipMobile);
}
@media (min-width: 640px) {
  .pl-hero-clip {
    clip-path: url(#plHeroClip);
  }
}

/* ── Section ── */
.pl-section {
  padding: 2rem 0.75rem 3rem;
}
@media (min-width: 640px) {
  .pl-section {
    padding: 2.5rem 0 4rem;
  }
}

/* ── Grid ── */
.pl-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  max-width: 400px;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .pl-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem 0.65rem;
    max-width: none;
  }
}

/* ── Plan Card ── */
.pl-card {
  border-radius: 1rem;
  overflow: hidden;
  background: #fff;
  padding: 1.25rem 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pl-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(27, 44, 59, 0.1);
}
@media (min-width: 640px) {
  .pl-card {
    padding: 2rem 1.25rem;
  }
}

/* Featured — primary dark border */
.pl-card--featured {
  border: 1.5px solid var(--color-primary);
}

/* ── Featured Badge ── */
.pl-badge {
  position: absolute;
  top: 0.6rem;
  inset-inline-end: 0.6rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 640px) {
  .pl-badge {
    top: 0.85rem;
    inset-inline-end: 0.85rem;
    width: 1.75rem;
    height: 1.75rem;
  }
}

/* ── Name ── */
.pl-name {
  font-family: 'Cairo', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
}
@media (min-width: 640px) {
  .pl-name {
    font-size: 1.1rem;
  }
}

/* ── Price ── */
.pl-price-wrap {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.1rem;
  margin-top: 1.25rem;
}
@media (min-width: 640px) {
  .pl-price-wrap {
    margin-top: 1.5rem;
  }
}

.pl-currency {
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
  opacity: 0.4;
}
@media (min-width: 640px) {
  .pl-currency {
    font-size: 1.1rem;
  }
}

.pl-price {
  font-family: 'Cairo', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}
@media (min-width: 640px) {
  .pl-price {
    font-size: 2.25rem;
  }
}

.pl-period {
  font-size: 0.55rem;
  color: var(--color-muted-foreground);
}
@media (min-width: 640px) {
  .pl-period {
    font-size: 0.75rem;
  }
}

/* ── CTA Button ── */
.pl-cta {
  width: 100%;
  padding: 0.45rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  transition: all 0.2s ease;
}
.pl-cta:hover {
  border-color: var(--color-primary);
}
@media (min-width: 640px) {
  .pl-cta {
    padding: 0.55rem 1rem;
    font-size: 0.8rem;
  }
}

/* Primary CTA for featured plan */
.pl-cta--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.pl-cta--primary:hover {
  background: #243a4d;
  border-color: #243a4d;
}

/* ── Skeleton ── */
.pl-sk-card {
  border-radius: 1rem;
  overflow: hidden;
  background: #fff;
  padding: 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (min-width: 640px) {
  .pl-sk-card {
    padding: 2rem 1.25rem;
  }
}
.pl-sk-card > * {
  background: #e2e8f0 !important;
}

/* ── Description Section ── */
.pl-desc-section {
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.75rem;
  background: var(--color-surface);
  border-radius: 0.6rem;
}
@media (min-width: 640px) {
  .pl-desc-section {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 0.75rem;
  }
}

.pl-desc {
  font-size: 0.6rem;
  color: var(--color-muted-foreground);
  line-height: 1.7;
  text-align: start;
  max-height: 9em;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.pl-desc--expanded {
  max-height: 60em;
}
@media (min-width: 640px) {
  .pl-desc {
    font-size: 0.75rem;
  }
}
.pl-desc p { margin-bottom: 0.35rem; }
.pl-desc p:last-child { margin-bottom: 0; }
.pl-desc ul { padding-inline-start: 1rem; margin-bottom: 0.35rem; list-style: disc; }
.pl-desc ol { padding-inline-start: 1rem; margin-bottom: 0.35rem; list-style: decimal; }
.pl-desc li { margin-bottom: 0.15rem; display: list-item; }
.pl-desc strong { font-weight: 700; color: var(--color-primary); }
.pl-desc a { color: var(--color-primary); text-decoration: underline; }
.pl-desc img { border-radius: 0.5rem; max-width: 100%; margin: 0.35rem 0; }

/* Show more/less toggle */
.pl-show-more {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.4rem;
  font-size: 0.55rem;
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  border: none;
  opacity: 0.6;
  transition: opacity 0.15s ease;
}
.pl-show-more:hover {
  opacity: 1;
}
@media (min-width: 640px) {
  .pl-show-more {
    font-size: 0.7rem;
  }
}

/* ── CTA pushed to bottom ── */
.pl-cta-wrap {
  width: 100%;
  margin-top: auto;
  padding-top: 1.25rem;
}
@media (min-width: 640px) {
  .pl-cta-wrap {
    padding-top: 1.5rem;
  }
}

/* ══════════════════════════════
   FAQ
   ══════════════════════════════ */
.pl-faq {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 0.75rem 2.5rem;
}
@media (min-width: 640px) {
  .pl-faq {
    padding: 0 0 3.5rem;
  }
}

.pl-faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pl-faq-item {
  background: #fff;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}
.pl-faq-item--open {
  box-shadow: 0 4px 16px rgba(27, 44, 59, 0.06);
}

.pl-faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 0.75rem;
  background: none;
  border: none;
  text-align: start;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-primary);
  transition: background 0.15s ease;
}
.pl-faq-q:hover {
  background: var(--color-surface);
}
@media (min-width: 640px) {
  .pl-faq-q {
    padding: 1rem 1.25rem;
    font-size: 0.85rem;
    gap: 0.65rem;
  }
}

.pl-faq-icon {
  flex-shrink: 0;
  color: var(--color-muted-foreground);
  opacity: 0.4;
}

.pl-faq-q span {
  flex: 1;
}

.pl-faq-chevron {
  flex-shrink: 0;
  color: var(--color-muted-foreground);
  transition: transform 0.2s ease;
}
.pl-faq-item--open .pl-faq-chevron {
  transform: rotate(180deg);
}

.pl-faq-a {
  padding: 0 0.75rem 0.85rem;
  padding-inline-start: 2.35rem;
  font-size: 0.65rem;
  color: var(--color-muted-foreground);
  line-height: 1.7;
  animation: fade-in 0.2s ease-out;
}
@media (min-width: 640px) {
  .pl-faq-a {
    padding: 0 1.25rem 1rem;
    padding-inline-start: 2.75rem;
    font-size: 0.78rem;
  }
}

/* ══════════════════════════════
   Bottom CTA Banner
   ══════════════════════════════ */
.pl-cta-clip {
  clip-path: url(#plCtaClipMobile);
}
@media (min-width: 640px) {
  .pl-cta-clip {
    clip-path: url(#plCtaClip);
  }
}

.pl-cta-notch {
  position: absolute;
  bottom: -0.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
@media (max-width: 639px) {
  .pl-cta-notch {
    bottom: 0rem;
  }
}

.pl-bottom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 2.5rem;
  border-radius: 9999px;
  background: var(--color-secondary);
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  border: none;
  box-shadow: 0 2px 8px rgba(255, 201, 9, 0.25);
  transition: all 0.2s ease;
}
.pl-bottom-btn:hover {
  box-shadow: 0 4px 16px rgba(255, 201, 9, 0.35);
  transform: translateY(-1px);
}
@media (min-width: 640px) {
  .pl-bottom-btn {
    padding: 0.85rem 4rem;
    font-size: 1.05rem;
  }
}

/* ── Empty State ── */
.pl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1rem;
  color: var(--color-muted-foreground);
  opacity: 0.5;
  text-align: center;
}
.pl-empty p {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.75rem;
}
</style>
