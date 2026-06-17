import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Activity,
  Users,
  CalendarDays,
  Receipt,
  Stethoscope,
  Building2,
  Sparkles,
  Star,
} from 'lucide-react';
import Logo from '../components/ui/Logo.jsx';
import { dataService } from '../lib/dataService.js';

const features = [
  { icon: Users, title: 'Patient 360°', text: 'Every history, allergy and visit — in one calm, searchable place.' },
  { icon: Stethoscope, title: 'Doctor Roster', text: 'Specialties, availability and fees, always up to date.' },
  { icon: CalendarDays, title: 'Smart Scheduling', text: 'Book, reschedule and track appointments without friction.' },
  { icon: Building2, title: 'Departments', text: 'Organize care across every wing of your hospital.' },
  { icon: Receipt, title: 'Billing & Invoices', text: 'Transparent, itemized billing your patients can trust.' },
  { icon: Activity, title: 'Live Insights', text: 'Real-time dashboards that turn data into decisions.' },
];

const stats = [
  { value: '12k+', label: 'Patients managed' },
  { value: '99.9%', label: 'Uptime confidence' },
  { value: '6', label: 'Care departments' },
  { value: '<2s', label: 'To any record' },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100">
      <div className="aurora" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm font-semibold text-ink-200 hover:text-white sm:block">
            Sign in
          </Link>
          <Link to="/login" className="btn-primary">
            Launch App <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:pt-16">
        <motion.div initial="hidden" animate="show" className="mx-auto max-w-3xl text-center">
          <motion.span
            variants={fade}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-300"
          >
            <Sparkles className="h-3.5 w-3.5" /> The hospital OS clinicians actually enjoy
          </motion.span>

          <motion.h1
            variants={fade}
            custom={1}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
          >
            Run your hospital with
            <span className="gradient-text"> clarity, not chaos.</span>
          </motion.h1>

          <motion.p variants={fade} custom={2} className="mx-auto mt-5 max-w-xl text-lg text-ink-300">
            VitaCore unifies patients, doctors, appointments, departments and billing into one
            beautiful, lightning-fast system — so your team spends less time on screens and more
            time on people.
          </motion.p>

          <motion.div variants={fade} custom={3} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/login" className="btn-primary px-6 py-3 text-base">
              Enter VitaCore <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="text-sm text-ink-400">
              {dataService.mode === 'demo' ? 'Demo mode — no signup needed' : 'Connected to live API'}
            </span>
          </motion.div>

          <motion.div variants={fade} custom={4} className="mt-6 flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
            <span className="ml-2 text-sm text-ink-400">Loved by care teams</span>
          </motion.div>
        </motion.div>

        {/* Floating glass preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl p-5 text-center"
              >
                <p className="font-display text-3xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-ink-300">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pattern interruption band */}
      <section className="relative z-10 border-y border-white/10 bg-gradient-to-r from-brand-600/20 via-transparent to-violet-600/20 py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 text-center">
          <HeartPulse className="h-10 w-10 text-brand-300 animate-float" />
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Behind every record is a heartbeat.
          </h2>
          <p className="max-w-2xl text-ink-300">
            We sweat the milliseconds so a nurse at 3am finds the right chart instantly. That&apos;s
            not a feature — it&apos;s a promise.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Everything, in one pulse.</h2>
          <p className="mt-3 text-ink-300">Six core modules, zero context switching.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-brand-400/50 hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-300">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-10 text-center shadow-glow sm:p-14">
          <ShieldCheck className="mx-auto h-12 w-12 text-white" />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Ready to give your team superpowers?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Step inside VitaCore and feel how effortless hospital management can be.
          </p>
          <Link to="/login" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 transition hover:scale-[1.02]">
            Get started now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-ink-400">
        <p>© {new Date().getFullYear()} VitaCore · Built for care teams everywhere.</p>
      </footer>
    </div>
  );
}
