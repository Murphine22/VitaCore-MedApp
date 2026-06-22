import { Pill } from 'lucide-react';
import CrudView from '../components/data/CrudView.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { formatDate } from '../lib/format.js';
import { useList } from '../hooks/useResource.js';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const filters = [{ key: 'status', label: 'Statuses', options: statusOptions }];

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
  { key: 'diagnosis', header: 'Diagnosis', render: (r) => r.diagnosis || '—' },
  { key: 'medications', header: 'Medications', render: (r) => <span className="line-clamp-1 max-w-xs text-ink-500">{r.medications || '—'}</span> },
  { key: 'doctorName', header: 'Prescribed by' },
  { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
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
        <p className="truncate text-xs text-ink-500">{r.diagnosis || '—'}</p>
        <p className="line-clamp-1 text-xs text-ink-400">{r.medications}</p>
        <p className="text-xs text-ink-400">{r.doctorName} · {formatDate(r.date)}</p>
      </div>
    </div>
  );
}

export default function Prescriptions() {
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
      label: 'Prescribing doctor',
      type: 'select',
      required: true,
      placeholder: 'Select doctor',
      options: doctors.map((d) => ({ value: d._id, label: `${d.name} · ${d.specialty}` })),
    },
    { name: 'diagnosis', label: 'Diagnosis', placeholder: 'e.g. Hypertension' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions, default: 'active' },
    { name: 'medications', label: 'Medications', type: 'textarea', full: true, placeholder: 'Drug — dosage; Drug — dosage' },
    { name: 'notes', label: 'Notes', type: 'textarea', full: true },
  ];

  return (
    <CrudView
      resource="prescriptions"
      title="Prescriptions"
      subtitle="Issue and track medical prescriptions"
      icon={Pill}
      columns={columns}
      fields={fields}
      addLabel="New Prescription"
      searchPlaceholder="Search prescriptions…"
      renderMobile={MobileCard}
      filters={filters}
      toFormValues={(r) => ({
        ...r,
        patient: r.patient?._id || r.patient,
        doctor: r.doctor?._id || r.doctor,
      })}
    />
  );
}
