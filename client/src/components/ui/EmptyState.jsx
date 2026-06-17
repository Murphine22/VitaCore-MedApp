import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
        <Icon className="h-8 w-8" />
      </div>
      <div>
        <p className="font-display text-lg font-bold">{title}</p>
        {message && <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-200/60">{message}</p>}
      </div>
      {action}
    </div>
  );
}
