export const BANGUMI_CALENDAR = 'https://api.bgm.tv/calendar';

export interface BangumiItem {
  id: number;
  url: string;
  name: string;
  name_cn?: string;
  rating?: {
    total: number;
    count: { [key: number]: number };
    score: number;
  };
  images?: {
    large?: string;
  };
  collection?: {
    doing: number;
  };
}

export type BangumiData = Array<{
  weekday: { cn: string; id: number };
  items: BangumiItem[];
}>;

async function bangumi() {
  const res = await fetch(BANGUMI_CALENDAR);
  const data: BangumiData = await res.json();
  return data;
}

export default bangumi;
