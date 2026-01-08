<template>
  <div>
    <div class="font-bold mb-2 cursor-pointer flex justify-between" @click="isOpen = !isOpen"><span>{{category.name}}</span><span><Icon :name="isOpen ? 'upArrow' : 'downArrow'" /></span></div>
    <div v-show="isOpen" class="px-2 py-2" >
      <label  v-for="cat in category.children" :key="`category-${cat.id}`" class="flex w-full justify-between block cursor-pointer"
             :for="`category-${cat.id}`" @click="setActive(cat.id)"><span>{{cat.name}}</span>
        <input :id="`category-${cat.id}`" :checked="isActive(cat.id)" :value="cat.id"   class="accent-secondary"
               type="radio" name="category_id"> </label>
    </div>
  </div>
</template>

<script>
  import Icon from './Icon';
  export default {
    name: 'CategoryGroup',
    components: { Icon },
    props: {
      category: {
        type: Object,
        required: true
      },
      value: {}
    },
    data() {
      return {
        category_id: '',
        isOpen: false
      };
    },
    mounted() {
      if (this.category.children.find(el => el.id == this.$route.query.category_id) != null){
        this.isOpen = true;
      }
    },
    methods: {
      setActive(id) {
        this.$emit('setCategory', id);
      },
      isActive(id) {
        return Number(this.$route.query.category_id) === id;
      }
    }
  };
</script>

<style scoped>

</style>
