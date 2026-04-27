<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useArticlesStore } from './stores/articles';
import { useAppStore } from './stores/app';
import { useI18n } from 'vue-i18n';

const store = useArticlesStore();
const appStore = useAppStore();
const { t, locale } = useI18n();

onMounted(() => {
  store.fetchArticles();
});

const changeLocale = () => {
  const newLocale = locale.value === 'uz' ? 'en' : 'uz';
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
    
    <!-- Mobile/Tablet Sidebar Backdrop -->
    <div 
      v-if="appStore.sidebarOpen" 
      @click="appStore.toggleSidebar"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
        appStore.sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      ]"
    >
      <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
            Aziz Rakhimov
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('home.subtitle') }}</p>
        </div>
        <!-- Close button mobile/tablet only -->
        <button @click="appStore.toggleSidebar" class="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav class="flex-1 overflow-y-auto p-4 space-y-1">
        <RouterLink 
          to="/" 
          @click="appStore.sidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors font-medium"
          active-class="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ t('sidebar.home') }}
        </RouterLink>
        <RouterLink 
          to="/articles" 
          @click="appStore.sidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors font-medium"
          active-class="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
          </svg>
          {{ t('sidebar.articles') }}
        </RouterLink>
        <RouterLink 
          to="/graph" 
          @click="appStore.sidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors font-medium"
          active-class="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ t('sidebar.graph') }}
        </RouterLink>
      </nav>

      <!-- Bottom Settings -->
      <div class="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <button 
          @click="appStore.cycleTheme()" 
          class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          :title="`Theme: ${appStore.theme}`"
        >
          <!-- System Icon -->
          <svg v-if="appStore.theme === 'system'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <!-- Dark Icon -->
          <svg v-else-if="appStore.theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <!-- Light Icon -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="text-xs font-medium uppercase w-12 text-left">{{ appStore.theme }}</span>
        </button>

        <button 
          @click="changeLocale"
          class="px-3 py-1 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        >
          {{ locale === 'uz' ? 'UZ' : 'EN' }}
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
      <!-- Mobile/Tablet header -->
      <header class="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-30">
        <div class="flex items-center gap-3">
          <button @click="appStore.toggleSidebar" class="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500 truncate max-w-[200px]">
            Aziz Rakhimov
          </h1>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto w-full h-full p-4 md:p-8">
        <div class="max-w-5xl mx-auto h-full flex flex-col">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>
