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
} from 'recharts';
import { useDashboardStats } from '../hooks/useResource.js';
import { useAuthStore } from '../store/authStore.js';
import { formatNaira, formatDate } from '../lib/format.js';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const BAR_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

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

  const { totals, revenueTrend, appointmentsByDepartment, recentAppointments } = data;
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="card mt-6 p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Recent Appointments</h3>
          <ArrowUpRight className="h-5 w-5 text-ink-400" />
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
