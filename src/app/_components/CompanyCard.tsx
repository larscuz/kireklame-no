import Link from "next/link";
import Badge from "./Badge";
import CoverImg from "./CoverImg";
import { CompanyCardModel } from "@/lib/types";
import { aiLevelLabel, priceLevelLabel, typeLabel } from "@/lib/utils";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export default async function CompanyCard({ company }: { company: CompanyCardModel }) {
  const locale = await getLocale();
  const cover = company.cover_image || "/covers/cover-1.jpg";

  return (
    <div className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:shadow-lift transition overflow-hidden">
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="block">
        <div className="relative aspect-[16/11] overflow-hidden bg-[rgb(var(--bg))]">
          <CoverImg
            src={cover}
            alt={company.name}
            className="h-full w-full object-contain object-center group-hover:scale-[1.02] transition duration-300"
          />

          <div className="absolute left-3 top-3 flex gap-2">
            <Badge>AI: {aiLevelLabel(company.ai_level, locale)}</Badge>
            <Badge variant="muted">
              {locale === "en" ? "Price" : "Pris"}:{" "}
              {priceLevelLabel(company.price_level, locale)}
            </Badge>
            {company.is_verified && (
              <Badge variant="muted">{locale === "en" ? "Verified" : "Verifisert"}</Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold tracking-tight">{company.name}</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                {company.location?.name ? `${company.location.name} • ` : ""}
                {typeLabel(company.company_type, locale)}
              </div>
            </div>
          </div>

          {company.short_description && (
            <p className="mt-3 text-sm text-[rgb(var(--muted))] line-clamp-2">
              {company.short_description}
            </p>
          )}

          {company.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {company.tags.slice(0, 3).map((t) => (
                <span key={t.slug} className="text-xs text-[rgb(var(--muted))]">
                  #{t.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>

    </div>
  );
}
