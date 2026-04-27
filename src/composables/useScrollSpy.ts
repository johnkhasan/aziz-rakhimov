import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export function useScrollSpy(ids: Ref<string[]>, containerId: string = 'main-scroll-area') {
  const activeId = ref<string>('');
  let scrollListenerAdded = false;
  let containerEl: HTMLElement | null = null;

  const onScroll = () => {
    if (!containerEl || ids.value.length === 0) return;
    const containerTop = containerEl.getBoundingClientRect().top;
    
    let currentId = '';
    
    for (const id of ids.value) {
      const el = document.getElementById(id);
      if (el) {
        // Offset by 150px to trigger slightly before the heading reaches the top
        const top = el.getBoundingClientRect().top - containerTop;
        if (top <= 150) {
          currentId = id;
        } else {
          break;
        }
      }
    }
    
    // If we're at the very top, make the first item active
    if (!currentId && ids.value.length > 0) {
      currentId = ids.value[0] || '';
    }
    
    if (activeId.value !== currentId) {
      activeId.value = currentId;
    }
  };

  const init = () => {
    containerEl = document.getElementById(containerId);
    if (containerEl && !scrollListenerAdded) {
      containerEl.addEventListener('scroll', onScroll, { passive: true });
      scrollListenerAdded = true;
    }
  };

  onMounted(() => {
    init();
    // Fallback if rendered slightly later
    setTimeout(init, 500);
  });

  onUnmounted(() => {
    if (containerEl && scrollListenerAdded) {
      containerEl.removeEventListener('scroll', onScroll);
      scrollListenerAdded = false;
    }
  });

  return { activeId, updateSpy: () => { init(); onScroll(); } };
}
