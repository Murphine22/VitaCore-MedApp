import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft } from 'lucide-react';
import { navItems } from './navItems.js';
import { useUiStore } from '../../store/uiStore.js';

export default function CommandPalette() {
  const { commandOpen, setCommandOpen, toggleTheme } = useUiStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const commands = useMemo(
    () => [
      ...navItems.map((n) => ({ label: `Go to ${n.label}`, icon: n.icon, action: () => navigate(n.to) })),
      { label: 'Toggle theme', icon: Search, action: toggleTheme },
    ],
    [navigate, toggleTheme]
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === 'Escape') setCommandOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setCommandOpen]);

  useEffect(() => {
    if (!commandOpen) setQuery('');
  }, [commandOpen]);

  function run(cmd) {
    cmd.action();
    setCommandOpen(false);
  }

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />
          <motion.div
            className="card relative z-10 w-full max-w-lg overflow-hidden"
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
          >
            <div className="flex items-center gap-3 border-b border-ink-200/70 px-4 py-3 dark:border-ink-800/70">
              <Search className="h-4 w-4 text-ink-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-500">No commands found</p>
              )}
              {filtered.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => run(cmd)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-brand-500/10"
                >
                  <cmd.icon className="h-4 w-4 text-brand-500" />
                  <span className="flex-1">{cmd.label}</span>
                  <CornerDownLeft className="h-3.5 w-3.5 text-ink-400" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
