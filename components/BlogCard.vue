<template>
  <LLink :to="{ name: 'blog-slug', params: { slug: blog.slug } }" class="block group">
    <div class="bc">
      <div class="bc-img-wrap">
        <ImagePlaceholder :image="blog.image" class="bc-img" />
      </div>
      <div class="bc-body">
        <client-only>
          <span class="bc-category"><Calendar :size="10" /> {{ $dayjs(blog.created_at).format('DD MMM YYYY') }}</span>
        </client-only>
        <h3 class="bc-title">{{ blog.title }}</h3>
      </div>
    </div>
  </LLink>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next'

defineProps({
  blog: { type: Object, required: true },
})
</script>

<style>
.bc {
  cursor: pointer;
}

/* Image */
.bc-img-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--color-surface);
}
.bc-img-wrap :deep(div) {
  padding: 0 !important;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.bc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(.22,.61,.36,1);
}
.bc:hover .bc-img {
  transform: scale(1.03);
}

/* Body */
.bc-body {
  padding: 0.65rem 0.15rem 0;
}

.bc-category {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted-foreground);
  margin-bottom: 0.3rem;
}

.bc-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bc:hover .bc-title {
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
