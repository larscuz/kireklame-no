type ErrorLike = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
};

export const ADS_SELECT_BASE = [
  "id",
  "placement",
  "title",
  "meta",
  "description",
  "image_url",
  "mobile_image_url",
  "href",
  "alt",
  "label",
  "cta_text",
  "is_active",
  "priority",
].join(", ");

export const ADS_SELECT_WITH_SCHEDULE = `${ADS_SELECT_BASE}, starts_at, ends_at`;

export function isMissingAdsScheduleColumns(error: ErrorLike | null | undefined) {
  const code = String(error?.code ?? "").trim();
  const text = `${error?.message ?? ""} ${error?.details ?? ""} ${error?.hint ?? ""}`.toLowerCase();

  if (code === "42703" || code === "PGRST204") {
    return text.includes("starts_at") || text.includes("ends_at");
  }

  return (
    text.includes("starts_at") ||
    text.includes("ends_at") ||
    text.includes("could not find the") ||
    text.includes("column")
  );
}
