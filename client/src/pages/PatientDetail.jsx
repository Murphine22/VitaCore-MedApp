import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Droplet,
  CalendarDays,
  Receipt,
  Pill,
  AlertTriangle,
  Wallet,
} from 'lucide-react';
import { dataService } from '../lib/dataService.js';
import { useList } from '../hooks/useResource.js';
import Avatar from '../components/ui/Avatar.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { ageFromDob, formatDate, formatNaira } from '../lib/format.js';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className="truncate text-sm font-medium">{value || '—'}</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="font-display text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function PatientDetail() {
  const { id } = useParams();

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patients', id, 'detail'],
    queryFn: () => dataService.patients.get(id),
    select: (res) => res.data,
  });

  const { data: appointments = [], isLoading: aLoading } = useList('appointments', { patient: id, sort: '-date' });
  const { data: invoices = [], isLoading: iLoading } = useList('invoices', { patient: id });
  const { data: prescriptions = [], isLoading: pLoading } = useList('prescriptions', { patient: id, sort: '-date' });

  if (isLoading) return <Spinner label="Loading patient…" />;

  if (!patient) {
    return (
      <div className="card">
        <EmptyState icon={AlertTriangle} title="Patient not found" message="This record may have been removed." />
        <div className="px-6 pb-6 text-center">
          <Link to="/app/patients" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Back to patients
          </Link>
        </div>
      </div>
    );
  }

  const totalBilled = invoices.reduce((s, inv) => s + (inv.amount || 0), 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <div>
      <Link to="/app/patients" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to patients
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden p-6"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={patient.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-extrabold tracking-tight">{patient.name}</h1>
              <StatusBadge status={patient.status} />
            </div>
            <p className="mt-1 text-sm text-ink-500">
              {patient.gender ? <span className="capitalize">{patient.gender}</span> : '—'}
              {patient.dateOfBirth && ` · ${ageFromDob(patient.dateOfBirth)} yrs · ${formatDate(patient.dateOfBirth)}`}
            </p>
            {patient.allergies?.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                  <AlertTriangle className="h-3.5 w-3.5" /> Allergies:
                </span>
                {patient.allergies.map((a) => (
                  <span key={a} className="badge bg-red-500/10 text-red-600 dark:text-red-400">{a}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow icon={Phone} label="Phone" value={patient.phone} />
          <InfoRow icon={Mail} label="Email" value={patient.email} />
          <InfoRow icon={Droplet} label="Blood group" value={patient.bloodGroup} />
          <InfoRow icon={MapPin} label="Address" value={patient.address} />
          <InfoRow icon={Phone} label="Emergency contact" value={patient.emergencyContact} />
        </div>

        {patient.medicalHistory && (
          <div className="mt-5 rounded-xl bg-ink-100/60 p-4 text-sm dark:bg-ink-800/40">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">Medical history</p>
            <p className="text-ink-700 dark:text-ink-200">{patient.medicalHistory}</p>
          </div>
        )}
      </motion.div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={CalendarDays} label="Appointments" value={appointments.length} accent="bg-gradient-to-br from-amber-500 to-orange-700" />
        <Stat icon={Pill} label="Prescriptions" value={prescriptions.length} accent="bg-gradient-to-br from-violet-500 to-indigo-700" />
        <Stat icon={Receipt} label="Total billed" value={formatNaira(totalBilled)} accent="bg-gradient-to-br from-brand-500 to-brand-700" />
        <Stat icon={Wallet} label="Total paid" value={formatNaira(totalPaid)} accent="bg-gradient-to-br from-emerald-500 to-teal-700" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Appointment history" icon={CalendarDays} loading={aLoading} empty={appointments.length === 0} emptyMsg="No appointments recorded.">
          {appointments.map((a) => (
            <div key={a._id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-800/50">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.doctorName}</p>
                <p className="truncate text-xs text-ink-500">{a.department} · {a.reason || '—'}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-ink-500">{formatDate(a.date)}</p>
                <p className="text-xs text-ink-400">{a.time}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </Section>

        <Section title="Prescriptions" icon={Pill} loading={pLoading} empty={prescriptions.length === 0} emptyMsg="No prescriptions recorded.">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="rounded-xl border border-ink-100 p-3 dark:border-ink-800/50">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{rx.diagnosis || 'Prescription'}</p>
                <StatusBadge status={rx.status} />
              </div>
              <p className="mt-1 text-xs text-ink-500">{rx.medications}</p>
              <p className="mt-1 text-xs text-ink-400">{rx.doctorName} · {formatDate(rx.date)}</p>
            </div>
          ))}
        </Section>

        <Section title="Invoices" icon={Receipt} loading={iLoading} empty={invoices.length === 0} emptyMsg="No invoices recorded." className="lg:col-span-2">
          {invoices.map((inv) => (
            <div key={inv._id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-800/50">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-semibold">{inv.invoiceNo}</p>
                <p className="truncate text-xs text-ink-500 capitalize">{inv.method} · due {formatDate(inv.dueDate)}</p>
              </div>
              <p className="font-display text-sm font-bold">{formatNaira(inv.amount)}</p>
              <StatusBadge status={inv.status} />
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, loading, empty, emptyMsg, className = '', children }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand-500" />
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : empty ? (
        <p className="py-6 text-center text-sm text-ink-500">{emptyMsg}</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}
