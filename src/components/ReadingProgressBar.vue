<script setup lang="ts">
import { useReadingProgress } from '@/composables/useReadingProgress';

const { progress } = useReadingProgress('main-scroll-area');
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
    <div 
      class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-150 ease-out"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>
