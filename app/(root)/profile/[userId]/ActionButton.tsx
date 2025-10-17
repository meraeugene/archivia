"use client";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  hover?: string;
  disabled?: boolean;
}

export function ActionButton({
  label,
  onClick,
  icon,
  hover,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group cursor-pointer relative px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 w-full sm:w-auto border disabled:opacity-50"
    >
      <span className="relative z-10 flex items-center justify-center gap-3 transition-colors duration-300 group-hover:text-white">
        {label}
        {icon && (
          <span
            className={`transition-transform duration-300 group-hover:${hover}`}
          >
            {icon}
          </span>
        )}
      </span>
      <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </button>
  );
}
