export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
}) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-100 shadow-sm rounded-lg focus:outline-none focus:shadow-md focus:border-gray-100  resize-none scrollbar-none"
    />
  </div>
);
