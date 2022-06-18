interface BangumiAPIDataItem {
  id: number;
  rname: string;
  tname?: string;
  image?: string;
  rating?: number;
  hot?: number;
}
interface BangumiAPIDataDay {
  weekday: string;
  items: BangumiAPIDataItem[];
}
type BangumiAPIData = BangumiAPIDataDay[];

export type { BangumiAPIDataItem, BangumiAPIDataDay, BangumiAPIData };

export { default as default } from './Bangumi.vue';
