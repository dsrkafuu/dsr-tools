import { GetStaticProps } from 'next';
import { useState } from 'react';
import ZButton from '../components/ZButton';
import ZCover from '../components/ZCover';
import ZRadio from '../components/ZRadio';
import { fetchAPI } from '../lib/api';

interface RawBangumiAPIDataItem {
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
    common?: string;
    large?: string;
  };
  collection?: {
    doing: number;
  };
}

type RawBangumiAPIData = Array<{
  weekday: { cn: string; id: number };
  items: RawBangumiAPIDataItem[];
}>;

interface BangumiAPIDataItem {
  id: number;
  url: string;
  rawName: string;
  transName?: string;
  previewImage?: string;
  largeImage?: string;
  raiting?: number;
  hot?: number;
}

type BangumiAPIData = Array<{
  weekday: string;
  items: BangumiAPIDataItem[];
}>;

/**
 * 每日重新生成页面刷新数据
 */
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetchAPI('/bangumi/calendar');
  const data = res.status ? (res.data as RawBangumiAPIData) : null;
  // 解析数据
  let parsedData: BangumiAPIData | null = null;
  if (data && Array.isArray(data)) {
    parsedData = data.map((weekday) => {
      const parsed: {
        weekday: string;
        items: BangumiAPIDataItem[];
      } = {
        weekday: weekday.weekday.cn,
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
        if (item.images && item.images.common) {
          let img: string | undefined = item.images.common;
          ret.previewImage = `${img}`.replace(/https?:\/\//gi, '//');
          img = item.images.large;
          if (img) {
            ret.largeImage = `${img}`.replace(/https?:\/\//gi, '//');
          }
        }
        // 评分和热度
        if (item.rating?.score) {
          ret.raiting = item.rating.score;
        }
        if (item.collection?.doing) {
          ret.hot = item.collection.doing;
        }
        parsed.items.push(ret);
      });
      return parsed;
    });
  }
  return {
    props: {
      data: parsedData,
    },
    revalidate: 86400,
  };
};

import styles from './bangumi.module.scss';

/**
 * 解析日期 id 为中文星期几
 */
function formatWeekday(day: number) {
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
  return '星期' + (dayNames[day] || ' ?');
}

/**
 * 将 10 分制评分对应到五星制评分；
 * 返回数组第一项为 10 分制评分，第二项为五星制评分
 */
function formatRating(score = 0) {
  const rating = (Math.ceil(score) / 2).toFixed(1);
  const _score = score.toFixed(1);
  return [_score, rating];
}

/**
 * 格式化热度数据
 */
function formatHot(hot = 0) {
  let res: string[] = [];
  if (hot > 10000) {
    res = (hot / 1000).toFixed(2).split('');
    // remove end 0
    while (res[res.length - 1] === '.' || res[res.length - 1] === '0') {
      res.pop();
    }
    return `${res.join('')}k`;
  } else if (hot) {
    return `${hot}`;
  } else {
    return '';
  }
}

interface BangumiProps {
  data: BangumiAPIData | null;
}

function Bangumi({ data }: BangumiProps) {
  const [curWeekdayIdx, setCurWeekdayIdx] = useState(0);
  const [sortRule, setSortRule] = useState(0);

  if (!data) {
    return (
      <div className={styles.container}>
        <ZCover type='error' />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.control}>
        <div className={styles.weekday}>
          {data.map((weekday, idx) => (
            <ZButton
              type={idx === curWeekdayIdx ? 'primary' : 'transparent'}
              key={idx}
              onClick={() => setCurWeekdayIdx(idx)}
            >
              {weekday.weekday}
            </ZButton>
          ))}
        </div>
        <div className={styles.sorter}>
          <ZRadio value={sortRule === 0} onChange={() => setSortRule(0)}>
            热度排序
          </ZRadio>
          <ZRadio value={sortRule === 1} onChange={() => setSortRule(1)}>
            评分排序
          </ZRadio>
        </div>
      </div>
      <div className={styles.content}></div>
    </div>
  );
}

export default Bangumi;
