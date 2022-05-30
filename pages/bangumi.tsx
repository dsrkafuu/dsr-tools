import type { GetStaticProps } from 'next';
import type {
  BangumiAPIDataDay,
  BangumiAPIData,
  BangumiAPIDataItem,
} from '../lib/bangumi';
import bangumi from '../lib/bangumi';

/**
 * 需要手动触发重新构建
 */
export const getStaticProps: GetStaticProps = async () => {
  const data = await bangumi();
  return {
    props: { data },
  };
};

import styles from './bangumi.module.scss';
import { useCallback, useMemo, useState } from 'react';
import ZButton from '../components/ZButton';
import ZCover from '../components/ZCover';
import ZRadio from '../components/ZRadio';
import { FireAlt } from '../icons';

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
                    <img
                      src={`https:${item.image}`}
                      width='80'
                      height='80'
                      referrerPolicy='no-referrer'
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
                      <div className={styles.ratingbar}>
                        <div
                          className={styles.ratinginner}
                          style={{
                            width: `${Math.round(
                              ((item.rating || 0) / 10) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      {typeof item.rating === 'number' && item.rating
                        ? item.rating.toFixed(1)
                        : '-.-'}
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
  const [curWeekdayIdx, setCurWeekdayIdx] = useState(3);
  const [sortRule, setSortRule] = useState(0);

  const sorter = useCallback(
    (a: BangumiAPIDataItem, b: BangumiAPIDataItem) => {
      if (sortRule === 0) {
        return (b.hot || 0) - (a.hot || 0);
      } else {
        return (b.rating || 0) - (a.rating || 0);
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
