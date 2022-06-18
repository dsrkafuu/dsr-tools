export interface BangumiAPIDataItem {
  id: number;
  rname: string;
  tname?: string;
  image?: string;
  rating?: number;
  hot?: number;
}

export interface BangumiAPIDataDay {
  weekday: string;
  items: BangumiAPIDataItem[];
}

export type BangumiAPIData = BangumiAPIDataDay[];
