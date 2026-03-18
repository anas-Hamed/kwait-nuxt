<template>
  <div class="db">
    <!-- Top: Welcome + Primary Stat -->
    <div class="db-top">
      <div class="db-welcome">
        <time class="db-welcome-date" :datetime="isoDate">{{ formattedDate }}</time>
        <h1 class="db-welcome-name" style="text-wrap: balance">
          {{ $t('welcome_back') }}{{ authUser?.name ? `, ${authUser.name}` : '' }}
        </h1>
        <p class="db-welcome-sub">{{ $t('welcome_message') }}</p>
      </div>
      <LLink to="/profile/my-companies" class="db-hero-stat">
        <Building2 :size="22" aria-hidden="true" />
        <span class="db-hero-stat-num">{{ companies?.length || 0 }}</span>
        <span class="db-hero-stat-lbl">{{ $t('my_companies') }}</span>
      </LLink>
    </div>

    <!-- Mini Stats -->
    <div class="db-mini-row">
      <LLink to="/profile/favorite" class="db-mini">
        <span class="db-mini-dot db-mini-dot--rose" aria-hidden="true"></span>
        <span class="db-mini-num">{{ favorite?.length || 0 }}</span>
        <span class="db-mini-lbl">{{ $t('favorite') }}</span>
      </LLink>
      <LLink to="/notifications" class="db-mini">
        <span class="db-mini-dot db-mini-dot--amber" aria-hidden="true"></span>
        <span class="db-mini-num">{{ appStore.unread_notifications || 0 }}</span>
        <span class="db-mini-lbl">{{ $t('notifications') }}</span>
      </LLink>
      <LLink to="/profile/add-company" class="db-mini db-mini--cta">
        <Plus :size="16" aria-hidden="true" />
        <span class="db-mini-lbl">{{ $t('add_company') }}</span>
      </LLink>
    </div>

    <!-- Recent Companies -->
    <section class="db-panel">
      <div class="db-panel-head">
        <h2>{{ $t('recent_companies') }}</h2>
        <LLink v-if="companies?.length > 2" to="/profile/my-companies" class="db-see-all">
          {{ $t('show_all') }}
        </LLink>
      </div>

      <div v-if="companies?.length" class="db-company-list">
        <CompanyCard
          v-for="company in recentCompanies"
          :key="company.id"
          :company="company"
          :show-control="true"
        />
      </div>

      <div v-else class="db-empty">
        <Building2 :size="28" aria-hidden="true" />
        <p>{{ $t('no_companies_added') }}</p>
        <LLink to="/profile/add-company">
          <Button size="sm" class="rounded-xl gap-2 mt-3">
            <Plus :size="14" />
            {{ $t('add_company') }}
          </Button>
        </LLink>
      </div>
    </section>

    <!-- Quick Actions -->
    <nav class="db-grid-actions" :aria-label="$t('quick_actions')">
      <LLink to="/profile/settings" class="db-act">
        <div class="db-act-icon"><Settings :size="20" aria-hidden="true" /></div>
        <div>
          <span class="db-act-title">{{ $t('settings') }}</span>
          <span class="db-act-desc">{{ $t('update_personal_info') }}</span>
        </div>
      </LLink>
      <LLink to="/profile/trust-company" class="db-act">
        <div class="db-act-icon"><Shield :size="20" aria-hidden="true" /></div>
        <div>
          <span class="db-act-title">{{ $t('trust') }}</span>
          <span class="db-act-desc">{{ $t('trust_company') }}</span>
        </div>
      </LLink>
      <LLink to="/company" class="db-act">
        <div class="db-act-icon"><Search :size="20" aria-hidden="true" /></div>
        <div>
          <span class="db-act-title">{{ $t('search') }}</span>
          <span class="db-act-desc">{{ $t('explore_companies') }}</span>
        </div>
      </LLink>
    </nav>
  </div>
</template>

