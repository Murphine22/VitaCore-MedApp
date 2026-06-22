import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  CalendarDays,
  Wallet,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useDashboardStats } from '../hooks/useResource.js';
import { useAuthStore } from '../store/authStore.js';
import { formatNaira, formatDate } from '../lib/format.js';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const BAR_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
const STATUS_COLORS = {
  scheduled: '#06b6d4',
  completed: '#10b981',
  cancelled: '#ef4444',
  'no-show': '#f59e0b',
};
const REVENUE_COLORS = { paid: '#10b981', pending: '#f59e0b', overdue: '#ef4444' };

function StatCard({ icon: Icon, label, value, accent, format, delay, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card relative overflow-hidden p-5"
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 ${accent}`} />
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent} text-white shadow-glow`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="badge bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" /> {trend}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-extrabold">
        <AnimatedCounter value={value} format={format} />
      </p>
      <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-200/60">{label}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();
  const user = useAuthStore((s) => s.user);

  if (isLoading || !data) return <Spinner label="Loading dashboard…" />;

  const {
    totals,
    revenueTrend,
    appointmentsByDepartment,
    appointmentsByStatus = [],
    revenueByStatus = [],
    recentAppointments,
  } = data;
  const statusData = appointmentsByStatus.map((s) => ({ ...s, name: s.status }));
  const totalAppts = appointmentsByStatus.reduce((s, x) => s + x.count, 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-300">{greeting},</p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {user?.name?.split(' ').slice(0, 2).join(' ') || 'Welcome'} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-200/60">
          Here&apos;s the pulse of your hospital today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Patients" value={totals.patients} accent="bg-gradient-to-br from-brand-500 to-brand-700" delay={0.02} trend="+12%" />
        <StatCard icon={Stethoscope} label="Active Doctors" value={totals.doctors} accent="bg-gradient-to-br from-violet-500 to-indigo-700" delay={0.08} />
        <StatCard icon={CalendarDays} label="Appointments" value={totals.appointments} accent="bg-gradient-to-br from-amber-500 to-orange-700" delay={0.14} trend={`${totals.appointmentsToday} today`} />
        <StatCard icon={Wallet} label="Revenue (paid)" value={totals.revenue} format={formatNaira} accent="bg-gradient-to-br from-emerald-500 to-teal-700" delay={0.2} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="card p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Revenue Trend</h3>
              <p className="text-sm text-ink-500">Invoiced revenue over recent months</p>
            </div>
            <Activity className="h-5 w-5 text-brand-500" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v / 1000}k`} />
              <Tooltip
                formatter={(v) => formatNaira(v)}
                contentStyle={{ borderRadius: 12, border: '1px solid #94a3b833', background: '#0f172a', color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold">By Department</h3>
            <p className="text-sm text-ink-500">Appointment distribution</p>
          </div>
          {appointmentsByDepartment.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-500">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={appointmentsByDepartment} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="department" width={88} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#94a3b81a' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #94a3b833', background: '#0f172a', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {appointmentsByDepartment.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="card p-5"
        >
          <div className="mb-2">
            <h3 className="font-display text-lg font-bold">Appointment Status</h3>
            <p className="text-sm text-ink-500">Distribution across {totalAppts} visits</p>
          </div>
          {statusData.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-500">No data yet</p>
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {statusData.map((s) => (
                      <Cell key={s.status} fill={STATUS_COLORS[s.status] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #94a3b833', background: '#0f172a', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-extrabold">{totalAppts}</span>
                <span className="text-xs text-ink-500">total</span>
              </div>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
            {statusData.map((s) => (
              <span key={s.status} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[s.status] || '#94a3b8' }} />
                <span className="capitalize">{s.status}</span> · {s.count}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-5 lg:col-span-2"
        >
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold">Revenue Breakdown</h3>
            <p className="text-sm text-ink-500">Invoiced amount by payment status</p>
          </div>
          {revenueByStatus.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-500">No invoices yet</p>
          ) : (
            <div className="space-y-4">
              {revenueByStatus.map((r) => {
                const max = Math.max(...revenueByStatus.map((x) => x.amount), 1);
                return (
                  <div key={r.status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize font-medium">{r.status}</span>
                      <span className="font-semibold">{formatNaira(r.amount)}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-200/60 dark:bg-ink-800/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.amount / max) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: REVENUE_COLORS[r.status] || '#06b6d4' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="card mt-6 p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Recent Appointments</h3>
          <Link to="/app/appointments" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentAppointments.length === 0 && (
            <p className="py-6 text-center text-sm text-ink-500">No appointments yet</p>
          )}
          {recentAppointments.map((a) => (
            <div
              key={a._id}
              className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 transition hover:bg-brand-500/5 dark:border-ink-800/50"
            >
              <Avatar name={a.patientName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.patientName}</p>
                <p className="truncate text-xs text-ink-500">
                  {a.doctorName} · {a.department || '—'}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-ink-500">{formatDate(a.date)}</p>
                <p className="text-xs text-ink-400">{a.time}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
