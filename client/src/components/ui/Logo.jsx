import { Activity } from 'lucide-react';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
        <Activity className="h-5 w-5" strokeWidth={2.5} />
        <span className="absolute inset-0 rounded-xl animate-pulse-ring" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display text-lg font-extrabold tracking-tight">
            Vita<span className="gradient-text">Core</span>
          </p>
          <p className="-mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink-500">
            Med System
          </p>
        </div>
      )}
    </div>
  );
}
