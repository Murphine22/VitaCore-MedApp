import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, Mail, Lock, User, Loader2 } from 'lucide-react';
import Logo from '../components/ui/Logo.jsx';
import { useAuthStore } from '../store/authStore.js';
import { dataService } from '../lib/dataService.js';

const demoAccounts = [
  { role: 'Admin', email: 'admin@vitacore.io' },
  { role: 'Doctor', email: 'doctor@vitacore.io' },
  { role: 'Reception', email: 'reception@vitacore.io' },
];

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'receptionist' });
  const { login, register, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const user = await login({ email: form.email, password: form.password });
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      } else {
        const user = await register(form);
        toast.success(`Account created. Welcome, ${user.name.split(' ')[0]}!`);
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  }

  function quickFill(email) {
    setMode('login');
    setForm((prev) => ({ ...prev, email, password: 'password123' }));
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 p-4 text-ink-100">
      <div className="aurora" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="glass rounded-3xl p-7 shadow-soft">
          <h1 className="font-display text-2xl font-extrabold">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-ink-300">
            {mode === 'login'
              ? 'Sign in to your VitaCore workspace.'
              : 'Join VitaCore and start managing care.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label text-ink-300">Full name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input bg-white/5 pl-9 text-white placeholder:text-ink-400"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label text-ink-300">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  className="input bg-white/5 pl-9 text-white placeholder:text-ink-400"
                  placeholder="you@hospital.io"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label text-ink-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  className="input bg-white/5 pl-9 text-white placeholder:text-ink-400"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="label text-ink-300">Role</label>
                <select
                  className="input bg-white/5 text-white"
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                >
                  <option value="receptionist">Receptionist</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-300">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-brand-300 hover:text-brand-200"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {dataService.mode === 'demo' && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Demo accounts · password123
              </p>
              <div className="flex flex-wrap gap-2">
                {demoAccounts.map((a) => (
                  <button
                    key={a.email}
                    onClick={() => quickFill(a.email)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-200 transition hover:border-brand-400/60 hover:text-white"
                  >
                    {a.role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
