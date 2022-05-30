export const BANGUMI_CALENDAR = 'https://api.bgm.tv/calendar';

interface RawBangumiItem {
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
    common?: string;
    medium?: string;
    small?: string;
    grid?: string;
  };
  collection?: {
    doing: number;
  };
}

type RawBangumiData = Array<{
  weekday: { cn: string; id: number };
  items: RawBangumiItem[];
}>;

export interface BangumiAPIDataItem {
  id: number;
  url: string;
  rawName: string;
  transName?: string;
  image?: string;
  rating?: number;
  hot?: number;
}

export interface BangumiAPIDataDay {
  weekday: string;
  items: BangumiAPIDataItem[];
}

export type BangumiAPIData = BangumiAPIDataDay[];

async function bangumi() {
  const res = await fetch(BANGUMI_CALENDAR);
  const data: RawBangumiData = await res.json();
  // 解析数据
  let parsedData: BangumiAPIData | null = null;
  if (data && Array.isArray(data)) {
    parsedData = data.map((weekday) => {
      const parsed: BangumiAPIDataDay = {
        weekday: `${weekday.weekday.cn}`.replace('星期', '周'),
        items: [],
      };
      weekday.items.forEach((item) => {
        const ret: BangumiAPIDataItem = {
          id: item.id,
          url: `${item.url}`.replace(/https?:\/\//gi, '//'), // 确保链接不带协议
          rawName: item.name,
        };
        // 翻译名
        if (item.name_cn) {
          ret.transName = item.name_cn;
        }
        // 图片
        if (item.images) {
          let image = '';
          if (item.images.common) {
            image = item.images.common;
          } else if (item.images.medium) {
            image = item.images.medium;
          } else if (item.images.large) {
            image = item.images.large;
          }
          ret.image = `${image}`.replace(/https?:\/\//gi, '//');
        }
        // 评分和热度
        if (item.rating?.score) {
          ret.rating = item.rating.score;
        }
        if (item.collection?.doing) {
          ret.hot = item.collection.doing;
        }
        parsed.items.push(ret);
      });
      return parsed;
    });
  }
  return parsedData;
}

export default bangumi;
