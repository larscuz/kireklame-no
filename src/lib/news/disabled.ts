import { NextResponse } from "next/server";

export const NEWS_FEATURE_DISABLED = true;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export function newsGoneJsonResponse() {
  return NextResponse.json(
    { ok: false, error: "news_removed" },
    {
      status: 410,
      headers: NO_STORE_HEADERS,
    }
  );
}

export function newsGoneTextResponse(contentType = "text/plain; charset=utf-8") {
  return new NextResponse("Gone", {
    status: 410,
    headers: {
      ...NO_STORE_HEADERS,
      "Content-Type": contentType,
    },
  });
}
