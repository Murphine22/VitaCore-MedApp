import { useState } from 'react';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Moon, Sun, Database, RefreshCw, Shield, Server } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/data/PageHeader.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import { useUiStore } from '../store/uiStore.js';
import { useAuthStore } from '../store/authStore.js';
import { dataService } from '../lib/dataService.js';

function Row({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-100 py-4 last:border-0 dark:border-ink-800/50">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-ink-500">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useUiStore();
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [resetting, setResetting] = useState(false);

  function handleReset() {
    setResetting(true);
    dataService.resetDemo();
    qc.invalidateQueries();
    setTimeout(() => {
      setResetting(false);
      toast.success('Demo data reset to defaults');
    }, 400);
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Personalize your VitaCore workspace" icon={SettingsIcon} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar name={user?.name} size="lg" />
            <p className="mt-3 font-display text-lg font-bold">{user?.name}</p>
            <p className="text-sm text-ink-500">{user?.email}</p>
            <span className="badge mt-3 bg-brand-500/15 capitalize text-brand-600 dark:text-brand-300">
              <Shield className="h-3 w-3" /> {user?.role}
            </span>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="mb-2 font-display text-lg font-bold">Preferences</h3>
          <Row icon={theme === 'dark' ? Moon : Sun} title="Appearance" desc="Switch between light and dark themes">
            <button onClick={toggleTheme} className="btn-ghost">
              {theme === 'dark' ? <><Sun className="h-4 w-4" /> Light</> : <><Moon className="h-4 w-4" /> Dark</>}
            </button>
          </Row>

          <Row icon={Server} title="Data mode" desc="Where VitaCore reads and writes data">
            <span className="badge bg-ink-500/15 capitalize text-ink-600 dark:text-ink-300">
              {dataService.mode === 'api' ? 'Live API' : 'Demo (local)'}
            </span>
          </Row>

          {dataService.mode === 'demo' && (
            <Row icon={Database} title="Reset demo data" desc="Restore all sample records to defaults">
              <button onClick={handleReset} className="btn-ghost" disabled={resetting}>
                <RefreshCw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} /> Reset
              </button>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}
