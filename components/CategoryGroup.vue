<template>
  <Collapsible v-model:open="isOpen">
    <CollapsibleTrigger class="fm-group-trigger">
      <span>{{ category.name }}</span>
      <ChevronDown :size="15" class="fm-group-chevron" :class="{ 'fm-group-chevron--open': isOpen }" />
    </CollapsibleTrigger>
    <CollapsibleContent class="fm-group-content">
      <label v-for="cat in category.children" :key="`category-${cat.id}`"
             :for="`category-${cat.id}`"
             class="fm-item" :class="{ 'fm-item--active': isActive(cat.id) }"
             @click="setActive(cat.id)">
        <span>{{ cat.name }}</span>
        <div class="fm-pill-radio" :class="{ 'fm-pill-radio--active': isActive(cat.id) }">
          <input :id="`category-${cat.id}`" :checked="isActive(cat.id)" :value="cat.id"
                 class="sr-only" type="radio" name="category_id">
          <div class="fm-pill-dot" :class="{ 'fm-pill-dot--active': isActive(cat.id) }"></div>
        </div>
      </label>
    </CollapsibleContent>
  </Collapsible>
</template>

<script>
import { ChevronDown } from 'lucide-vue-next'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible'

export default {
  name: 'CategoryGroup',
  components: { ChevronDown, Collapsible, CollapsibleTrigger, CollapsibleContent },
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
