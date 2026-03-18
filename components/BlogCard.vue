<template>
  <LLink :to="{ name: 'blog-slug', params: { slug: blog.slug } }" class="p-2 block group">
    <div class="bg-white rounded-2xl overflow-hidden shadow-soft card-lift">
      <div class="relative overflow-hidden">
        <img class="w-full object-cover transition-transform duration-500 group-hover:scale-110"
             :src="blog.image" alt="" style="aspect-ratio: 16/9">
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <client-only>
          <div class="absolute top-3 end-3">
            <Badge class="bg-white/90 text-primary backdrop-blur-sm border-0 text-xs font-medium rounded-full px-3 py-1 shadow-sm">
              {{ $dayjs(blog.created_at).format('YYYY-MM-DD') }}
            </Badge>
          </div>
        </client-only>
      </div>
      <div class="p-4">
        <p class="font-bold text-base line-clamp-2 text-primary group-hover:text-secondary transition-colors duration-200">{{ blog.title }}</p>
      </div>
    </div>
  </LLink>
</template>

<script setup>
import { Badge } from '~/components/ui/badge'

defineProps({
  blog: { type: Object, required: true },
})
</script>
