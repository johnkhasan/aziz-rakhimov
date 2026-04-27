<script setup lang="ts">
import { useArticlesStore } from '@/stores/articles';
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';

const store = useArticlesStore();
const route = useRoute();
const { t } = useI18n();

useHead({
  title: () => t('sidebar.articles'),
  meta: [
    { name: 'description', content: () => t('articles.searchPlaceholder') },
    { property: 'og:title', content: () => t('sidebar.articles') },
  ]
});

const searchQuery = ref('');
const selectedCategory = ref((route.query.category as string) || '');

const filteredArticles = computed(() => {
  let result = store.articles;

  if (searchQuery.value) {
    result = store.search(searchQuery.value);
  }

  if (selectedCategory.value) {
    result = result.filter(a => a.category === selectedCategory.value);
  }

  return result;
});
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ t('articles.title') }}</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">
          {{ t('articles.showing', { filtered: filteredArticles.length, total: store.articles.length }) }}
        </p>
      </div>
    </header>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex-1 relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="t('articles.searchPlaceholder')"
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white"
        />
      </div>
      <div class="w-full md:w-64">
        <select 
          v-model="selectedCategory"
          class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white appearance-none"
        >
          <option value="">{{ t('articles.allCategories') }}</option>
          <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- Article List -->
    <div v-if="store.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
    </div>
    
    <div v-else-if="filteredArticles.length === 0" class="text-center py-20">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 dark:text-white">{{ t('articles.notFound') }}</h3>
      <p class="text-slate-500 mt-1">{{ t('articles.notFoundDesc') }}</p>
      <button @click="searchQuery = ''; selectedCategory = ''" class="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
        {{ t('articles.clearFilters') }}
      </button>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <RouterLink 
        v-for="article in filteredArticles" 
        :key="article.id"
        :to="`/article/${article.slug}`"
        class="block p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-md group"
      >
        <div class="flex flex-col md:flex-row justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
              {{ article.title }}
            </h2>
            <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {{ article.category }}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {{ article.outgoingLinks.length + article.backlinks.length }} {{ t('articles.connections') }}
              </span>
            </div>
            <!-- Snippet -->
            <p class="mt-3 text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
              {{ article.content.replace(/[#*\[\]`]/g, '').substring(0, 150) }}...
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
