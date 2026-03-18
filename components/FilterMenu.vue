<template>
  <div class="w-full lg:w-1/4">
    <!-- Desktop Filter -->
    <div class="hidden lg:block">
      <Card class="p-4">
        <h3 class="font-bold mb-3">{{ $t('categories') }}</h3>
        <SearchInput v-model="categorySearch" class="mb-3" :placeholder="$t('search_about_category')" />
        <ScrollArea class="h-[400px] pr-2">
          <div class="space-y-1">
            <label class="flex w-full justify-between items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent transition-colors font-medium"
                   @click="setCategory(null)" for="all-companies">
              <span>{{ $t('all_companies') }}</span>
              <input id="all-companies" :checked="$route.query.category_id == null" :value="null"
                     class="accent-secondary w-4 h-4" type="radio" name="category_id">
            </label>
            <Separator />
            <CategoryGroup v-for="category in filteredCategories" :key="`category-group-${category.id}`"
                           :category="category" @setCategory="setCategory" />
          </div>
        </ScrollArea>
      </Card>
    </div>

    <!-- Mobile Filter -->
    <div class="block lg:hidden">
      <Sheet v-model:open="opened">
        <SheetTrigger as-child>
          <Button variant="ghost" class="gap-1.5 text-blue-500">
            <span class="font-bold">{{ $t('categories') }}</span>
            <SlidersHorizontal :size="16" />
          </Button>
        </SheetTrigger>
        <SheetContent :side="sheetSide" class="w-[300px] p-0">
          <SheetHeader class="p-4 pb-2">
            <SheetTitle>{{ $t('categories') }}</SheetTitle>
          </SheetHeader>
          <div class="px-4 pb-3">
            <SearchInput v-model="categorySearch" :placeholder="$t('search_about_category')" />
          </div>
          <ScrollArea class="h-[calc(100vh-140px)] px-4">
            <div class="space-y-1">
              <label class="flex w-full justify-between items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent transition-colors font-medium"
                     @click="setCategory(null)" for="all-companies-mobile">
                <span>{{ $t('all_companies') }}</span>
                <input id="all-companies-mobile" :checked="$route.query.category_id == null" :value="null"
                       class="accent-secondary w-4 h-4" type="radio" name="category_id">
              </label>
              <Separator />
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
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'

export default {
  name: 'FilterMenu',
  components: { SlidersHorizontal, Card, Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, ScrollArea, Separator },
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
