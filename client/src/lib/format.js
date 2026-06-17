import { format, parseISO, isValid } from 'date-fns';

export function formatNaira(value) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-NG').format(Number(value) || 0);
}

export function formatDate(value, pattern = 'dd MMM yyyy') {
  if (!value) return '—';
  const date = typeof value === 'string' ? parseISO(value) : value;
  return isValid(date) ? format(date, pattern) : '—';
}

export function formatDateTime(value) {
  return formatDate(value, 'dd MMM yyyy · HH:mm');
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function ageFromDob(dob) {
  if (!dob) return '—';
  const d = typeof dob === 'string' ? parseISO(dob) : dob;
  if (!isValid(d)) return '—';
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
