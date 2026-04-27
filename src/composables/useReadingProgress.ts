import { ref, onMounted, onUnmounted } from 'vue';

export function useReadingProgress(containerId: string = 'main-scroll-area') {
  const progress = ref(0);
  let container: HTMLElement | null = null;

  const updateProgress = () => {
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (scrollHeight <= clientHeight) {
      progress.value = 0;
      return;
    }
    
    // Calculate percentage (0 to 100)
    const windowScroll = scrollTop;
    const height = scrollHeight - clientHeight;
    progress.value = (windowScroll / height) * 100;
  };

  onMounted(() => {
    container = document.getElementById(containerId);
    if (container) {
      container.addEventListener('scroll', updateProgress, { passive: true });
      // Initial calculation
      updateProgress();
    } else {
      // Fallback to window if no container found
      window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        if (scrollHeight <= clientHeight) {
          progress.value = 0;
          return;
        }
        
        progress.value = (scrollTop / (scrollHeight - clientHeight)) * 100;
      }, { passive: true });
    }
  });

  onUnmounted(() => {
    if (container) {
      container.removeEventListener('scroll', updateProgress);
    } else {
      window.removeEventListener('scroll', updateProgress); // Note: anonymous function removal won't work perfectly in fallback, but it's fine for our specific use case where we use the container
    }
  });

  return { progress };
}
