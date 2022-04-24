import type { GetStaticProps } from 'next';
import { Fragment } from 'react';
import ffxiv from '../lib/ffxiv';
import type { XIVData, XIVPatchItem } from '../lib/ffxiv';

/**
 * 需要手动触发重新构建 (ISR 不支持无头浏览器运行)
 */
export const getStaticProps: GetStaticProps = async () => {
  const data = await ffxiv(true);
  return { props: { data } };
};

import styles from './ffxiv.module.scss';
import { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs, { isDST, tzdb } from '../utils/dayjs';
import ZButton from '../components/ZButton';
import ZCover from '../components/ZCover';
import ZList from '../components/ZList';
import ZSelect from '../components/ZSelect';
import { getLS, setLS } from '../utils/storage';

const infoList = [
  {
    title: '关于本站',
    content: '自 2020 年 2 月运营至今，国服最早的全区服狩猎时间汇总站',
  },
  {
    title: '数据更新',
    content:
      '数据更新后 CDN 缓存需要约 10-15 分钟全球刷新，若出现问题则最高需要 12 小时',
  },
  {
    title: '错误反馈',
    content: '请使用右下角按钮直接进行客服提问反馈，或至 NGA 原帖回帖反馈',
  },
  {
    title: 'NGA 原帖',
    content: (
      <a
        href='https://nga.178.com/read.php?tid=20339590'
        target='_blank'
        rel='noreferrer'
      >
        https://nga.178.com/read.php?tid=20339590
      </a>
    ),
  },
];

/**
 * 转换北京时间到目标时区
 * @param time 北京时间的 HH:mm
 * @param tz 目标时区
 */
function cstToTimeZone(time: string, tz: string) {
  // 获取当前北京时间的日期
  const cstDay = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD');
  // 合并北京时间的日期和时间
  const fullCSTTime = `${cstDay} ${time}`;
  // 转换为目标时区的时间
  return dayjs.tz(fullCSTTime, 'Asia/Shanghai').tz(tz);
}

interface TimeGridProps {
  times: string[];
  tz: string;
}

// 时间根据 24 小时制对应的百分比显示到对应位置
function TimeGrid({ times, tz }: TimeGridProps) {
  return (
    <div className={styles.timeGrid}>
      {times.map((time) => {
        const zonedTime = cstToTimeZone(time, tz);
        const zonedTimeString = zonedTime.format('HH:mm');
        return (
          <span key={time} className={styles.timeGridItem}>
            {zonedTimeString}
          </span>
        );
      })}
    </div>
  );
}

type DataCenter = 'chocobo' | 'moogle' | 'cat' | 'dog';

const validTabQuerys: Array<{ query: DataCenter; name: string }> = [
  { query: 'chocobo', name: '陆行鸟' },
  { query: 'moogle', name: '莫古力' },
  { query: 'cat', name: '猫小胖' },
  { query: 'dog', name: '豆豆柴' },
];

// 通过 Tab 名搜索数据的缓存
const dataSearchCache = new Map<DataCenter, XIVPatchItem[]>();

interface FFXIVProps {
  data: XIVData;
}

function FFXIV({ data }: FFXIVProps) {
  // 当前实际显示的 TabQuery
  const [curTab, setCurTab] = useState<DataCenter>('chocobo');
  const handleSwitchTab = useCallback((tab: DataCenter) => {
    setCurTab(tab);
    setLS('ffxiv-tab', tab);
  }, []);

  // 确保当前 Tab 更新
  useEffect(() => {
    const savedTab = getLS('ffxiv-tab');
    if (
      typeof savedTab === 'string' &&
      validTabQuerys.findIndex((v) => v.query === savedTab) >= 0
    ) {
      setCurTab(savedTab as DataCenter);
    }
  }, []);

  // 时区设置
  const [curTZ, setCurTZ] = useState('Asia/Shanghai');
  const handleTimeZoneChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTZ = e.target.value;
      setLS('ffxiv-tz', newTZ);
      setCurTZ(newTZ);
    },
    []
  );

  // 确保时区更新
  useEffect(() => {
    const savedTZ = getLS('ffxiv-tz');
    const guessTz = dayjs.tz.guess();
    if (typeof savedTZ === 'string' && tzdb.includes(savedTZ)) {
      setCurTZ(savedTZ);
    } else if (tzdb.includes(guessTz)) {
      setCurTZ(guessTz);
    }
  }, []);

  // 数据处理
  const dcPatches = useMemo(() => {
    // 寻找缓存
    const cached = dataSearchCache.get(curTab);
    if (cached) {
      return cached;
    }
    // 没有缓存查找数据
    const curDCName =
      validTabQuerys.find((v) => v.query === curTab)?.name || '';
    const curDCData = data?.dcs.find((v) => v.name === curDCName);
    const res = curDCData?.patches || [];
    dataSearchCache.set(curTab, res);
    return res;
  }, [curTab, data]);

  // 更新时间转换
  const updateMessage = useMemo(() => {
    const updateTime = dayjs(data?.stime || 0).tz(curTZ);
    let text = `生成于 ${updateTime.format('YYYY-MM-DD HH:mm')}`;
    if (isDST(updateTime)) {
      text += ' (DST)';
    }
    return text;
  }, [curTZ, data]);

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
        <div className={styles.tabs}>
          {validTabQuerys.map((tabQuery) => {
            return (
              <ZButton
                type={tabQuery.query === curTab ? 'primary' : 'transparent'}
                key={tabQuery.query}
                onClick={() => handleSwitchTab(tabQuery.query)}
              >
                {tabQuery.name}
              </ZButton>
            );
          })}
        </div>
        <div className={styles.update}>{updateMessage}</div>
        <div className={styles.selectGrid}>
          <span className={styles.tszspan}>时区</span>
          <ZSelect
            className={styles.tzselect}
            options={tzdb}
            value={curTZ}
            onChange={handleTimeZoneChange}
          />
        </div>
      </div>
      <div className={styles.content}>
        {!dcPatches.length && <div className={styles.empty}>暂无数据</div>}
        <table className={styles.table}>
          {dcPatches.map((patch) => {
            return (
              <Fragment key={patch.name}>
                <thead>
                  <tr>
                    <th className={styles.patch} colSpan={5}>
                      {patch.name}
                    </th>
                  </tr>
                  <tr>
                    <th>服务器</th>
                    <th className={styles.times}>时间表</th>
                    <th>始发地</th>
                    <th>路线</th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>
                  {patch?.servers.map((server) => {
                    return (
                      <tr key={server.name}>
                        <td>{server.name}</td>
                        <td className={styles.times}>
                          <TimeGrid times={server.times} tz={curTZ} />
                        </td>
                        <td>{server.start}</td>
                        <td>{server.route}</td>
                        <td>{server.comment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Fragment>
            );
          })}
        </table>
      </div>
      <ZList className={styles.notice} list={infoList} />
    </div>
  );
}

export default FFXIV;
