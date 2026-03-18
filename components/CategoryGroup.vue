<template>
  <Collapsible v-model:open="isOpen">
    <CollapsibleTrigger class="flex w-full justify-between items-center py-2 px-1 font-bold cursor-pointer hover:bg-accent rounded-md transition-colors">
      <span>{{ category.name }}</span>
      <ChevronUp v-if="isOpen" :size="16" class="text-muted-foreground" />
      <ChevronDown v-else :size="16" class="text-muted-foreground" />
    </CollapsibleTrigger>
    <CollapsibleContent class="px-2 py-1">
      <label v-for="cat in category.children" :key="`category-${cat.id}`"
             :for="`category-${cat.id}`"
             class="flex w-full justify-between items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors text-sm"
             @click="setActive(cat.id)">
        <span>{{ cat.name }}</span>
        <input :id="`category-${cat.id}`" :checked="isActive(cat.id)" :value="cat.id"
               class="accent-secondary w-4 h-4" type="radio" name="category_id">
      </label>
    </CollapsibleContent>
  </Collapsible>
</template>

<script>
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible'

export default {
  name: 'CategoryGroup',
  components: { ChevronUp, ChevronDown, Collapsible, CollapsibleTrigger, CollapsibleContent },
  props: {
    category: { type: Object, required: true },
    modelValue: {},
  },
  emits: ['update:modelValue', 'setCategory'],
  data() {
    return {
      isOpen: false,
    }
  },
  mounted() {
    if (this.category.children.find(el => el.id == this.$route.query.category_id) != null) {
      this.isOpen = true
    }
  },
  methods: {
    setActive(id) {
      this.$emit('setCategory', id)
    },
    isActive(id) {
      return Number(this.$route.query.category_id) === id
    },
  },
}
</script>
