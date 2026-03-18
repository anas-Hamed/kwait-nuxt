<template>
  <div class="w-full lg:w-1/4">
    <!-- Desktop Filter -->
    <div class="hidden lg:block lg:pe-3">
      <div class="fm-card lg:sticky lg:top-24">
        <h3 class="fm-title">{{ $t('categories') }}</h3>
        <SearchInput v-model="categorySearch" class="mb-3" :placeholder="$t('search_about_category')" light small />
        <ScrollArea class="h-[520px] pe-1">
          <div class="space-y-0.5">
            <label class="fm-item" :class="{ 'fm-item--active': $route.query.category_id == null }"
                   @click="setCategory(null)" for="all-companies">
              <span>{{ $t('all_companies') }}</span>
              <input id="all-companies" :checked="$route.query.category_id == null" :value="null"
                     class="accent-secondary w-4 h-4" type="radio" name="category_id">
            </label>
            <Separator class="!my-1.5" />
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
            <SlidersHorizontal :size="16" />
            <span>{{ $t('categories') }}</span>
          </button>
        </SheetTrigger>
        <SheetContent :side="sheetSide" class="w-[300px] p-0">
          <SheetHeader class="p-4 pb-2 border-b border-border">
            <SheetTitle class="text-primary font-bold">{{ $t('categories') }}</SheetTitle>
          </SheetHeader>
          <div class="px-4 pt-3 pb-2">
            <SearchInput v-model="categorySearch" :placeholder="$t('search_about_category')" small />
          </div>
          <ScrollArea class="h-[calc(100vh-140px)] px-4">
            <div class="space-y-0.5 py-2">
              <label class="fm-item" :class="{ 'fm-item--active': $route.query.category_id == null }"
                     @click="setCategory(null)" for="all-companies-mobile">
                <span>{{ $t('all_companies') }}</span>
                <input id="all-companies-mobile" :checked="$route.query.category_id == null" :value="null"
                       class="accent-secondary w-4 h-4" type="radio" name="category_id">
              </label>
              <Separator class="!my-1.5" />
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
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'

export default {
  name: 'FilterMenu',
  components: { SlidersHorizontal, Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, ScrollArea, Separator },
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
  border-radius: 1.25rem;
  box-shadow: var(--shadow-soft);
  padding: 1.25rem;
}
.fm-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

/* ── Filter Item ── */
.fm-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.65rem;
  border-radius: 0.6rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-card-foreground);
  transition: background-color 0.15s ease;
}
.fm-item:hover {
  background: var(--color-surface);
}
.fm-item--active {
  background: var(--color-surface);
  color: var(--color-primary);
  font-weight: 700;
}

/* ── Mobile Trigger ── */
.fm-mobile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: 0.6rem;
  border: 1px solid var(--color-border);
  background: white;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.fm-mobile-trigger:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(27, 44, 59, 0.06);
}
</style>
