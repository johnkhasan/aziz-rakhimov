import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

export const useAppStore = defineStore('app', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system');
  
  const applyTheme = () => {
    const root = document.documentElement;
    const isDark = theme.value === 'dark' || 
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme();
  };
  
  const cycleTheme = () => {
    if (theme.value === 'system') setTheme('light');
    else if (theme.value === 'light') setTheme('dark');
    else setTheme('system');
  };

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = () => {
    if (theme.value === 'system') {
      applyTheme();
    }
  };

  onMounted(() => {
    applyTheme();
    mediaQuery.addEventListener('change', handleSystemChange);
  });

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemChange);
  });

  const sidebarOpen = ref(false);
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  return {
    theme,
    setTheme,
    cycleTheme,
    sidebarOpen,
    toggleSidebar
  };
});
