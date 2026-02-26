export type FreeModelRankingCategoryId = "text" | "image" | "video" | "audio";

export type FreeModelRankingSignals = {
  serpVisibility: number;
  platformTrust: number;
  freeTierStrength: number;
  momentum: number;
  reliability: number;
  communityDemand: number;
};

export type FreeModelRankingItem = {
  id: string;
  name: string;
  href: string;
  note: string;
  signals: FreeModelRankingSignals;
};

export type FreeModelRankingCategory = {
  id: FreeModelRankingCategoryId;
  title: string;
  items: FreeModelRankingItem[];
};
