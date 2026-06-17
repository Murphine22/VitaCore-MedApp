import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export const useUiStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: false,
      commandOpen: false,

      toggleTheme() {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
      initTheme() {
        applyTheme(get().theme);
      },
      setSidebar(open) {
        set({ sidebarOpen: open });
      },
      toggleSidebar() {
        set({ sidebarOpen: !get().sidebarOpen });
      },
      setCommandOpen(open) {
        set({ commandOpen: open });
      },
    }),
    { name: 'vitacore_ui' }
  )
);
