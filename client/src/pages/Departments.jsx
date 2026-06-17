import { motion } from 'framer-motion';
import { useState } from 'react';
import { Building2, Plus, MapPin, Phone, Pencil, Trash2, User } from 'lucide-react';
import PageHeader from '../components/data/PageHeader.jsx';
import SearchBar from '../components/data/SearchBar.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import ResourceForm from '../components/data/ResourceForm.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useList, useCreate, useUpdate, useRemove } from '../hooks/useResource.js';

const fields = [
  { name: 'name', label: 'Department name', required: true, placeholder: 'Cardiology' },
  { name: 'headDoctor', label: 'Head doctor', placeholder: 'Dr. …' },
  { name: 'location', label: 'Location', placeholder: 'Block A, Floor 2' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+234 …' },
  { name: 'color', label: 'Accent color', type: 'text', placeholder: '#06b6d4' },
  { name: 'description', label: 'Description', type: 'textarea', full: true },
];

export default function Departments() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: rows = [], isLoading } = useList('departments', search ? { search } : {});
  const createM = useCreate('departments');
  const updateM = useUpdate('departments');
  const removeM = useRemove('departments');

  const isNew = editing && !editing._id;
  const saving = createM.isPending || updateM.isPending;

  async function handleSubmit(payload) {
    try {
      if (isNew) await createM.mutateAsync(payload);
      else await updateM.mutateAsync({ id: editing._id, body: payload });
      setEditing(null);
    } catch {
      /* handled */
    }
  }

  async function handleDelete() {
    try {
      await removeM.mutateAsync(deleting._id);
      setDeleting(null);
    } catch {
      /* handled */
    }
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Organize care across every wing of the hospital"
        icon={Building2}
        actions={
          <button className="btn-primary" onClick={() => setEditing({})}>
            <Plus className="h-4 w-4" /> Add Department
          </button>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search departments…" />
      </div>

      {isLoading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Building2}
            title={search ? 'No matches found' : 'No departments yet'}
            message={search ? 'Try a different search.' : 'Create your first department.'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((d, i) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.4) }}
              className="card group relative overflow-hidden p-5"
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-xl transition group-hover:opacity-40"
                style={{ background: d.color || '#06b6d4' }}
              />
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow"
                  style={{ background: d.color || '#06b6d4' }}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => setEditing(d)} className="rounded-lg p-1.5 text-ink-500 hover:bg-brand-500/10 hover:text-brand-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleting(d)} className="rounded-lg p-1.5 text-ink-500 hover:bg-red-500/10 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{d.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink-700/70 dark:text-ink-200/60">
                {d.description || 'No description'}
              </p>
              <div className="mt-4 space-y-1.5 text-sm text-ink-500">
                {d.headDoctor && (
                  <p className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> {d.headDoctor}
                  </p>
                )}
                {d.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> {d.location}
                  </p>
                )}
                {d.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {d.phone}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? 'Add Department' : 'Edit Department'}
        subtitle={isNew ? 'Create a new care department' : 'Update department details'}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="departments-form" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <ResourceForm id="departments-form" fields={fields} initialValues={editing || {}} onSubmit={handleSubmit} />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={removeM.isPending}
        title="Delete Department?"
        message={`This will permanently remove "${deleting?.name}".`}
      />
    </div>
  );
}
