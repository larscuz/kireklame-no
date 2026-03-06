import Link from "next/link";
import CoverImg from "./CoverImg";
import { CompanyCardModel } from "@/lib/types";
import { aiLevelLabel, priceLevelLabel, typeLabel } from "@/lib/utils";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card-effect";

export default async function CompanyCard({ company }: { company: CompanyCardModel }) {
  const locale = await getLocale();
  const cover = company.cover_image || "/covers/cover-1.jpg";

  return (
    <div className="group relative flex flex-col">
      <CardContainer containerClassName="w-full !py-0" className="w-full">
        <CardBody className="group/card relative h-auto w-full rounded-[2rem] border border-[rgb(var(--border))]/70 bg-[rgb(var(--card))]/88 p-4 shadow-soft backdrop-blur-sm sm:p-5">
          <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="block">
            <CardItem translateZ={260} className="w-full">
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-video overflow-hidden rounded-[1.5rem] bg-black/40">
                <CoverImg
                  src={cover}
                  alt={company.name}
                  className="h-full w-full object-cover object-center opacity-85 transition-all duration-500 ease-out group-hover/card:scale-[1.08] group-hover/card:opacity-100"
                />
                {company.is_verified && (
                  <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/10 p-2 backdrop-blur-md">
                    <span className="block h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                )}
              </div>
            </CardItem>

            <CardItem translateZ={190} className="mt-5 w-full px-1">
              <h2 className="text-3xl font-bold tracking-tight text-[rgb(var(--fg))] md:text-4xl">
                {company.name}
              </h2>
            </CardItem>

            <CardItem translateZ={145} className="mt-3 w-full px-1">
              <div className="flex flex-wrap gap-1.5 text-[11px] leading-4">
                <span className="rounded-full border border-[rgb(var(--border))]/80 bg-[rgb(var(--card))]/70 px-2.5 py-1 font-medium text-[rgb(var(--muted))]">
                  {typeLabel(company.company_type, locale)}
                </span>
                <span className="rounded-full border border-[rgb(var(--border))]/80 bg-[rgb(var(--card))]/70 px-2.5 py-1 font-medium text-[rgb(var(--muted))]">
                  AI {aiLevelLabel(company.ai_level, locale)}
                </span>
                <span className="rounded-full border border-[rgb(var(--border))]/80 bg-[rgb(var(--card))]/70 px-2.5 py-1 font-medium text-[rgb(var(--muted))]">
                  {locale === "en" ? "Price" : "Pris"} {priceLevelLabel(company.price_level, locale)}
                </span>
                {company.location?.name ? (
                  <span className="rounded-full border border-[rgb(var(--border))]/80 bg-[rgb(var(--card))]/70 px-2.5 py-1 font-medium text-[rgb(var(--muted))]">
                    {company.location.name}
                  </span>
                ) : null}
              </div>
            </CardItem>

            {company.short_description ? (
              <CardItem translateZ={110} className="mt-2.5 w-full px-1">
                <p className="line-clamp-2 text-[13px] leading-relaxed text-[rgb(var(--muted))]/92">
                  {company.short_description}
                </p>
              </CardItem>
            ) : null}
          </Link>
        </CardBody>
      </CardContainer>
    </div>
  );
}
