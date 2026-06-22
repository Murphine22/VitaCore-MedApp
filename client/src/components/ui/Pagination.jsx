import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const go = (p) => onPageChange(Math.min(totalPages, Math.max(1, p)));

  // Compact window of page numbers around the current page.
  const pages = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-ink-500">
        Showing <span className="font-semibold text-ink-700 dark:text-ink-200">{from}–{to}</span> of{' '}
        <span className="font-semibold text-ink-700 dark:text-ink-200">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="btn-ghost px-2.5 py-2 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {start > 1 && (
          <>
            <button onClick={() => go(1)} className="btn-ghost min-w-9 px-3 py-2 text-sm">1</button>
            {start > 2 && <span className="px-1 text-ink-400">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            className={`min-w-9 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              p === page
                ? 'bg-brand-500 text-white shadow-glow'
                : 'text-ink-600 hover:bg-brand-500/10 dark:text-ink-300'
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-ink-400">…</span>}
            <button onClick={() => go(totalPages)} className="btn-ghost min-w-9 px-3 py-2 text-sm">
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="btn-ghost px-2.5 py-2 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
