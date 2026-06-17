import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 p-6 text-center text-ink-100">
      <div className="aurora" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        <Activity className="mx-auto h-14 w-14 text-brand-400 animate-float" />
        <h1 className="mt-6 font-display text-7xl font-extrabold gradient-text">404</h1>
        <p className="mt-3 text-xl font-bold">This page flatlined.</p>
        <p className="mt-2 max-w-md text-ink-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex px-6 py-3">
          <Home className="h-4 w-4" /> Back to safety
        </Link>
      </motion.div>
    </div>
  );
}
