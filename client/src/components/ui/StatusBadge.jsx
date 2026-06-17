const STYLES = {
  // patients
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  admitted: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  discharged: 'bg-ink-500/15 text-ink-600 dark:text-ink-300',
  // appointments
  scheduled: 'bg-brand-500/15 text-brand-600 dark:text-brand-300',
  completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  cancelled: 'bg-red-500/15 text-red-600 dark:text-red-400',
  'no-show': 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  // invoices
  paid: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  overdue: 'bg-red-500/15 text-red-600 dark:text-red-400',
  // doctors
  available: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  busy: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'on-leave': 'bg-ink-500/15 text-ink-600 dark:text-ink-300',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-ink-500/15 text-ink-600 dark:text-ink-300';
  return (
    <span className={`badge ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
