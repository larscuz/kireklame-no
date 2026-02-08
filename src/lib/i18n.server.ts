import { cookies, headers } from "next/headers";
import { getLocaleFromHeaders, type Locale } from "./i18n";

export function getLocale(): Locale {
  const cookieLocale = cookies().get("lang")?.value?.toLowerCase() ?? "";
  if (cookieLocale.startsWith("en")) return "en";
  if (cookieLocale.startsWith("no")) return "no";
  return getLocaleFromHeaders(headers());
}
