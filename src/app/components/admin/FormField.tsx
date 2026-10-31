interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[12px] font-semibold text-[#09213f] ">
        {label}
      </label>

      {children}
    </div>
  );
}