type Props = {
  title?: string;
  items: string[];
};

export default function Pitfalls({ title = "Vanlige feil", items }: Props) {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
      <h3 className="text-base font-semibold text-amber-100">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-50/90">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
