import { CalendarDays } from 'lucide-react';
import CrudView from '../components/data/CrudView.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { formatDate } from '../lib/format.js';
import { useList } from '../hooks/useResource.js';

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No-show' },
];

const columns = [
  {
    key: 'patientName',
    header: 'Patient',
    render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.patientName} size="sm" />
        <span className="font-semibold">{r.patientName}</span>
      </div>
    ),
  },
  { key: 'doctorName', header: 'Doctor' },
  { key: 'department', header: 'Department' },
  { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
  { key: 'time', header: 'Time' },
  { key: 'reason', header: 'Reason', render: (r) => <span className="text-ink-500">{r.reason || '—'}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
];

function MobileCard(r) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={r.patientName} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">{r.patientName}</p>
          <StatusBadge status={r.status} />
        </div>
        <p className="text-xs text-ink-500">{r.doctorName} · {r.department}</p>
        <p className="text-xs text-ink-400">{formatDate(r.date)} · {r.time}</p>
      </div>
    </div>
  );
}

export default function Appointments() {
  const { data: patients = [] } = useList('patients');
  const { data: doctors = [] } = useList('doctors');

  const fields = [
    {
      name: 'patient',
      label: 'Patient',
      type: 'select',
      required: true,
      placeholder: 'Select patient',
      options: patients.map((p) => ({ value: p._id, label: p.name })),
    },
    {
      name: 'doctor',
      label: 'Doctor',
      type: 'select',
      required: true,
      placeholder: 'Select doctor',
      options: doctors.map((d) => ({ value: d._id, label: `${d.name} · ${d.specialty}` })),
    },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'time', label: 'Time', type: 'time' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions, default: 'scheduled' },
    { name: 'reason', label: 'Reason', placeholder: 'Routine check-up' },
    { name: 'notes', label: 'Notes', type: 'textarea', full: true },
  ];

  return (
    <CrudView
      resource="appointments"
      title="Appointments"
      subtitle="Schedule and track patient appointments"
      icon={CalendarDays}
      columns={columns}
      fields={fields}
      addLabel="Book Appointment"
      searchPlaceholder="Search appointments…"
      renderMobile={MobileCard}
      toFormValues={(r) => ({
        ...r,
        patient: r.patient?._id || r.patient,
        doctor: r.doctor?._id || r.doctor,
      })}
    />
  );
}
