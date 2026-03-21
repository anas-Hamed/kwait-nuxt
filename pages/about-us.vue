<script setup>
import { Wrench } from 'lucide-vue-next'
</script>

<template>
  <div>
    <!-- Hero with bottom notch (same as company page) -->
    <section class="co-hero-wrap">
      <svg width="0" height="0" class="absolute">
        <defs>
          <clipPath id="auHeroClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.720,1 Q 0.690,1 0.670,0.850 Q 0.650,0.650 0.620,0.650 L 0.380,0.650 Q 0.350,0.650 0.330,0.850 Q 0.310,1 0.280,1 L 0,1 Z" />
          </clipPath>
          <clipPath id="auHeroClipMobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.920,1 Q 0.870,1 0.840,0.850 Q 0.810,0.680 0.770,0.680 L 0.230,0.680 Q 0.190,0.680 0.160,0.850 Q 0.130,1 0.080,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div class="co-hero-section au-hero-clip">
        <div class="hero-corner-tl"></div>
        <div class="hero-corner-br"></div>

        <div class="co-hero-inner">
          <h1 class="font-cairo text-white text-2xl sm:text-3xl font-bold">
            {{ $t('about_us') }}
          </h1>
        </div>
      </div>

      <!-- Logo sitting in the bottom notch -->
      <div class="au-notch-logo-wrap">
        <img src="~/assets/images/logo-notch.png" alt="Logo" class="au-notch-logo" />
      </div>
    </section>

    <!-- Under Maintenance -->
    <div class="au-maintenance">
      <Wrench :size="48" class="text-muted-foreground opacity-30" />
      <p class="au-maintenance-title">{{ $t('under_maintenance') }}</p>
      <p class="au-maintenance-sub">{{ $t('under_maintenance_desc') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  head() {
    return this.metaBuilder(this.$t('about_us'));
  },
};
</script>

<style>
.au-hero-clip {
  clip-path: url(#auHeroClipMobile);
}
@media (min-width: 640px) {
  .au-hero-clip {
    clip-path: url(#auHeroClip);
  }
}

/* Logo positioned inside the bottom notch */
.au-notch-logo-wrap {
  position: absolute;
  bottom: -5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 46%;
  min-width: 160px;
  max-width: 220px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

@media (min-width: 640px) {
  .au-notch-logo-wrap {
    width: 30%;
    min-width: 200px;
    max-width: 360px;
    bottom: -5.5rem;
  }
}

.au-notch-logo {
  width: 160px;
  height: 160px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(27, 44, 59, 0.2));
}

@media (min-width: 640px) {
  .au-notch-logo {
    width: 200px;
    height: 200px;
  }
}

/* ── Under Maintenance ── */
.au-maintenance {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  text-align: center;
}

.au-maintenance-title {
  font-family: 'Cairo', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 1rem;
}

.au-maintenance-sub {
  font-size: 0.85rem;
  color: var(--color-muted-foreground);
  margin-top: 0.35rem;
}
</style>
