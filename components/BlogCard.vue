<template>
  <LLink :to="{ name: 'blog-slug', params: { slug: blog.slug } }" class="p-2">
    <Card class="overflow-hidden transition-shadow hover:shadow-lg group">
      <div class="overflow-hidden">
        <img class="w-full object-cover transition-transform duration-300 group-hover:scale-105"
             :src="blog.image" alt="" style="aspect-ratio: 16/9">
      </div>
      <CardContent class="p-4">
        <p class="font-bold text-base line-clamp-2">{{ blog.title }}</p>
        <div class="flex justify-end w-full mt-2">
          <client-only>
            <Badge variant="secondary" class="text-xs font-normal">
              {{ $dayjs(blog.created_at).format('YYYY-MM-DD H:m') }}
            </Badge>
          </client-only>
        </div>
      </CardContent>
    </Card>
  </LLink>
</template>

<script setup>
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

defineProps({
  blog: { type: Object, required: true },
})
</script>
