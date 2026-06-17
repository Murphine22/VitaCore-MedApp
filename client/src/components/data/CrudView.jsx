import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from './PageHeader.jsx';
import SearchBar from './SearchBar.jsx';
import DataTable from './DataTable.jsx';
import ResourceForm from './ResourceForm.jsx';
import Modal from '../ui/Modal.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import Spinner from '../ui/Spinner.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { useList, useCreate, useUpdate, useRemove } from '../../hooks/useResource.js';

export default function CrudView({
  resource,
  title,
  subtitle,
  icon,
  columns,
  fields,
  searchPlaceholder,
  addLabel = 'Add',
  emptyIcon,
  toFormValues,
  renderMobile,
  extra,
}) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | {} (new) | record
  const [deleting, setDeleting] = useState(null);

  const { data: rows = [], isLoading } = useList(resource, search ? { search } : {});
  const createM = useCreate(resource);
  const updateM = useUpdate(resource);
  const removeM = useRemove(resource);

  const isNew = editing && !editing._id;
  const formId = `${resource}-form`;

  const initialValues = useMemo(() => {
    if (!editing) return {};
    return toFormValues ? toFormValues(editing) : editing;
  }, [editing, toFormValues]);

  async function handleSubmit(payload) {
    try {
      if (isNew) await createM.mutateAsync(payload);
      else await updateM.mutateAsync({ id: editing._id, body: payload });
      setEditing(null);
    } catch {
      /* toast handled in hook */
    }
  }

  async function handleDelete() {
    try {
      await removeM.mutateAsync(deleting._id);
      setDeleting(null);
    } catch {
      /* toast handled in hook */
    }
  }

  const saving = createM.isPending || updateM.isPending;

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        actions={
          <button className="btn-primary" onClick={() => setEditing({})}>
            <Plus className="h-4 w-4" /> {addLabel}
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder={searchPlaceholder} />
        <p className="text-sm text-ink-500">
          {rows.length} {rows.length === 1 ? 'record' : 'records'}
        </p>
      </div>

      {extra}

      {isLoading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={emptyIcon || icon}
            title={search ? 'No matches found' : `No ${title.toLowerCase()} yet`}
            message={search ? 'Try a different search term.' : `Add your first record to get started.`}
            action={
              !search && (
                <button className="btn-primary" onClick={() => setEditing({})}>
                  <Plus className="h-4 w-4" /> {addLabel}
                </button>
              )
            }
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          onEdit={(row) => setEditing(row)}
          onDelete={(row) => setDeleting(row)}
          renderMobile={renderMobile}
        />
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? `Add ${title.replace(/s$/, '')}` : `Edit ${title.replace(/s$/, '')}`}
        subtitle={isNew ? 'Create a new record' : 'Update the details below'}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form={formId} className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <ResourceForm
          id={formId}
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={removeM.isPending}
        title={`Delete ${title.replace(/s$/, '')}?`}
        message={`This will permanently remove "${deleting?.name || deleting?.patientName || deleting?.invoiceNo}". This action cannot be undone.`}
      />
    </div>
  );
}
