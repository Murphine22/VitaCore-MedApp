import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';

export default function DataTable({ columns, rows, onEdit, onDelete, renderMobile }) {
  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200/70 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800/70">
              {columns.map((col) => (
                <th key={col.key} className={`whitespace-nowrap px-4 py-3 font-semibold ${col.thClass || ''}`}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.3) }}
                className="border-b border-ink-100 transition-colors last:border-0 hover:bg-brand-500/5 dark:border-ink-800/50"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 align-middle ${col.tdClass || ''}`}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-500/10 hover:text-brand-600"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="rounded-lg p-2 text-ink-500 transition hover:bg-red-500/10 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-ink-100 md:hidden dark:divide-ink-800/50">
        {rows.map((row) => (
          <div key={row._id} className="p-4">
            {renderMobile ? (
              renderMobile(row)
            ) : (
              <div className="space-y-1">
                {columns.map((col) => (
                  <div key={col.key} className="flex justify-between gap-3 text-sm">
                    <span className="text-ink-500">{col.header}</span>
                    <span className="text-right">{col.render ? col.render(row) : row[col.key] ?? '—'}</span>
                  </div>
                ))}
              </div>
            )}
            {(onEdit || onDelete) && (
              <div className="mt-3 flex gap-2">
                {onEdit && (
                  <button onClick={() => onEdit(row)} className="btn-ghost flex-1 py-2 text-xs">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(row)} className="btn-danger flex-1 py-2 text-xs">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
