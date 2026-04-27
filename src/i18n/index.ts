import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    sidebar: {
      home: 'Home',
      articles: 'Articles',
      graph: 'Graph View',
      settings: 'Settings'
    },
    home: {
      title: 'Welcome to the',
      subtitle: 'Digital Garden',
      description: 'Explore Aziz Rakhimov\'s thoughts, insights, and structured knowledge connected through a network of interlinked ideas.',
      totalArticles: 'Total Articles',
      categories: 'Categories',
      tags: 'Tags',
      keyArticles: 'Key Articles',
      references: 'references'
    },
    articles: {
      title: 'Articles',
      showing: 'Showing {filtered} of {total} articles',
      searchPlaceholder: 'Search articles, tags, content...',
      allCategories: 'All Categories',
      notFound: 'No articles found',
      notFoundDesc: 'Try adjusting your search or filters.',
      clearFilters: 'Clear filters',
      connections: 'connections'
    },
    article: {
      notFound: 'Article not found',
      notFoundDesc: 'The article you\'re looking for doesn\'t exist or hasn\'t been created yet.',
      backToArticles: 'Back to Articles',
      linkedMentions: 'Linked Mentions',
      noLinkedMentions: 'No articles link to this one.',
      outgoingLinks: 'Outgoing Links',
      noOutgoingLinks: 'This article doesn\'t link to others.'
    },
    graph: {
      title: 'Knowledge Graph',
      description: 'Explore connections between ideas. Click a node to highlight connections. Double click to open the article.',
      simulating: 'Simulating physics...',
      fitScreen: 'Fit to screen',
      recalculate: 'Recalculate layout'
    }
  },
  uz: {
    sidebar: {
      home: 'Bosh sahifa',
      articles: 'Maqolalar',
      graph: 'Xarita (Graph)',
      settings: 'Sozlamalar'
    },
    home: {
      title: 'Xush kelibsiz',
      subtitle: 'Raqamli Bog\'',
      description: 'Aziz Raximovning fikrlari, tushunchalari va bir-biriga bog\'langan g\'oyalar tarmog\'i orqali tuzilgan bilimlarni kashf eting.',
      totalArticles: 'Jami Maqolalar',
      categories: 'Kategoriyalar',
      tags: 'Teglar',
      keyArticles: 'Asosiy Maqolalar',
      references: 'havolalar'
    },
    articles: {
      title: 'Maqolalar',
      showing: '{total} tadan {filtered} ta maqola ko\'rsatilmoqda',
      searchPlaceholder: 'Maqolalar, teglar yoki matn izlang...',
      allCategories: 'Barcha Kategoriyalar',
      notFound: 'Maqola topilmadi',
      notFoundDesc: 'Qidiruv so\'zini yoki filterni o\'zgartirib ko\'ring.',
      clearFilters: 'Filterni tozalash',
      connections: 'bog\'lanishlar'
    },
    article: {
      notFound: 'Maqola topilmadi',
      notFoundDesc: 'Siz izlayotgan maqola mavjud emas yoki hali yaratilmagan.',
      backToArticles: 'Maqolalarga qaytish',
      linkedMentions: 'Bu yerga havolalar',
      noLinkedMentions: 'Hech qaysi maqola bunga havola bermagan.',
      outgoingLinks: 'Chiquvchi havolalar',
      noOutgoingLinks: 'Ushbu maqola boshqasiga havola bermagan.'
    },
    graph: {
      title: 'Bilimlar Xaritasi',
      description: 'G\'oyalar orasidagi bog\'lanishni kashf eting. Tugunni (node) bosib uning aloqalarini ko\'ring. Maqolani ochish uchun ikki marta bosing.',
      simulating: 'Fizika simulyatsiyasi...',
      fitScreen: 'Ekranga moslash',
      recalculate: 'Qayta hisoblash'
    }
  }
};

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'uz',
  fallbackLocale: 'en',
  messages,
});
