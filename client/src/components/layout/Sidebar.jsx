import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../ui/Logo.jsx';
import { navItems } from './navItems.js';
import { useUiStore } from '../../store/uiStore.js';

function NavList({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) => clsx('nav-link', isActive && 'nav-link-active')}
        >
          <item.icon className="h-[18px] w-[18px]" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function CareCard() {
  return (
    <div className="mx-3 mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white shadow-glow">
      <HeartPulse className="h-6 w-6" />
      <p className="mt-2 font-display text-sm font-bold">Care, amplified.</p>
      <p className="mt-1 text-xs text-white/80">
        Every record you keep is a life handled with intention.
      </p>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebar } = useUiStore();

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-200/70 bg-white/60 py-5 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-900/40 lg:flex">
        <div className="px-5 pb-6">
          <Logo />
        </div>
        <NavList />
        <CareCard />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebar(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white py-5 dark:bg-ink-900 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between px-5 pb-6">
                <Logo />
                <button className="btn-ghost rounded-lg p-2" onClick={() => setSidebar(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavList onNavigate={() => setSidebar(false)} />
              <CareCard />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
