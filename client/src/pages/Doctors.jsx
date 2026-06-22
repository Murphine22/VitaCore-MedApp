import { Stethoscope, Star } from 'lucide-react';
import CrudView from '../components/data/CrudView.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { formatNaira } from '../lib/format.js';
import { useList } from '../hooks/useResource.js';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'on-leave', label: 'On leave' },
];

const columns = [
  {
    key: 'name',
    header: 'Doctor',
    render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.name} size="sm" />
        <div>
          <p className="font-semibold">{r.name}</p>
          <p className="text-xs text-ink-500">{r.specialty}</p>
        </div>
      </div>
    ),
  },
  { key: 'department', header: 'Department' },
  { key: 'experienceYears', header: 'Experience', render: (r) => `${r.experienceYears} yrs` },
  { key: 'consultationFee', header: 'Fee', render: (r) => formatNaira(r.consultationFee) },
  {
    key: 'rating',
    header: 'Rating',
    render: (r) => (
      <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
        <Star className="h-3.5 w-3.5 fill-current" /> {r.rating}
      </span>
    ),
  },
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
        <p className="text-xs text-ink-500">{r.specialty} · {r.department}</p>
        <p className="text-xs text-ink-400">{formatNaira(r.consultationFee)} · ★ {r.rating}</p>
      </div>
    </div>
  );
}

export default function Doctors() {
  const { data: departments = [] } = useList('departments');

  const filters = [
    { key: 'status', label: 'Statuses', options: statusOptions },
    {
      key: 'department',
      label: 'Departments',
      options: departments.map((d) => ({ value: d.name, label: d.name })),
    },
  ];

  const fields = [
    { name: 'name', label: 'Full name', required: true, placeholder: 'Dr. Jane Doe' },
    { name: 'specialty', label: 'Specialty', required: true, placeholder: 'Cardiologist' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'name@vitacore.io' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+234 …' },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      options: departments.map((d) => ({ value: d.name, label: d.name })),
    },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions, default: 'other' },
    { name: 'experienceYears', label: 'Experience (years)', type: 'number', default: 0 },
    { name: 'consultationFee', label: 'Consultation fee (₦)', type: 'number', default: 0 },
    { name: 'rating', label: 'Rating (0–5)', type: 'number', default: 4.5 },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions, default: 'available' },
    { name: 'bio', label: 'Bio', type: 'textarea', full: true, placeholder: 'Short professional bio' },
  ];

  return (
    <CrudView
      resource="doctors"
      title="Doctors"
      subtitle="Manage medical staff, specialties and availability"
      icon={Stethoscope}
      columns={columns}
      fields={fields}
      addLabel="Add Doctor"
      searchPlaceholder="Search doctors…"
      renderMobile={MobileCard}
      filters={filters}
    />
  );
}
