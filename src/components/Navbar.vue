<template>
  <nav class="bg-surface shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-primary font-bold text-xl">ImageProcessor</a>
        <div class="flex space-x-4">
          <a
              v-for="link in links"
              :key="link.path"
              :href="link.path"
              :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isCurrentPath(link.path)
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-primary/10 hover:text-white'
            ]"
          >
            {{ link.name }}
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const links = ref([
  { name: 'Home', path: '/' },
  { name: 'Background Remover', path: '/background-remover' },
  { name: 'Color Filter', path: '/color-filter' },
  { name: 'Image Denoiser', path: '/image-denoiser' }
])

const isCurrentPath = (path) => {
  if (typeof window !== 'undefined') {
    return window.location.pathname === path
  }
  return false
}
</script>

