import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Search, LogOut, Command } from 'lucide-react';
import { useUiStore } from '../../store/uiStore.js';
import { useAuthStore } from '../../store/authStore.js';
import Avatar from '../ui/Avatar.jsx';
import NotificationsMenu from './NotificationsMenu.jsx';

export default function Topbar() {
  const { toggleSidebar, theme, toggleTheme, setCommandOpen } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-200/70 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/60 sm:px-6">
      <button className="btn-ghost rounded-lg p-2 lg:hidden" onClick={toggleSidebar} aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={() => setCommandOpen(true)}
        className="group hidden items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-500 transition hover:border-brand-400 dark:border-ink-700 dark:bg-ink-900 sm:flex"
      >
        <Search className="h-4 w-4" />
        <span>Quick search…</span>
        <kbd className="ml-6 flex items-center gap-0.5 rounded-md border border-ink-200 px-1.5 py-0.5 text-[10px] font-semibold dark:border-ink-700">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setCommandOpen(true)}
          className="btn-ghost rounded-lg p-2 sm:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button onClick={toggleTheme} className="btn-ghost rounded-lg p-2" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <NotificationsMenu />

        <div className="mx-1 hidden h-8 w-px bg-ink-200 dark:bg-ink-800 sm:block" />

        <div className="flex items-center gap-2.5">
          <Avatar name={user?.name} size="sm" />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs capitalize text-ink-500">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-ghost rounded-lg p-2" aria-label="Log out">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
