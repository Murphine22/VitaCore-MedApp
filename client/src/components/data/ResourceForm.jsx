import { useEffect, useState } from 'react';

function Field({ field, value, onChange }) {
  const common = {
    id: field.name,
    value: value ?? '',
    onChange: (e) => onChange(field.name, e.target.value),
    placeholder: field.placeholder,
    required: field.required,
    className: 'input',
  };

  if (field.type === 'textarea') {
    return <textarea {...common} rows={field.rows || 3} />;
  }
  if (field.type === 'select') {
    return (
      <select {...common}>
        <option value="">{field.placeholder || 'Select…'}</option>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  return <input {...common} type={field.type || 'text'} />;
}

export default function ResourceForm({ id, fields, initialValues = {}, onSubmit, children }) {
  const [values, setValues] = useState({});

  useEffect(() => {
    const base = {};
    fields.forEach((f) => {
      let v = initialValues[f.name];
      if (f.type === 'tags' && Array.isArray(v)) v = v.join(', ');
      if (f.type === 'date' && v) v = String(v).slice(0, 10);
      base[f.name] = v ?? f.default ?? '';
    });
    setValues(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialValues)]);

  function setField(name, val) {
    setValues((prev) => ({ ...prev, [name]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {};
    fields.forEach((f) => {
      let v = values[f.name];
      if (f.type === 'tags') {
        v = String(v || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === 'number') v = v === '' ? 0 : Number(v);
      payload[f.name] = v;
    });
    onSubmit(payload);
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
          <label className="label" htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </label>
          <Field field={field} value={values[field.name]} onChange={setField} />
          {field.hint && <p className="mt-1 text-xs text-ink-500">{field.hint}</p>}
        </div>
      ))}
      {children}
    </form>
  );
}
