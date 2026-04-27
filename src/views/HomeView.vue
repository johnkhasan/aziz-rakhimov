<script setup lang="ts">
import { useArticlesStore } from '@/stores/articles';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const store = useArticlesStore();
const { t } = useI18n();

const stats = computed(() => [
  { name: t('home.totalArticles'), value: store.articles.length },
  { name: t('home.categories'), value: store.categories.length },
  { name: t('home.tags'), value: store.tags.length },
]);
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <header class="mb-10">
      <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        {{ t('home.title') }} <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">{{ t('home.subtitle') }}</span>
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
        {{ t('home.description') }}
      </p>
    </header>

    <div v-if="store.loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>

    <template v-else>
      <!-- Stats -->
      <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div v-for="stat in stats" :key="stat.name" class="px-6 py-5 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <dt class="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{{ stat.name }}</dt>
          <dd class="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{{ stat.value }}</dd>
        </div>
      </dl>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <!-- Categories -->
        <section>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {{ t('home.categories') }}
          </h2>
          <div class="flex flex-wrap gap-2">
            <RouterLink 
              v-for="cat in store.categories" 
              :key="cat"
              :to="{ path: '/articles', query: { category: cat } }"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
            >
              {{ cat }}
            </RouterLink>
          </div>
        </section>

        <!-- Most Linked -->
        <section>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {{ t('home.keyArticles') }}
          </h2>
          <ul class="space-y-3">
            <li v-for="article in store.mostLinkedArticles.slice(0, 5)" :key="article.id">
              <RouterLink 
                :to="`/article/${article.slug}`"
                class="block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group"
              >
                <h3 class="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {{ article.title }}
                </h3>
                <div class="mt-1 flex items-center gap-4 text-xs text-slate-500">
                  <span>{{ article.category }}</span>
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {{ article.backlinks.length }} {{ t('home.references') }}
                  </span>
                </div>
              </RouterLink>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </div>
</template>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
