interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}

export default function InputField({ label, type, value, onChange }: InputFieldProps) {
  const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-slate-300 mb-2 font-medium text-sm">{label}</label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
        autoComplete="off"
        aria-label={label}
      />
    </div>
  );
}
