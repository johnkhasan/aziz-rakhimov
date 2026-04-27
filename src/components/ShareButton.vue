<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  title: string;
  slug: string;
}>();

const { t } = useI18n();

const isOpen = ref(false);
const showToast = ref(false);

const url = computed(() => `https://azizrakhimov.uz/article/${props.slug}`);
const encodedUrl = computed(() => encodeURIComponent(url.value));
const encodedTitle = computed(() => encodeURIComponent(props.title));

const nativeShareAvailable = computed(() => !!navigator.share);

const toggleDropdown = () => {
  // Try using native web share first (mobile standard)
  if (nativeShareAvailable.value) {
    navigator.share({
      title: props.title,
      url: url.value
    }).catch(console.error);
    return;
  }
  
  isOpen.value = !isOpen.value;
};

const closeDropdown = (e: MouseEvent) => {
  if (isOpen.value && !(e.target as Element).closest('.share-container')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(url.value);
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
    isOpen.value = false;
  } catch (err) {
    console.error('Failed to copy', err);
  }
};

const shareLinks = computed(() => [
  {
    name: 'Telegram',
    url: `https://t.me/share/url?url=${encodedUrl.value}&text=${encodedTitle.value}`,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 10-4 4 6 6 4-16-18 7 4 2 2 6 3-4"/></svg>',
    color: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
  },
  {
    name: 'Twitter (X)',
    url: `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
    color: 'text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
  },
  {
    name: 'LinkedIn',
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
    color: 'text-blue-700 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
  },
  {
    name: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    color: 'text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
  },
  {
    name: 'WhatsApp',
    url: `https://api.whatsapp.com/send?text=${encodedTitle.value}%20${encodedUrl.value}`,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    color: 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
  }
]);

</script>

<template>
  <div class="relative inline-block share-container z-20">
    <button 
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm border border-slate-200 dark:border-slate-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {{ t('article.share', 'Ulashish') }}
    </button>

    <div 
      v-if="isOpen" 
      class="absolute right-0 lg:right-auto lg:left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden animate-fade-in origin-top-right lg:origin-top-left"
    >
      <div class="p-1.5 space-y-0.5">
        <a 
          v-for="link in shareLinks" 
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium"
          :class="link.color"
          @click="isOpen = false"
        >
          <div class="w-5 h-5 flex items-center justify-center" v-html="link.icon"></div>
          {{ link.name }}
        </a>

        <div class="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>

        <button 
          @click="copyLink"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {{ t('article.copyLink', 'Nusxa olish') }}
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <Teleport to="body">
      <div 
        v-if="showToast"
        class="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-fade-in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium text-sm">{{ t('article.linkCopied', 'Nusxa olindi!') }}</span>
      </div>
    </Teleport>
  </div>
</template>
