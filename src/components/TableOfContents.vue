<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { useScrollSpy } from '@/composables/useScrollSpy';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  contentRef: HTMLElement | null;
  articleHtml: string;
}>();

const { t } = useI18n();

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const toc = ref<TocItem[]>([]);
const sectionIds = computed(() => toc.value.map(item => item.id));

const { activeId, updateSpy } = useScrollSpy(sectionIds);

const extractHeadings = async () => {
  await nextTick(); // ensure HTML is rendered
  if (!props.contentRef) return;

  const headings = props.contentRef.querySelectorAll('h2, h3, h4');
  const items: TocItem[] = [];

  headings.forEach((el) => {
    if (el.id) {
      items.push({
        id: el.id,
        // Extract text content excluding the anchor hash (#)
        text: el.textContent?.replace(/#$/, '').trim() || '',
        level: parseInt(el.tagName.replace('H', ''), 10)
      });
    }
  });

  toc.value = items;
  setTimeout(() => updateSpy(), 100);
};

// Re-extract if article HTML changes
watch(() => props.articleHtml, extractHeadings, { immediate: true });
// Also watch the ref in case it gets attached later
watch(() => props.contentRef, extractHeadings);

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  const scrollContainer = document.getElementById('main-scroll-area');
  
  if (el && scrollContainer) {
    const containerTop = scrollContainer.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const currentScroll = scrollContainer.scrollTop;
    
    scrollContainer.scrollTo({
      top: currentScroll + elTop - containerTop - 40,
      behavior: 'smooth'
    });
    
    history.pushState(null, '', `#${id}`);
    activeId.value = id;
  }
};
</script>

<template>
  <div v-if="toc.length > 0" class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
      {{ t('article.tableOfContents', 'Table of Contents') }}
    </h3>
    
    <nav class="toc-nav relative">
      <div class="absolute left-[3px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-800 rounded-full hidden sm:block"></div>
      
      <ul class="space-y-2 relative z-10">
        <li v-for="item in toc" :key="item.id" 
            :class="[
              'transition-all duration-200',
              item.level === 2 ? 'ml-0' : item.level === 3 ? 'ml-3' : 'ml-6'
            ]">
          <button 
            @click="scrollToHeading(item.id)"
            class="text-left w-full relative flex items-center group py-1"
          >
            <!-- Active indicator dot -->
            <span 
              class="absolute left-[1px] w-1.5 h-1.5 rounded-full transition-all duration-300 sm:block hidden"
              :class="activeId === item.id ? 'bg-emerald-500 scale-100' : 'bg-transparent scale-0 group-hover:scale-50 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'"
            ></span>
            
            <span 
              class="text-sm transition-colors duration-200 pl-4 sm:pl-4"
              :class="activeId === item.id ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'"
            >
              {{ item.text }}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
