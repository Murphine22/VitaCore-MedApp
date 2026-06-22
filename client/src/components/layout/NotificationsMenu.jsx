import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CalendarDays, Receipt, Pill } from 'lucide-react';
import { useList } from '../../hooks/useResource.js';
import { formatDate } from '../../lib/format.js';

const META = {
  appointment: { icon: CalendarDays, color: 'text-amber-500', to: '/app/appointments' },
  invoice: { icon: Receipt, color: 'text-brand-500', to: '/app/billing' },
  prescription: { icon: Pill, color: 'text-violet-500', to: '/app/prescriptions' },
};

function timeOf(record) {
  return new Date(record.createdAt || record.date || 0).getTime();
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const { data: appointments = [] } = useList('appointments', { sort: '-createdAt', limit: 6 });
  const { data: invoices = [] } = useList('invoices', { sort: '-createdAt', limit: 6 });
  const { data: prescriptions = [] } = useList('prescriptions', { sort: '-createdAt', limit: 6 });

  const items = useMemo(() => {
    const merged = [
      ...appointments.map((a) => ({
        id: a._id,
        type: 'appointment',
        title: `${a.patientName} · ${a.department || 'Appointment'}`,
        subtitle: `with ${a.doctorName} — ${a.status}`,
        when: a.date,
        t: timeOf(a),
      })),
      ...invoices.map((i) => ({
        id: i._id,
        type: 'invoice',
        title: `${i.invoiceNo} · ${i.patientName}`,
        subtitle: `${i.status} invoice`,
        when: i.createdAt || i.dueDate,
        t: timeOf(i),
      })),
      ...prescriptions.map((p) => ({
        id: p._id,
        type: 'prescription',
        title: `${p.patientName} · ${p.diagnosis || 'Prescription'}`,
        subtitle: `by ${p.doctorName} — ${p.status}`,
        when: p.date,
        t: timeOf(p),
      })),
    ];
    return merged.sort((a, b) => b.t - a.t).slice(0, 8);
  }, [appointments, invoices, prescriptions]);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost relative rounded-lg p-2"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="card absolute right-0 top-12 z-50 w-80 overflow-hidden p-0"
          >
            <div className="flex items-center justify-between border-b border-ink-200/70 px-4 py-3 dark:border-ink-800/70">
              <p className="font-display text-sm font-bold">Activity</p>
              <span className="badge bg-brand-500/15 text-brand-600 dark:text-brand-300">{items.length} recent</span>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {items.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-500">No recent activity</p>
              )}
              {items.map((item) => {
                const meta = META[item.type];
                const Icon = meta.icon;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      navigate(meta.to);
                      setOpen(false);
                    }}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-brand-500/10"
                  >
                    <span className={`mt-0.5 ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.title}</span>
                      <span className="block truncate text-xs text-ink-500 capitalize">{item.subtitle}</span>
                    </span>
                    <span className="shrink-0 text-[10px] text-ink-400">{formatDate(item.when)}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
