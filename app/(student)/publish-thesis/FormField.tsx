export const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  readOnly = false,
  rows,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  readOnly?: boolean;
  rows?: number;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        rows={rows || 4}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full text-black border border-gray-300 p-2 rounded resize-none ${
          error ? "border-red-500" : ""
        }`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full text-black border border-gray-300 p-2 rounded ${
          readOnly ? "bg-gray-50 text-gray-700" : ""
        } ${error ? "border-red-500" : ""}`}
      />
    )}
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);
