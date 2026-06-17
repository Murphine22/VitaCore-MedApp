import { initials } from '../../lib/format.js';

const GRADIENTS = [
  'from-brand-400 to-cyan-600',
  'from-violet-400 to-indigo-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-pink-400 to-rose-600',
  'from-sky-400 to-blue-600',
];

function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export default function Avatar({ name, size = 'md' }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' };
  const gradient = GRADIENTS[hash(name) % GRADIENTS.length];
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-bold text-white shadow-sm ${sizes[size]}`}
      title={name}
    >
      {initials(name) || '?'}
    </div>
  );
}