<script setup>
import { Building2, Heart, Bell, Plus, Settings, Shield, Search } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const props = defineProps({
  companies: { type: Array, default: () => [] },
  favorite: { type: Array, default: () => [] },
})

const { data: authUser } = useAuth()
const appStore = useAppStore()
const { locale } = useI18n()

const recentCompanies = computed(() => (props.companies || []).slice(0, 2))

const now = new Date()
const isoDate = now.toISOString().slice(0, 10)

const formattedDate = computed(() => {
  return now.toLocaleDateString(locale.value === 'ar' ? 'ar-KW' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style>
/* ── Root ── */
.db {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Top Row: Welcome + Hero Stat ── */
.db-top {
  display: flex;
  align-items: stretch;
  gap: 1rem;
  animation: db-in 0.45s ease both;
}
.db-welcome {
  flex: 1;
  min-width: 0;
  background: var(--color-primary);
  color: white;
  border-radius: 1.25rem;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.db-welcome-date {
  font-size: 0.72rem;
  opacity: 0.5;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.db-welcome-name {
  font-size: 1.25rem;
  font-weight: 800;
  margin-top: 0.35rem;
  line-height: 1.3;
}
.db-welcome-sub {
  font-size: 0.8rem;
  opacity: 0.55;
  margin-top: 0.3rem;
  line-height: 1.4;
}

.db-hero-stat {
  flex-shrink: 0;
  width: 130px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  text-align: center;
  color: var(--color-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.db-hero-stat:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(27, 44, 59, 0.08);
}
.db-hero-stat-num {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.db-hero-stat-lbl {
  font-size: 0.7rem;
  color: var(--color-muted-foreground);
  font-weight: 500;
}

/* ── Mini Stats Row ── */
.db-mini-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
  animation: db-in 0.45s ease 0.08s both;
}
.db-mini {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.db-mini:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 10px rgba(27, 44, 59, 0.06);
}
.db-mini-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.db-mini-dot--rose { background: #f43f5e; }
.db-mini-dot--amber { background: #f59e0b; }
.db-mini-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.db-mini-lbl {
  font-size: 0.78rem;
  color: var(--color-muted-foreground);
  font-weight: 500;
}
.db-mini--cta {
  border-color: var(--color-secondary);
  border-style: dashed;
  background: rgba(255, 201, 9, 0.04);
  color: var(--color-primary);
  justify-content: center;
  gap: 0.4rem;
  font-weight: 600;
}
.db-mini--cta:hover {
  border-color: var(--color-secondary);
  background: rgba(255, 201, 9, 0.1);
  box-shadow: none;
}

/* ── Panel ── */
.db-panel {
  background: white;
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-soft);
  animation: db-in 0.45s ease 0.16s both;
}
.db-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.db-panel-head h2 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
}
.db-see-all {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted-foreground);
  transition: color 0.15s ease;
}
.db-see-all:hover { color: var(--color-primary); }

.db-company-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.db-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: var(--color-muted-foreground);
  opacity: 0.6;
  text-align: center;
}
.db-empty p {
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

/* ── Quick Actions Grid ── */
.db-grid-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  animation: db-in 0.45s ease 0.24s both;
}
.db-act {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.db-act:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 10px rgba(27, 44, 59, 0.06);
}
.db-act-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}
.db-act-title {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-primary);
}
.db-act-desc {
  display: block;
  font-size: 0.72rem;
  color: var(--color-muted-foreground);
  margin-top: 0.1rem;
}

/* ── Animation ── */
@keyframes db-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .db-top, .db-mini-row, .db-panel, .db-grid-actions { animation: none; }
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .db-top { flex-direction: column; }
  .db-hero-stat { width: 100%; flex-direction: row; justify-content: flex-start; gap: 0.75rem; padding: 1rem 1.25rem; }
  .db-hero-stat-num { font-size: 1.5rem; }
  .db-mini-row { grid-template-columns: 1fr 1fr; }
  .db-mini--cta { grid-column: span 2; }
  .db-grid-actions { grid-template-columns: 1fr; }
}
</style>
