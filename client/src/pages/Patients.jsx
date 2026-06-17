import { Users } from 'lucide-react';
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

const columns = [
  {
    key: 'name',
    header: 'Patient',
    render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.name} size="sm" />
        <div>
          <p className="font-semibold">{r.name}</p>
          <p className="text-xs text-ink-500">{r.email || r.phone}</p>
        </div>
      </div>
    ),
  },
  { key: 'phone', header: 'Phone' },
  { key: 'gender', header: 'Gender', render: (r) => <span className="capitalize">{r.gender}</span> },
  { key: 'dateOfBirth', header: 'Age', render: (r) => (r.dateOfBirth ? `${ageFromDob(r.dateOfBirth)} yrs` : '—') },
  { key: 'bloodGroup', header: 'Blood', render: (r) => <span className="font-semibold text-red-500">{r.bloodGroup}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
];

function MobileCard(r) {
  return (
    <div className="flex items-center gap-3">
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
    </div>
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
    />
  );
}
