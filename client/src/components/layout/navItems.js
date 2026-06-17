import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Building2,
  Receipt,
  Settings,
} from 'lucide-react';

export const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/patients', label: 'Patients', icon: Users },
  { to: '/app/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/app/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/app/departments', label: 'Departments', icon: Building2 },
  { to: '/app/billing', label: 'Billing', icon: Receipt },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];
