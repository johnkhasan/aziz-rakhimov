<script setup lang="ts">
import { useArticlesStore } from '@/stores/articles';
import { computed, watch, ref, nextTick } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';

const store = useArticlesStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const contentRef = ref<HTMLElement | null>(null);

const article = computed(() => {
  return store.getArticleBySlug(route.params.slug as string);
});

const backlinks = computed(() => {
  if (!article.value) return [];
  return article.value.backlinks
    .map(slug => store.getArticleBySlug(slug))
    .filter(a => a !== undefined);
});

const outgoingLinks = computed(() => {
  if (!article.value) return [];
  return article.value.outgoingLinks
    .map(slug => store.getArticleBySlug(slug))
    .filter(a => a !== undefined);
});

// Calculate reading time roughly (words / 200 = minutes)
const readingTime = computed(() => {
  if (!article.value) return 1;
  const wordCount = article.value.content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
});

// Dynamic SEO Head Tags
useHead({
  title: () => article.value ? article.value.title : t('article.notFound'),
  meta: [
    {
      name: 'description',
      content: () => article.value 
        ? article.value.content.replace(/[#*\[\]`]/g, '').substring(0, 155) + '...'
        : ''
    },
    { property: 'og:title', content: () => article.value?.title },
    { 
      property: 'og:description', 
      content: () => article.value ? article.value.content.replace(/[#*\[\]`]/g, '').substring(0, 155) + '...' : ''
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: () => `https://azizrakhimov.uz/article/${article.value?.slug}` },
    { property: 'article:tag', content: () => article.value?.tags?.join(', ') },
    { property: 'article:section', content: () => article.value?.category }
  ],
  link: [
    { rel: 'canonical', href: () => `https://azizrakhimov.uz/article/${article.value?.slug}` }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => article.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.value.title,
        'description': article.value.content.replace(/[#*\[\]`]/g, '').substring(0, 155) + '...',
        'author': {
          '@type': 'Person',
          'name': 'Aziz Rakhimov',
          'url': 'https://azizrakhimov.uz'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Aziz Rakhimov',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://azizrakhimov.uz/vite.svg'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `https://azizrakhimov.uz/article/${article.value.slug}`
        }
      }) : ''
    }
  ]
});

// Intercept wikilink clicks
const handleContentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'A' && target.classList.contains('wikilink')) {
    e.preventDefault();
    const href = target.getAttribute('href');
    if (href) {
      router.push(href);
    }
  }
};

watch(() => article.value, async () => {
  await nextTick();
  // We can do syntax highlighting or other post-processing here if needed
});
</script>

<template>
  <div v-if="store.loading" class="flex justify-center py-20">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
  </div>
  
  <div v-else-if="!article" class="text-center py-20 animate-fade-in">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t('article.notFound') }}</h2>
    <p class="text-slate-500 mt-2">{{ t('article.notFoundDesc') }}</p>
    <RouterLink to="/articles" class="mt-6 inline-block px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
      {{ t('article.backToArticles') }}
    </RouterLink>
  </div>

  <div v-else class="flex flex-col lg:flex-row gap-8 animate-fade-in pb-20">
    <!-- Main Content -->
    <article class="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
      <header class="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3 mb-4">
          <RouterLink 
            :to="{ path: '/articles', query: { category: article.category } }"
            class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {{ article.category }}
          </RouterLink>
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {{ article.title }}
        </h1>
        
        <div class="flex items-center gap-4 mt-4 text-sm text-slate-500">
          <span class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ readingTime }} min read
          </span>
        </div>
        
        <div v-if="article.tags.length > 0" class="flex flex-wrap gap-2 mt-6">
          <span v-for="tag in article.tags" :key="tag" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">
            #{{ tag }}
          </span>
        </div>
      </header>

      <!-- Markdown Content -->
      <div 
        ref="contentRef"
        @click="handleContentClick"
        class="prose prose-slate dark:prose-invert prose-emerald max-w-none prose-headings:font-bold prose-a:text-emerald-600 dark:prose-a:text-emerald-400 hover:prose-a:text-emerald-500 prose-img:rounded-xl"
        v-html="article.html"
      ></div>
    </article>

    <!-- Sidebar / Connections -->
    <aside class="w-full lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {{ t('article.linkedMentions') }}
        </h3>
        
        <div v-if="backlinks.length === 0" class="text-sm text-slate-500 italic">
          {{ t('article.noLinkedMentions') }}
        </div>
        <ul v-else class="space-y-3">
          <li v-for="link in backlinks" :key="link?.id">
            <RouterLink :to="`/article/${link?.slug}`" class="block group">
              <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {{ link?.title }}
              </h4>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {{ t('article.outgoingLinks') }}
        </h3>
        
        <div v-if="outgoingLinks.length === 0" class="text-sm text-slate-500 italic">
          {{ t('article.noOutgoingLinks') }}
        </div>
        <ul v-else class="space-y-3">
          <li v-for="link in outgoingLinks" :key="link?.id">
            <RouterLink :to="`/article/${link?.slug}`" class="block group">
              <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {{ link?.title }}
              </h4>
            </RouterLink>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style>
.wikilink {
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dashed currentColor;
  padding-bottom: 1px;
}
.wikilink:hover {
  border-bottom-style: solid;
}
</style>
