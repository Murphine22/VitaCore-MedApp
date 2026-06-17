import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String, default: '' },
    items: { type: [itemSchema], default: [] },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    amount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    method: { type: String, enum: ['cash', 'card', 'transfer', 'insurance'], default: 'cash' },
    dueDate: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

invoiceSchema.pre('validate', function computeTotals(next) {
  const subtotal = (this.items || []).reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  this.amount = Math.max(0, subtotal + (this.tax || 0) - (this.discount || 0));
  if (!this.invoiceNo) {
    this.invoiceNo = `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, '0')}`;
  }
  next();
});

export const Invoice = mongoose.model('Invoice', invoiceSchema);
