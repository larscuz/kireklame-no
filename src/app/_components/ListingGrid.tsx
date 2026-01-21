import { CompanyCardModel } from "@/lib/types";
import CompanyCard from "./CompanyCard";

export default function ListingGrid({ companies }: { companies: CompanyCardModel[] }) {
  if (!companies.length) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-[rgb(var(--muted))] shadow-soft">
        Ingen treff. Prøv å justere filtre eller søkeord.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((c) => (
        <CompanyCard key={c.id} company={c} />
      ))}
    </div>
  );
}
