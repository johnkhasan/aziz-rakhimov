<script setup lang="ts">
import { useArticlesStore } from '@/stores/articles';
import { onMounted, ref, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import cytoscape from 'cytoscape';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';

const store = useArticlesStore();
const router = useRouter();
const { t } = useI18n();

useHead({
  title: () => t('sidebar.graph'),
  meta: [
    { name: 'description', content: () => t('graph.description') },
    { property: 'og:title', content: () => t('sidebar.graph') },
  ]
});

const containerRef = ref<HTMLElement | null>(null);
const cy = ref<cytoscape.Core | null>(null);
const loadingGraph = ref(true);

const initGraph = () => {
  if (!containerRef.value || store.articles.length === 0) return;
  
  loadingGraph.value = true;
  
  // Prepare elements
  const elements: cytoscape.ElementDefinition[] = [];
  const addedNodes = new Set<string>();

  // Colors based on category
  const categories = store.categories;
  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1'
  ];
  
  const getCategoryColor = (category: string) => {
    const index = categories.indexOf(category);
    return colors[index % colors.length] || '#94a3b8';
  };

  // Add nodes
  store.articles.forEach(article => {
    if (!addedNodes.has(article.slug)) {
      elements.push({
        data: {
          id: article.slug,
          label: article.title,
          category: article.category,
          color: getCategoryColor(article.category),
          weight: article.backlinks.length + article.outgoingLinks.length + 1
        }
      });
      addedNodes.add(article.slug);
    }
  });

  // Add edges
  const addedEdges = new Set<string>();
  store.articles.forEach(article => {
    article.outgoingLinks.forEach(targetSlug => {
      // Only add edge if target node exists
      const edgeId = `${article.slug}-${targetSlug}`;
      if (addedNodes.has(targetSlug) && !addedEdges.has(edgeId)) {
        addedEdges.add(edgeId);
        elements.push({
          data: {
            id: edgeId,
            source: article.slug,
            target: targetSlug
          }
        });
      }
    });
  });

  cy.value = cytoscape({
    container: containerRef.value,
    elements,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'data(color)',
          'label': 'data(label)',
          'color': '#334155', // Adjust for dark mode later via dynamic update if needed
          'text-valign': 'bottom',
          'text-halign': 'center',
          'text-margin-y': 4,
          'font-size': '10px',
          'font-family': 'Inter, sans-serif',
          'text-outline-width': 2,
          'text-outline-color': '#ffffff',
          'width': 'mapData(weight, 1, 20, 10, 40)',
          'height': 'mapData(weight, 1, 20, 10, 40)',
          'transition-property': 'background-color, width, height, border-width',
          'transition-duration': 200,
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 1,
          'line-color': '#cbd5e1',
          'curve-style': 'bezier',
          'opacity': 0.6,
          'transition-property': 'line-color, opacity, width',
          'transition-duration': 200,
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 4,
          'border-color': '#0f172a',
          'border-opacity': 0.8
        }
      },
      {
        selector: '.highlighted-node',
        style: {
          'background-color': '#0f172a',
          'text-outline-color': '#f8fafc',
          'z-index': 100
        }
      },
      {
        selector: '.highlighted-edge',
        style: {
          'line-color': '#0f172a',
          'width': 2,
          'opacity': 1,
          'z-index': 99
        }
      },
      {
        selector: '.faded',
        style: {
          'opacity': 0.1,
          'text-opacity': 0
        }
      }
    ],
    layout: {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: true,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    },
    minZoom: 0.1,
    maxZoom: 3,
    wheelSensitivity: 0.2
  });

  // Interaction
  cy.value.on('tap', 'node', (evt) => {
    const node = evt.target;
    const id = node.id();
    
    // Highlight connected
    cy.value!.elements().removeClass('highlighted-node highlighted-edge faded');
    
    const connectedEdges = node.connectedEdges();
    const connectedNodes = connectedEdges.connectedNodes();
    
    cy.value!.elements().difference(connectedNodes).difference(connectedEdges).addClass('faded');
    node.addClass('highlighted-node');
    connectedNodes.addClass('highlighted-node');
    connectedEdges.addClass('highlighted-edge');
  });

  cy.value.on('dbltap', 'node', (evt) => {
    const node = evt.target;
    router.push(`/article/${node.id()}`);
  });

  cy.value.on('tap', (evt) => {
    if (evt.target === cy.value) {
      cy.value!.elements().removeClass('highlighted-node highlighted-edge faded');
    }
  });

  // Handle dark mode styles roughly
  if (document.documentElement.classList.contains('dark')) {
    updateDarkModeStyle();
  }

  const layout = cy.value.layout({ name: 'cose' } as any);
  layout.on('layoutstop', () => {
    loadingGraph.value = false;
  });
  
  // if layout stops immediately or cose takes time
  setTimeout(() => { loadingGraph.value = false; }, 2000);
};

const updateDarkModeStyle = () => {
  if (!cy.value) return;
  cy.value.style()
    .selector('node')
    .style({
      'color': '#f8fafc',
      'text-outline-color': '#0f172a'
    })
    .selector('edge')
    .style({
      'line-color': '#334155'
    })
    .selector('node:selected')
    .style({
      'border-color': '#f8fafc'
    })
    .selector('.highlighted-node')
    .style({
      'background-color': '#f8fafc',
      'text-outline-color': '#0f172a'
    })
    .selector('.highlighted-edge')
    .style({
      'line-color': '#f8fafc'
    })
    .update();
};

watch(() => store.loading, (newVal) => {
  if (!newVal) {
    setTimeout(initGraph, 100);
  }
});

onMounted(() => {
  if (!store.loading && store.articles.length > 0) {
    setTimeout(initGraph, 100);
  }
});

onUnmounted(() => {
  if (cy.value) {
    cy.value.destroy();
  }
});
</script>

<template>
  <div class="h-full flex flex-col animate-fade-in relative">
    <header class="mb-4 flex-shrink-0">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ t('graph.title') }}</h1>
      <p class="text-slate-500 mt-1 text-sm">
        {{ t('graph.description') }}
      </p>
    </header>

    <div class="flex-1 min-h-[500px] relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
      <!-- Loading Overlay -->
      <div v-if="loadingGraph" class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center flex-col gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p class="text-slate-500 font-medium">{{ t('graph.simulating') }}</p>
      </div>

      <div ref="containerRef" class="absolute inset-0 z-0"></div>
      
      <!-- Controls -->
      <div class="absolute bottom-4 right-4 z-20 flex gap-2">
        <button 
          @click="cy?.fit()"
          class="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          :title="t('graph.fitScreen')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button 
          @click="cy?.layout({ name: 'cose', randomize: true }).run()"
          class="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          :title="t('graph.recalculate')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
