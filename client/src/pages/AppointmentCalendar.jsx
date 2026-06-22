import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, List } from 'lucide-react';
import PageHeader from '../components/data/PageHeader.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import { CardGridSkeleton } from '../components/ui/Skeleton.jsx';
import { useList } from '../hooks/useResource.js';
import { formatDate } from '../lib/format.js';

const STATUS_DOT = {
  scheduled: 'bg-brand-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-red-500',
  'no-show': 'bg-orange-500',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AppointmentCalendar() {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const { data: appointments = [], isLoading } = useList('appointments', { limit: 500 });

  const byDay = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      if (!a.date) return;
      const key = format(parseISO(a.date), 'yyyy-MM-dd');
      (map[key] ||= []).push(a);
    });
    return map;
  }, [appointments]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const selectedKey = format(selected, 'yyyy-MM-dd');
  const selectedAppts = (byDay[selectedKey] || []).slice().sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div>
      <PageHeader
        title="Appointment Calendar"
        subtitle="A month-at-a-glance view of every scheduled visit"
        icon={CalendarDays}
        actions={
          <Link to="/app/appointments" className="btn-ghost">
            <List className="h-4 w-4" /> List view
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoading ? (
            <CardGridSkeleton count={1} />
          ) : (
            <div className="card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{format(cursor, 'MMMM yyyy')}</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCursor((c) => subMonths(c, 1))} className="btn-ghost px-2.5 py-2" aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => { setCursor(new Date()); setSelected(new Date()); }} className="btn-ghost px-3 py-2 text-sm">
                    Today
                  </button>
                  <button onClick={() => setCursor((c) => addMonths(c, 1))} className="btn-ghost px-2.5 py-2" aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-500">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const dayAppts = byDay[key] || [];
                  const inMonth = isSameMonth(day, cursor);
                  const isSelected = isSameDay(day, selected);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <button
                      key={key}
                      onClick={() => setSelected(day)}
                      className={`flex min-h-16 flex-col items-start gap-1 rounded-xl border p-1.5 text-left transition sm:min-h-20 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/10'
                          : 'border-ink-100 hover:bg-brand-500/5 dark:border-ink-800/50'
                      } ${inMonth ? '' : 'opacity-40'}`}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday ? 'bg-brand-500 text-white' : 'text-ink-600 dark:text-ink-300'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      <div className="flex flex-wrap gap-0.5">
                        {dayAppts.slice(0, 4).map((a) => (
                          <span key={a._id} className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[a.status] || 'bg-ink-400'}`} />
                        ))}
                      </div>
                      {dayAppts.length > 0 && (
                        <span className="mt-auto hidden text-[10px] font-medium text-ink-500 sm:block">
                          {dayAppts.length} appt{dayAppts.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
                {Object.entries(STATUS_DOT).map(([status, dot]) => (
                  <span key={status} className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${dot}`} /> <span className="capitalize">{status}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <motion.div
          key={selectedKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5"
        >
          <h3 className="font-display text-lg font-bold">{format(selected, 'EEEE, dd MMM')}</h3>
          <p className="mb-4 text-sm text-ink-500">
            {selectedAppts.length} appointment{selectedAppts.length === 1 ? '' : 's'}
          </p>
          {selectedAppts.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-500">No appointments this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedAppts.map((a) => (
                <div key={a._id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-800/50">
                  <Avatar name={a.patientName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.patientName}</p>
                    <p className="truncate text-xs text-ink-500">{a.doctorName} · {a.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold">{a.time || '—'}</p>
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs text-ink-400">Showing visits for {formatDate(selected)}.</p>
        </motion.div>
      </div>
    </div>
  );
}
