<template>
  <div class="w-full lg:w-1/4">
    <!-- Desktop Filter -->
    <div class="hidden lg:block lg:pe-3">
      <div class="fm-card lg:sticky lg:top-24">
        <!-- Header -->
        <div class="fm-header">
          <div class="fm-header-icon">
            <SlidersHorizontal :size="13" class="text-secondary" />
          </div>
          <h3 class="fm-header-title">{{ $t('categories') }}</h3>
        </div>

        <!-- Search -->
        <div class="fm-search-wrap">
          <SearchInput v-model="categorySearch" class="w-full" :placeholder="$t('search_about_category')" light small />
        </div>

        <!-- All Companies pill -->
        <div class="fm-pill-wrap">
          <label class="fm-pill" :class="{ 'fm-pill--active': $route.query.category_id == null }"
                 @click="setCategory(null)" for="all-companies">
            <span>{{ $t('all_companies') }}</span>
            <div class="fm-pill-radio" :class="{ 'fm-pill-radio--active': $route.query.category_id == null }">
              <input id="all-companies" :checked="$route.query.category_id == null" :value="null"
                     class="sr-only" type="radio" name="category_id">
              <div class="fm-pill-dot" :class="{ 'fm-pill-dot--active': $route.query.category_id == null }"></div>
            </div>
          </label>
        </div>

        <!-- Categories list -->
        <ScrollArea class="fm-scroll">
          <div class="fm-list">
            <CategoryGroup v-for="category in filteredCategories" :key="`category-group-${category.id}`"
                           :category="category" @setCategory="setCategory" />
          </div>
        </ScrollArea>
      </div>
    </div>

    <!-- Mobile Filter -->
    <div class="block lg:hidden">
      <Sheet v-model:open="opened">
        <SheetTrigger as-child>
          <button class="fm-mobile-trigger">
            <SlidersHorizontal :size="14" />
            <span>{{ $t('categories') }}</span>
          </button>
        </SheetTrigger>
        <SheetContent :side="sheetSide" class="w-[280px] p-0 border-0 bg-white">
          <!-- Header -->
          <div class="fm-header">
            <div class="fm-header-icon">
              <SlidersHorizontal :size="13" class="text-secondary" />
            </div>
            <span class="fm-header-title">{{ $t('categories') }}</span>
          </div>

          <!-- Search -->
          <div class="fm-search-wrap">
            <SearchInput v-model="categorySearch" :placeholder="$t('search_about_category')" light small />
          </div>

          <!-- All Companies pill -->
          <div class="fm-pill-wrap">
            <label class="fm-pill" :class="{ 'fm-pill--active': $route.query.category_id == null }"
                   @click="setCategory(null)" for="all-companies-mobile">
              <span>{{ $t('all_companies') }}</span>
              <div class="fm-pill-radio" :class="{ 'fm-pill-radio--active': $route.query.category_id == null }">
                <input id="all-companies-mobile" :checked="$route.query.category_id == null" :value="null"
                       class="sr-only" type="radio" name="category_id">
                <div class="fm-pill-dot" :class="{ 'fm-pill-dot--active': $route.query.category_id == null }"></div>
              </div>
            </label>
          </div>

          <!-- Categories list -->
          <ScrollArea class="h-[calc(100vh-220px)]">
            <div class="fm-list">
              <CategoryGroup v-for="category in filteredCategories" :key="`category-group-m-${category.id}`"
                             :category="category" @setCategory="setCategory" />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  </div>
</template>

<script>
import { SlidersHorizontal } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { ScrollArea } from '~/components/ui/scroll-area'

export default {
  name: 'FilterMenu',
  components: { SlidersHorizontal, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, ScrollArea },
  props: {
    categories: { type: Array, default: () => [] },
  },
  data() {
    return {
      categorySearch: '',
      opened: false,
    }
  },
  computed: {
    sheetSide() {
      return this.$i18n.locale === 'ar' ? 'right' : 'left'
    },
    filteredCategories() {
      let parents = this.categories.map(el => {
        return { ...el, children: this.categories.filter(item => item.parent_id === el.id) }
      }).filter(el => el.parent_id === null)
      if (this.categorySearch) parents = parents.filter(el => el.name.match(this.categorySearch)
        || el.children.filter(el => el.name.match(this.categorySearch)).length > 0)
      return parents
    },
  },
  methods: {
    setCategory(v) {
      this.opened = false
      this.$emit('setCategory', v)
    },
  },
}
</script>

<style>
/* ── Filter Card ── */
.fm-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* ── Header ── */
.fm-header {
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid var(--color-border);
}

.fm-header-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 201, 9, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fm-header-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
}

/* ── Search ── */
.fm-search-wrap {
  padding: 0.75rem 0.75rem 0.75rem;
}

/* ── Pill Wrapper ── */
.fm-pill-wrap {
  padding: 0 0.75rem 0.5rem;
}

/* ── All Companies Pill ── */
.fm-pill {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-card-foreground);
  background: var(--color-surface);
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.fm-pill:hover {
  background: var(--color-surface);
  border-color: var(--color-border);
}

.fm-pill--active {
  background: rgba(255, 201, 9, 0.08);
  border-color: var(--color-secondary);
  color: var(--color-primary);
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(255, 201, 9, 0.1);
}

/* ── Radio Dot ── */
.fm-pill-radio {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease;
  flex-shrink: 0;
}

.fm-pill-radio--active,
.fm-pill--active .fm-pill-radio {
  border-color: var(--color-secondary);
}

.fm-pill-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  transition: background 0.15s ease;
}

.fm-pill-dot--active {
  background: var(--color-secondary);
}

/* ── Scroll area ── */
.fm-scroll {
  height: 460px;
  padding: 0 0.25rem;
}

/* ── Category list ── */
.fm-list {
  padding: 0.25rem 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

/* ── Mobile Trigger ── */
.fm-mobile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: white;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  box-shadow: var(--shadow-soft);
  transition: all 0.2s ease;
}

.fm-mobile-trigger:hover {
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-card);
  transform: translateY(-1px);
}

.fm-mobile-trigger:active {
  transform: translateY(0);
  box-shadow: var(--shadow-soft);
}

/* ── Category Group Trigger ── */
.fm-group-trigger {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-primary);
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  background: transparent;
}

.fm-group-trigger:hover {
  background: var(--color-surface);
}

.fm-group-trigger[data-state="open"] {
  background: var(--color-surface);
}

/* ── Group Chevron ── */
.fm-group-chevron {
  color: var(--color-muted-foreground);
  transition: transform 0.2s ease;
}

.fm-group-chevron--open {
  transform: rotate(180deg);
}

/* ── Group Content ── */
.fm-group-content {
  padding: 0.15rem 0 0.15rem 0.5rem;
}

/* ── Filter Item ── */
.fm-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 0.65rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-card-foreground);
  border-inline-start: 2px solid transparent;
  transition: all 0.15s ease;
}

.fm-item:hover {
  background: var(--color-surface);
}

.fm-item--active {
  background: rgba(255, 201, 9, 0.06);
  color: var(--color-primary);
  font-weight: 700;
  border-inline-start-color: var(--color-secondary);
}

.fm-item--active .fm-pill-radio {
  border-color: var(--color-secondary);
}
</style>
