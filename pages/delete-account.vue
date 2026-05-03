<script setup>
import { Trash2, FileText, UserX, ArrowUp } from 'lucide-vue-next'
import { Skeleton } from '~/components/ui/skeleton'

const api = useApi()
const { $i18n } = useNuxtApp()

const { data: deleteAccount, pending, error } = await useAsyncData('delete-account-page', async () => {
  const res = await api.get('delete-account')
  return res?.data || null
})

const content = computed(() => {
  const locale = $i18n.locale.value
  return deleteAccount.value?.[locale] || deleteAccount.value?.ar || deleteAccount.value?.en || ''
})

const updatedLabel = computed(() => {
  const locale = $i18n.locale.value
  return new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
})

const showToTop = ref(false)
let scrollHandler = null

onMounted(() => {
  scrollHandler = () => {
    showToTop.value = window.scrollY > 400
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onBeforeUnmount(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
})

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="del-page">

    <!-- ── Document Header ── -->
    <header class="del-doc-head">
      <div class="del-doc-head-inner">
        <div class="del-eyebrow">
          <Trash2 :size="13" />
          <span>{{ $t('delete_account_subtitle') }}</span>
        </div>
        <h1 class="del-doc-title">{{ $t('delete_account') }}</h1>
        <div class="del-doc-meta">
          <span class="del-doc-meta-pill">
            <FileText :size="12" />
            {{ $t('last_updated') }} · {{ updatedLabel }}
          </span>
        </div>
      </div>
    </header>

    <!-- ── Content ── -->
    <main class="del-main">
      <article class="del-doc">
        <div v-if="pending" class="del-skeletons">
          <Skeleton class="h-5 w-40 rounded" />
          <Skeleton class="h-3 w-full rounded mt-4" />
          <Skeleton class="h-3 w-11/12 rounded mt-2" />
          <Skeleton class="h-3 w-10/12 rounded mt-2" />
          <Skeleton class="h-5 w-48 rounded mt-7" />
          <Skeleton class="h-3 w-full rounded mt-4" />
          <Skeleton class="h-3 w-9/12 rounded mt-2" />
          <Skeleton class="h-3 w-11/12 rounded mt-2" />
          <Skeleton class="h-5 w-36 rounded mt-7" />
          <Skeleton class="h-3 w-full rounded mt-4" />
          <Skeleton class="h-3 w-10/12 rounded mt-2" />
        </div>

        <div v-else-if="error || !content" class="del-empty">
          <UserX :size="48" class="text-secondary opacity-40" />
          <p>{{ $t('no_result') }}</p>
        </div>

        <div
          v-else
          class="del-prose"
          :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          v-html="content"
        />

        <footer v-if="!pending && content" class="del-doc-foot">
          <div class="del-doc-foot-line"></div>
          <p class="del-doc-foot-text">
            <UserX :size="14" />
            <span>{{ $t('delete_account') }} · {{ updatedLabel }}</span>
          </p>
        </footer>
      </article>
    </main>

    <!-- Back to top -->
    <button
      v-show="showToTop"
      type="button"
      class="del-totop"
      :aria-label="$t('back_to_top')"
      @click="backToTop"
    >
      <ArrowUp :size="18" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'DeleteAccount',
  head() {
    return this.metaBuilder(this.$t('delete_account'));
  },
};
</script>

<style>
/* ════════════════════════════════════════
   Delete Account — editorial document layout
   ════════════════════════════════════════ */
.del-page {
  background: var(--color-background);
  min-height: 100vh;
  padding: 0 0 4rem;
}

/* ── Document header ── */
.del-doc-head {
  position: relative;
  padding: 3rem 1rem 2.5rem;
  text-align: center;
  background:
    radial-gradient(ellipse at top, rgba(107, 77, 209, 0.08) 0%, transparent 60%),
    var(--color-background);
  border-bottom: 1px solid var(--color-border);
}
@media (min-width: 768px) {
  .del-doc-head {
    padding: 4rem 2rem 3rem;
  }
}

.del-doc-head-inner {
  max-width: 760px;
  margin: 0 auto;
}

.del-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(107, 77, 209, 0.08);
  color: var(--color-primary);
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .del-eyebrow {
    font-size: 0.75rem;
    padding: 0.35rem 0.8rem;
  }
}

.del-doc-title {
  font-family: 'Poppins', 'Alexandria', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-foreground);
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin-top: 0.85rem;
  margin-bottom: 0.85rem;
}
@media (min-width: 768px) {
  .del-doc-title {
    font-size: 2.5rem;
    margin-top: 1.1rem;
    margin-bottom: 1rem;
  }
}

.del-doc-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.del-doc-meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: var(--color-muted-foreground);
  background: #fff;
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

/* ── Main ── */
.del-main {
  max-width: 880px;
  margin: 0 auto;
  padding: 2.25rem 1rem 0;
}
@media (min-width: 768px) {
  .del-main {
    padding: 3rem 2rem 0;
  }
}

