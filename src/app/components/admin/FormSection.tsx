interface FormSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export default function FormSection({
  number,
  title,
  children,
}: FormSectionProps) {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-[15px] font-semibold text-[#09213f]">
        {number} {title}
      </h2>

      {children}
    </section>
  );
}