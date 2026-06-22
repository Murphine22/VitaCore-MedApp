import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from './PageHeader.jsx';
import SearchBar from './SearchBar.jsx';
import DataTable from './DataTable.jsx';
import ResourceForm from './ResourceForm.jsx';
import Modal from '../ui/Modal.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Pagination from '../ui/Pagination.jsx';
import { TableSkeleton } from '../ui/Skeleton.jsx';
import { usePagedList, useCreate, useUpdate, useRemove } from '../../hooks/useResource.js';

const DEFAULT_PAGE_SIZE = 10;

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
  filters = [],
  pageSize = DEFAULT_PAGE_SIZE,
  extra,
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState({});
  const [editing, setEditing] = useState(null); // null | {} (new) | record
  const [deleting, setDeleting] = useState(null);

  const activeFilters = useMemo(
    () => Object.fromEntries(Object.entries(filterValues).filter(([, v]) => v)),
    [filterValues]
  );

  // Reset to first page whenever the query narrows.
  const filterKey = JSON.stringify(activeFilters);
  useEffect(() => {
    setPage(1);
  }, [search, filterKey]);

  const params = {
    ...(search ? { search } : {}),
    ...activeFilters,
    page,
    limit: pageSize,
  };

  const { data, isLoading, isFetching } = usePagedList(resource, params);
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const createM = useCreate(resource);
  const updateM = useUpdate(resource);
  const removeM = useRemove(resource);

  const isNew = editing && !editing._id;
  const formId = `${resource}-form`;
  const hasQuery = !!search || Object.keys(activeFilters).length > 0;

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

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} placeholder={searchPlaceholder} />
          {filters.map((f) => (
            <select
              key={f.key}
              className="input sm:w-44"
              value={filterValues[f.key] || ''}
              onChange={(e) => setFilterValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
            >
              <option value="">{f.allLabel || `All ${f.label}`}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
        <p className="text-sm text-ink-500">
          {total} {total === 1 ? 'record' : 'records'}
        </p>
      </div>

      {extra}

      {isLoading ? (
        <TableSkeleton rows={pageSize} />
      ) : rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={emptyIcon || icon}
            title={hasQuery ? 'No matches found' : `No ${title.toLowerCase()} yet`}
            message={hasQuery ? 'Try a different search or filter.' : `Add your first record to get started.`}
            action={
              !hasQuery && (
                <button className="btn-primary" onClick={() => setEditing({})}>
                  <Plus className="h-4 w-4" /> {addLabel}
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className={isFetching ? 'opacity-60 transition' : 'transition'}>
          <DataTable
            columns={columns}
            rows={rows}
            onEdit={(row) => setEditing(row)}
            onDelete={(row) => setDeleting(row)}
            renderMobile={renderMobile}
          />
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
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
