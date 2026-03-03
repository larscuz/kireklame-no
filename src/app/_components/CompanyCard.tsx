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
    <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="godly-row block w-full">
      <div className="godly-row-img-wrapper">
        <CoverImg
          src={cover}
          alt={company.name}
        />
      </div>
      <span className="godly-row-text">
        {company.name}
      </span>
      <span className="text-xl md:text-2xl font-mono text-[rgba(255,255,255,0.3)] mix-blend-difference hidden sm:block">
        [ {typeLabel(company.company_type, locale)} ]
      </span>
    </Link>
  );
}
