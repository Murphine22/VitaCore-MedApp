import { useEffect, useMemo, useState } from 'react';
import { Receipt, Plus, Trash2, Wallet, FileText, Clock, AlertCircle } from 'lucide-react';
import PageHeader from '../components/data/PageHeader.jsx';
import SearchBar from '../components/data/SearchBar.jsx';
import DataTable from '../components/data/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { useList, useCreate, useUpdate, useRemove } from '../hooks/useResource.js';
import { formatNaira, formatDate } from '../lib/format.js';

const blankItem = () => ({ description: '', quantity: 1, unitPrice: 0 });
const emptyForm = () => ({
  patient: '',
  items: [blankItem()],
  tax: 0,
  discount: 0,
  status: 'pending',
  method: 'cash',
  dueDate: '',
  notes: '',
});

function SummaryCard({ icon: Icon, label, value, accent }) {
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

export default function Billing() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const { data: rows = [], isLoading } = useList('invoices', search ? { search } : {});
  const { data: patients = [] } = useList('patients');
  const createM = useCreate('invoices');
  const updateM = useUpdate('invoices');
  const removeM = useRemove('invoices');

  const isNew = editing && !editing._id;
  const saving = createM.isPending || updateM.isPending;

  useEffect(() => {
    if (!editing) return;
    if (editing._id) {
      setForm({
        patient: editing.patient?._id || editing.patient || '',
        items: editing.items?.length ? editing.items : [blankItem()],
        tax: editing.tax || 0,
        discount: editing.discount || 0,
        status: editing.status || 'pending',
        method: editing.method || 'cash',
        dueDate: editing.dueDate ? String(editing.dueDate).slice(0, 10) : '',
        notes: editing.notes || '',
      });
    } else {
      setForm(emptyForm());
    }
  }, [editing]);

  const total = useMemo(() => {
    const sub = form.items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
    return Math.max(0, sub + (Number(form.tax) || 0) - (Number(form.discount) || 0));
  }, [form]);

  const summary = useMemo(() => {
    const paid = rows.filter((r) => r.status === 'paid').reduce((s, r) => s + (r.amount || 0), 0);
    const pending = rows.filter((r) => r.status === 'pending').reduce((s, r) => s + (r.amount || 0), 0);
    const overdue = rows.filter((r) => r.status === 'overdue').reduce((s, r) => s + (r.amount || 0), 0);
    return { paid, pending, overdue, count: rows.length };
  }, [rows]);

  function setItem(idx, key, value) {
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...prev, items };
    });
  }
  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, blankItem()] }));
  }
  function removeItem(idx) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      patient: form.patient,
      items: form.items
        .filter((it) => it.description)
        .map((it) => ({
          description: it.description,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
        })),
      tax: Number(form.tax) || 0,
      discount: Number(form.discount) || 0,
      status: form.status,
      method: form.method,
      dueDate: form.dueDate || undefined,
      notes: form.notes,
    };
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

  const columns = [
    { key: 'invoiceNo', header: 'Invoice', render: (r) => <span className="font-mono text-xs font-semibold">{r.invoiceNo}</span> },
    { key: 'patientName', header: 'Patient', render: (r) => <span className="font-semibold">{r.patientName}</span> },
    { key: 'amount', header: 'Amount', render: (r) => formatNaira(r.amount) },
    { key: 'method', header: 'Method', render: (r) => <span className="capitalize">{r.method}</span> },
    { key: 'dueDate', header: 'Due', render: (r) => formatDate(r.dueDate) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle="Create and manage patient invoices"
        icon={Receipt}
        actions={
          <button className="btn-primary" onClick={() => setEditing({})}>
            <Plus className="h-4 w-4" /> New Invoice
          </button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard icon={Wallet} label="Collected" value={formatNaira(summary.paid)} accent="bg-gradient-to-br from-emerald-500 to-teal-700" />
        <SummaryCard icon={Clock} label="Pending" value={formatNaira(summary.pending)} accent="bg-gradient-to-br from-amber-500 to-orange-700" />
        <SummaryCard icon={AlertCircle} label="Overdue" value={formatNaira(summary.overdue)} accent="bg-gradient-to-br from-red-500 to-rose-700" />
        <SummaryCard icon={FileText} label="Invoices" value={summary.count} accent="bg-gradient-to-br from-brand-500 to-brand-700" />
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search invoices…" />
      </div>

      {isLoading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <div className="card">
          <EmptyState icon={Receipt} title={search ? 'No matches' : 'No invoices yet'} message={search ? 'Try another search.' : 'Create your first invoice.'} />
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} onEdit={(r) => setEditing(r)} onDelete={(r) => setDeleting(r)} />
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        size="lg"
        title={isNew ? 'New Invoice' : 'Edit Invoice'}
        subtitle={isNew ? 'Itemize charges for a patient' : editing?.invoiceNo}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="invoice-form" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : `Save · ${formatNaira(total)}`}
            </button>
          </>
        }
      >
        <form id="invoice-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Patient *</label>
              <select className="input" value={form.patient} onChange={(e) => setForm((p) => ({ ...p, patient: e.target.value }))} required>
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Line items</label>
              <button type="button" onClick={addItem} className="btn-ghost px-3 py-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add item
              </button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <input
                    className="input col-span-6"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => setItem(idx, 'description', e.target.value)}
                  />
                  <input
                    className="input col-span-2"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => setItem(idx, 'quantity', e.target.value)}
                  />
                  <input
                    className="input col-span-3"
                    type="number"
                    min="0"
                    placeholder="Unit ₦"
                    value={item.unitPrice}
                    onChange={(e) => setItem(idx, 'unitPrice', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="col-span-1 flex items-center justify-center rounded-lg text-ink-400 hover:bg-red-500/10 hover:text-red-500"
                    disabled={form.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Tax (₦)</label>
              <input className="input" type="number" min="0" value={form.tax} onChange={(e) => setForm((p) => ({ ...p, tax: e.target.value }))} />
            </div>
            <div>
              <label className="label">Discount (₦)</label>
              <input className="input" type="number" min="0" value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="label">Payment method</label>
              <select className="input" value={form.method} onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Transfer</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
            <div>
              <label className="label">Due date</label>
              <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
            </div>
            <div className="flex items-end">
              <div className="w-full rounded-xl bg-brand-500/10 px-4 py-3 text-right">
                <p className="text-xs text-ink-500">Total</p>
                <p className="font-display text-2xl font-extrabold text-brand-600 dark:text-brand-300">{formatNaira(total)}</p>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={removeM.isPending}
        title="Delete Invoice?"
        message={`This will permanently remove "${deleting?.invoiceNo}".`}
      />
    </div>
  );
}
