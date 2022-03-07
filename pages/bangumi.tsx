import { GetStaticProps } from 'next';

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
  image?: string;
  raiting?: number;
  hot?: number;
}

interface BangumiAPIDataDay {
  weekday: string;
  items: BangumiAPIDataItem[];
}

type BangumiAPIData = BangumiAPIDataDay[];

/**
 * 每周重新生成页面刷新数据
 */
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetchAPI('/bangumi/calendar');
  const data = (res as RawBangumiAPIData) || null;
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
        if (item.images && item.images.large) {
          ret.image = `${item.images.large}`.replace(/https?:\/\//gi, '//');
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
    revalidate: 604800,
  };
};

import styles from './bangumi.module.scss';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import ZButton from '../components/ZButton';
import ZCover from '../components/ZCover';
import ZRadio from '../components/ZRadio';
import { Rating } from 'react-simple-star-rating';
import { FireAlt, Star } from '../icons';

/**
 * 格式化热度数据
 */
function formatHot(hot = 0) {
  return `${hot}`;
}

interface BangumiDayProps {
  data: BangumiAPIDataDay | null;
}

function BangumiDay({ data }: BangumiDayProps) {
  if (!data) {
    return <div className={styles.day}></div>;
  }
  return (
    <div className={styles.day}>
      <div className={styles.daycard}>
        <div className={styles.daytitle}>{data.weekday}</div>
        <div className={styles.daylist}>
          {data.items.map((item) => {
            return (
              <a
                key={item.id}
                className={styles.dayitem}
                href={item.url}
                target='_blank'
                rel='noopener'
              >
                <div className={styles.dayimage}>
                  {item.image ? (
                    <Image
                      src={`https:${item.image}`}
                      width={80}
                      height={80}
                      objectFit='cover'
                    />
                  ) : null}
                </div>
                <div className={styles.daymeta}>
                  <h3 className={styles.dayname}>{item.rawName}</h3>
                  {item.transName && (
                    <span className={styles.daytrans}>{item.transName}</span>
                  )}
                  <div className={styles.dayscore}>
                    <div className={styles.rating}>
                      <Rating
                        className={styles.rtpn}
                        ratingValue={(item.raiting || 0) * 10}
                        readonly={true}
                        allowHalfIcon={true}
                        allowHover={false}
                        fillColor='#8aa2d3'
                        fullIcon={<Star />}
                        emptyIcon={<Star />}
                      />
                      {(item.raiting || 0).toFixed(1)}
                    </div>
                    <div className={styles.hot}>
                      {formatHot(item.hot)}
                      <FireAlt />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface BangumiProps {
  data: BangumiAPIData | null;
}

function Bangumi({ data }: BangumiProps) {
  const [curWeekdayIdx, setCurWeekdayIdx] = useState(0);
  const [sortRule, setSortRule] = useState(0);

  const sorter = useCallback(
    (a: BangumiAPIDataItem, b: BangumiAPIDataItem) => {
      if (sortRule === 0) {
        return (b.hot || 0) - (a.hot || 0);
      } else {
        return (b.raiting || 0) - (a.raiting || 0);
      }
    },
    [sortRule]
  );

  const todayData = useMemo(() => {
    const _data = data?.[curWeekdayIdx];
    if (!_data) {
      return null;
    }
    return {
      weekday: _data.weekday,
      items: _data.items.sort(sorter),
    };
  }, [curWeekdayIdx, data, sorter]);
  const prevdayData = useMemo(() => {
    const idx = curWeekdayIdx - 1;
    if (idx > 7 || idx < 0) {
      return null;
    }
    const _data = data?.[idx];
    if (!_data) {
      return null;
    }
    return {
      weekday: _data.weekday,
      items: _data.items.sort(sorter),
    };
  }, [curWeekdayIdx, data, sorter]);
  const nextdayData = useMemo(() => {
    const idx = curWeekdayIdx + 1;
    if (idx > 7 || idx < 0) {
      return null;
    }
    const _data = data?.[idx];
    if (!_data) {
      return null;
    }
    return {
      weekday: _data.weekday,
      items: _data.items.sort(sorter),
    };
  }, [curWeekdayIdx, data, sorter]);

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
      <div className={styles.content}>
        <BangumiDay data={prevdayData} />
        <BangumiDay data={todayData} />
        <BangumiDay data={nextdayData} />
      </div>
    </div>
  );
}

export default Bangumi;
