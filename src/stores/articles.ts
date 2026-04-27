import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Fuse from 'fuse.js';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  html: string;
  outgoingLinks: string[];
  backlinks: string[];
}

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([]);
  const loading = ref(true);

  async function fetchArticles() {
    if (articles.value.length > 0) return;
    loading.value = true;
    try {
      const res = await fetch('/data/articles.json');
      articles.value = await res.json();
    } catch (e) {
      console.error('Failed to fetch articles:', e);
    } finally {
      loading.value = false;
    }
  }

  const getArticleBySlug = computed(() => (slug: string) => {
    return articles.value.find((a) => a.slug === slug);
  });

  const categories = computed(() => {
    const cats = new Set(articles.value.map(a => a.category));
    return Array.from(cats).sort();
  });

  const tags = computed(() => {
    const t = new Set<string>();
    articles.value.forEach(a => a.tags.forEach(tag => t.add(tag)));
    return Array.from(t).sort();
  });

  const mostLinkedArticles = computed(() => {
    return [...articles.value].sort((a, b) => b.backlinks.length - a.backlinks.length).slice(0, 10);
  });

  const fuse = computed(() => new Fuse(articles.value, {
    keys: ['title', 'category', 'tags', 'content'],
    threshold: 0.3,
  }));

  function search(query: string) {
    if (!query) return articles.value;
    return fuse.value.search(query).map(result => result.item);
  }

  return {
    articles,
    loading,
    fetchArticles,
    getArticleBySlug,
    categories,
    tags,
    mostLinkedArticles,
    search,
  };
});
