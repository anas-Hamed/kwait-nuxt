<script setup>
import { ArrowLeft } from 'lucide-vue-next'

const api = useApi()
const route = useRoute()

const { data: blog } = await useAsyncData(`blog-${route.params.slug}`, async () => {
  const res = await api.get(`blog/${route.params.slug}`)
  return res.data || {}
})
</script>

<template>
  <div class="bd">

    <!-- ━━ Back Button ━━ -->
    <LLink :to="{ name: 'blog' }" class="bd-back">
      <ArrowLeft :size="16" />
      <span>{{ $t('blog') }}</span>
    </LLink>

    <!-- ━━ Section 1: Hero Header ━━ -->
    <header class="bd-hero">
      <div class="bd-hero-left">
        <client-only>
          <span class="bd-label">{{ $dayjs(blog?.created_at).format('MMM DD, YYYY') }}</span>
        </client-only>
        <h1 class="bd-title">{{ blog?.title }}</h1>
      </div>
      <div class="bd-hero-right">
        <div class="bd-hero-img">
          <ImagePlaceholder :image="blog?.image" :top="62" />
        </div>
      </div>
    </header>

    <!-- ━━ Section 2: Divider ━━ -->
    <div class="bd-divider"></div>

    <!-- ━━ Section 3: Content + Sidebar ━━ -->
    <div class="bd-body">
      <article class="bd-article" v-html="blog?.text"></article>

    </div>

  </div>
</template>

<script>
export default {
  name: 'BlogShow',
  head() {
    return this.metaBuilder(this.blog?.title, '', this.blog?.image);
  },
};
</script>

<style scoped>
.bd {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Back Button
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.bd-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color 0.15s ease;
}
.bd-back:hover {
  color: var(--color-primary);
}
[dir="rtl"] .bd-back svg {
  transform: scaleX(-1);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Section 1: Hero Header
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.bd-hero {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .bd-hero {
    flex-direction: row;
    align-items: center;
    gap: 3rem;
  }
}

.bd-hero-left {
  flex: 1;
}

.bd-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-muted-foreground);
  margin-bottom: 0.75rem;
}

.bd-title {
  font-family: 'Cairo', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.25;
}
@media (min-width: 768px) {
  .bd-title {
    font-size: 2.4rem;
  }
}

.bd-hero-right {
  flex: 1;
}
@media (max-width: 767px) {
  .bd-hero-right {
    order: -1;
  }
}

.bd-hero-img {
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Section 2: Divider
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.bd-divider {
  height: 1px;
  background: var(--color-border);
  margin: 2.5rem 0;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Section 3: Content + Sidebar
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.bd-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
@media (min-width: 768px) {
  .bd-body {
    flex-direction: row;
    gap: 3rem;
  }
}

/* Article */
.bd-article {
  flex: 1;
  min-width: 0;
  color: var(--color-primary);
  font-size: 1rem;
  line-height: 1.85;
}
@media (min-width: 768px) {
  .bd-article {
    flex: 2;
  }
}

.bd-article :deep(p) {
  margin-bottom: 1.25rem;
}
.bd-article :deep(h2) {
  font-family: 'Cairo', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid var(--color-border);
}
.bd-article :deep(h3) {
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.bd-article :deep(a) {
  color: var(--color-secondary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.bd-article :deep(img) {
  border-radius: 0.75rem;
  margin: 1.5rem 0;
  max-width: 100%;
}
.bd-article :deep(blockquote) {
  border-inline-start: 3px solid var(--color-secondary);
  padding-inline-start: 1rem;
  margin: 1.5rem 0;
  color: var(--color-muted-foreground);
  font-style: italic;
}
.bd-article :deep(ul),
.bd-article :deep(ol) {
  padding-inline-start: 1.25rem;
  margin-bottom: 1.25rem;
}
.bd-article :deep(li) {
  margin-bottom: 0.35rem;
}
.bd-article :deep(strong) {
  font-weight: 700;
}

</style>
