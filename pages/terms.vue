<script setup>
import { Wrench } from 'lucide-vue-next'
</script>

<template>
  <div>
    <section class="co-hero-wrap">
      <svg width="0" height="0" class="absolute">
        <defs>
          <clipPath id="tmHeroClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.720,1 Q 0.690,1 0.670,0.850 Q 0.650,0.650 0.620,0.650 L 0.380,0.650 Q 0.350,0.650 0.330,0.850 Q 0.310,1 0.280,1 L 0,1 Z" />
          </clipPath>
          <clipPath id="tmHeroClipMobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 L 0.920,1 Q 0.870,1 0.840,0.850 Q 0.810,0.680 0.770,0.680 L 0.230,0.680 Q 0.190,0.680 0.160,0.850 Q 0.130,1 0.080,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div class="co-hero-section tm-hero-clip">
        <div class="hero-corner-tl"></div>
        <div class="hero-corner-br"></div>
        <div class="co-hero-inner">
          <h1 class="font-cairo text-white text-2xl sm:text-3xl font-bold">
            {{ $t('terms') }}
          </h1>
        </div>
      </div>

      <div class="au-notch-logo-wrap">
        <img src="~/assets/images/logo-notch.png" alt="Logo" class="au-notch-logo" />
      </div>
    </section>

    <div class="au-maintenance">
      <Wrench :size="48" class="text-muted-foreground opacity-30" />
      <p class="au-maintenance-title">{{ $t('under_maintenance') }}</p>
      <p class="au-maintenance-sub">{{ $t('under_maintenance_desc') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms',
  head() {
    return this.metaBuilder(this.$t('terms'));
  },
};
</script>

<style>
.tm-hero-clip {
  clip-path: url(#tmHeroClipMobile);
}
@media (min-width: 640px) {
  .tm-hero-clip {
    clip-path: url(#tmHeroClip);
  }
}
</style>
