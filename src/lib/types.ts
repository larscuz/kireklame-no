export type Location = {
  id: string;
  name: string;
  slug: string;
  region: string | null;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  kind: string;
};

export type LinkRow = {
  id: string;
  kind: string;
  label: string | null;
  url: string;
};

export type CompanyCardModel = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  ai_level: number;
  price_level: number;
  company_type: string;
  cover_image: string | null;
  video_url?: string | null;
  is_verified: boolean;
  is_placeholder: boolean;
  location: { name: string; slug: string } | null;
  tags: Array<{ name: string; slug: string }>;
};

export type CompanyDetailModel = CompanyCardModel & {
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  links: LinkRow[];
};

export type FacetOption = { value: string; label: string };
