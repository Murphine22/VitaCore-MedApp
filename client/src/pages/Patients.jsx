import { Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CrudView from '../components/data/CrudView.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { ageFromDob, formatDate } from '../lib/format.js';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const bloodOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'].map((b) => ({
  value: b,
  label: b,
}));
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'admitted', label: 'Admitted' },
  { value: 'discharged', label: 'Discharged' },
];

const fields = [
  { name: 'name', label: 'Full name', required: true, placeholder: 'John Abiodun' },
  { name: 'phone', label: 'Phone', required: true, type: 'tel', placeholder: '+234 …' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com' },
  { name: 'gender', label: 'Gender', type: 'select', options: genderOptions, default: 'other' },
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date' },
  { name: 'bloodGroup', label: 'Blood group', type: 'select', options: bloodOptions, default: 'unknown' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions, default: 'active' },
  { name: 'emergencyContact', label: 'Emergency contact', placeholder: '+234 …' },
  { name: 'address', label: 'Address', full: true, placeholder: 'Street, City' },
  { name: 'allergies', label: 'Allergies', type: 'tags', full: true, hint: 'Comma-separated, e.g. Penicillin, Latex' },
  { name: 'medicalHistory', label: 'Medical history', type: 'textarea', full: true },
];

const filters = [
  {
    key: 'status',
    label: 'Statuses',
    options: statusOptions,
  },
  {
    key: 'bloodGroup',
    label: 'Blood Groups',
    options: bloodOptions,
  },
];

const columns = [
  {
    key: 'name',
    header: 'Patient',
    render: (r) => (
      <Link to={`/app/patients/${r._id}`} className="group flex items-center gap-3">
        <Avatar name={r.name} size="sm" />
        <div>
          <p className="font-semibold group-hover:text-brand-600">{r.name}</p>
          <p className="text-xs text-ink-500">{r.email || r.phone}</p>
        </div>
      </Link>
    ),
  },
  { key: 'phone', header: 'Phone' },
  { key: 'gender', header: 'Gender', render: (r) => <span className="capitalize">{r.gender}</span> },
  { key: 'dateOfBirth', header: 'Age', render: (r) => (r.dateOfBirth ? `${ageFromDob(r.dateOfBirth)} yrs` : '—') },
  { key: 'bloodGroup', header: 'Blood', render: (r) => <span className="font-semibold text-red-500">{r.bloodGroup}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  {
    key: 'view',
    header: '',
    render: (r) => (
      <Link
        to={`/app/patients/${r._id}`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
      >
        Profile <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    ),
  },
];

function MobileCard(r) {
  return (
    <Link to={`/app/patients/${r._id}`} className="flex items-center gap-3">
      <Avatar name={r.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">{r.name}</p>
          <StatusBadge status={r.status} />
        </div>
        <p className="text-xs text-ink-500">{r.phone}</p>
        <p className="text-xs text-ink-400">
          {r.bloodGroup} · {r.dateOfBirth ? `${ageFromDob(r.dateOfBirth)} yrs · ${formatDate(r.dateOfBirth)}` : 'DOB —'}
        </p>
      </div>
    </Link>
  );
}

export default function Patients() {
  return (
    <CrudView
      resource="patients"
      title="Patients"
      subtitle="Manage patient records and medical profiles"
      icon={Users}
      columns={columns}
      fields={fields}
      addLabel="Add Patient"
      searchPlaceholder="Search patients…"
      renderMobile={MobileCard}
      filters={filters}
    />
  );
}