/* ── Document body ── */
.del-doc {
  background: #fff;
  border-radius: 1.25rem;
  padding: 1.5rem 1.25rem;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.02);
}
@media (min-width: 768px) {
  .del-doc {
    padding: 3rem 3.25rem;
    border-radius: 1.5rem;
  }
}

/* ── Prose typography ── */
.del-prose {
  font-size: 0.92rem;
  line-height: 1.85;
  color: #2a3142;
  text-align: start;
}
@media (min-width: 768px) {
  .del-prose {
    font-size: 1rem;
    line-height: 1.9;
  }
}

/* Force RTL alignment for Arabic content — overrides inline styles from the WYSIWYG editor */
.del-prose[dir="rtl"],
.del-prose[dir="rtl"] *:not(code):not(pre) {
  text-align: right !important;
  direction: rtl !important;
}
.del-prose[dir="ltr"],
.del-prose[dir="ltr"] *:not(code):not(pre) {
  text-align: left !important;
  direction: ltr !important;
}
.del-prose .text-center,
.del-prose [style*="text-align: center"] {
  text-align: center !important;
}

.del-prose > :first-child {
  margin-top: 0 !important;
}
.del-prose > :last-child {
  margin-bottom: 0 !important;
}

.del-prose h1 {
  font-family: 'Poppins', 'Alexandria', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-foreground);
  margin: 0 0 1rem;
  letter-spacing: -0.01em;
}

.del-prose h2 {
  font-family: 'Poppins', 'Alexandria', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-foreground);
  margin-top: 2.25rem;
  margin-bottom: 0.85rem;
  letter-spacing: -0.005em;
}
@media (min-width: 768px) {
  .del-prose h2 {
    font-size: 1.4rem;
    margin-top: 2.75rem;
  }
}

.del-prose h3 {
  font-family: 'Poppins', 'Alexandria', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-foreground);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
@media (min-width: 768px) {
  .del-prose h3 {
    font-size: 1.1rem;
  }
}

.del-prose h4 {
  font-family: 'Poppins', 'Alexandria', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-foreground);
  margin-top: 1.25rem;
  margin-bottom: 0.4rem;
}

.del-prose p {
  margin: 0 0 1rem;
}

.del-prose ul,
.del-prose ol {
  padding-inline-start: 1.5rem;
  margin: 0 0 1rem;
}
.del-prose ul {
  list-style: disc;
}
.del-prose ol {
  list-style: decimal;
}
.del-prose li {
  margin-bottom: 0.4rem;
  display: list-item;
  padding-inline-start: 0.25rem;
}
.del-prose li::marker {
  color: var(--color-primary);
}

.del-prose strong {
  font-weight: 700;
  color: var(--color-foreground);
}
.del-prose em {
  font-style: italic;
}

.del-prose a {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-color: rgba(107, 77, 209, 0.4);
  text-underline-offset: 3px;
  text-decoration-thickness: 1.5px;
  font-weight: 500;
  transition: text-decoration-color 0.15s ease;
}
.del-prose a:hover {
  text-decoration-color: var(--color-primary);
}

.del-prose blockquote {
  border-inline-start: 3px solid var(--color-primary);
  background: var(--color-surface);
  padding: 0.85rem 1rem;
  margin: 1.25rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
  color: var(--color-foreground);
  font-style: italic;
}
[dir="rtl"] .del-prose blockquote {
  border-radius: 0.5rem 0 0 0.5rem;
}
.del-prose blockquote p:last-child {
  margin-bottom: 0;
}

.del-prose code {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.05rem 0.4rem;
  border-radius: 0.3rem;
  font-size: 0.85em;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--color-primary);
}

.del-prose hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2rem 0;
}

.del-prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.6rem;
  margin: 1rem 0;
}

.del-prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
  font-size: 0.9em;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
}
.del-prose th,
.del-prose td {
  border: 1px solid var(--color-border);
  padding: 0.6rem 0.75rem;
  text-align: start;
}
.del-prose th {
  background: var(--color-surface);
  font-weight: 700;
  color: var(--color-foreground);
}

/* ── Doc footer ── */
.del-doc-foot {
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-border);
}
.del-doc-foot-text {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--color-muted-foreground);
}
.del-doc-foot-text svg {
  color: var(--color-primary);
  opacity: 0.7;
}

/* ── Empty / error ── */
.del-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  color: var(--color-muted-foreground);
  text-align: center;
  gap: 0.75rem;
}
.del-empty p {
  font-size: 0.95rem;
  font-weight: 600;
  opacity: 0.7;
}

/* ── Skeletons ── */
.del-skeletons > * {
  background: #e2e8f0 !important;
}

/* ── Back to top ── */
.del-totop {
  position: fixed;
  bottom: 1.5rem;
  inset-inline-end: 1.5rem;
  z-index: 50;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(54, 32, 97, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.del-totop:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(54, 32, 97, 0.35);
}
@media (min-width: 768px) {
  .del-totop {
    width: 2.75rem;
    height: 2.75rem;
    bottom: 2rem;
    inset-inline-end: 2rem;
  }
}
</style>
