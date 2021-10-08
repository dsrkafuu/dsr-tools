import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs, Table, Card, List } from 'antd';
import 'antd/es/tabs/style';
import 'antd/es/table/style';
import 'antd/es/card/style';
import 'antd/es/list/style';
import './FFXIV.scss';
import dayjs from '@/utils/dayjs';
import Loading from '@/components/Loading';
import TZSelector from '@/components/TZSelector';
import { workers, api } from '@/utils/axios';
import { getLS, setLS } from '@/utils/storage';

// table titles
const tableTitles = ['5.X 暗影之逆焰', '4.X 红莲之狂潮'];
// now day in CST
const cstDay = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD');

function SettingsPanel({ value, onChange, update }) {
  const updateMessage = useMemo(() => {
    console.log(dayjs(update).tz(value));
    let text = `更新于 ${dayjs(update).tz(value).format('YYYY-MM-DD HH:mm:ss')}`;
    if (dayjs().isDST()) {
      text += ' (DST)';
    }
    return text;
  }, [update, value]);

  return (
    <div className='ffxiv-settings'>
      <div className='ffxiv-settings-update'>{updateMessage}</div>
      <div className='ffxiv-settings-tz'>
        <span>当前时区</span>
        <TZSelector value={value} onChange={onChange} />
      </div>
    </div>
  );
}

SettingsPanel.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  update: PropTypes.string.isRequired,
};

function FFXIV() {
  const [loading, setLoading] = useState(true);

  // metadata and server records
  const [meta, setMeta] = useState({ update: '', license: '' });
  const [data, setData] = useState({ chocobo: [], moogle: [], fatCat: [] });

  /**
   * fetch data from remote
   */
  const fetchData = useCallback(async () => {
    let res = null;
    let fallback = false;
    try {
      res = await workers.get('/dsr-cdn-api/dsr-tools/ffxiv/index.min.json');
      if (!res) {
        fallback = true;
      }
    } catch {
      fallback = true;
    }
    if (fallback) {
      res = await api.get('/dsr-tools/ffxiv/index.min.json');
    }
    if (res?.data) {
      const { data = {}, update = '', license = '' } = res.data;
      setMeta({ update, license });
      setData(data);
      setLoading(false);
    }
  }, []);
  useEffect(() => fetchData(), [fetchData]);

  // tab settings
  const tabPanes = useMemo(
    () => [
      { name: '陆行鸟', key: 'chocobo', records: data.chocobo },
      { name: '莫古力', key: 'moogle', records: data.moogle },
      { name: '猫小胖', key: 'fatcat', records: data.fatCat },
    ],
    [data]
  );

  // timezone configs
  const [curTZ, setCurTZ] = useState(() => {
    const savedTZ = getLS('ffxiv-tz');
    if (savedTZ) {
      return savedTZ;
    } else {
      return dayjs.tz.guess() || 'Asia/Shanghai';
    }
  });
  const handleTimeZoneChange = useCallback((tz) => {
    setLS('ffxiv-tz', tz);
    setCurTZ(tz);
  }, []);

  // table configs
  const render = useCallback(
    (t) => {
      if (!t) return '';
      return dayjs.tz(`${cstDay} ${t}`, 'Asia/Shanghai').tz(curTZ).format('HH:mm');
    },
    [curTZ]
  );
  const columns = useMemo(
    () => [
      { title: '服务器', dataIndex: 'server', key: 'server', align: 'center' },
      { title: '早车', dataIndex: ['times', '1'], key: 'times-1', align: 'center', render },
      { title: '午车', dataIndex: ['times', '2'], key: 'times-2', align: 'center', render },
      { title: '晚车', dataIndex: ['times', '3'], key: 'times-3', align: 'center', render },
      { title: '灵车', dataIndex: ['times', '0'], key: 'times-0', align: 'center', render },
      { title: '始发地', dataIndex: 'origin', key: 'origin', align: 'center' },
      { title: '路线', dataIndex: 'route', key: 'route', align: 'center' },
      { title: '备注', dataIndex: 'comment', key: 'comment', align: 'center' },
    ],
    [render]
  );
  const tableProps = useMemo(
    () => ({
      size: 'small',
      columns,
      pagination: false,
      scroll: { x: 'max-content' },
      rowKey: (record) => record.server,
    }),
    [columns]
  );

  // settings panel data
  const metaList = useMemo(
    () => [
      {
        title: '数据更新',
        desc: '数据更新后 CDN 缓存需要约 10-15 分钟全球刷新，若出现问题则最高需要 12 小时',
      },
      {
        title: '错误反馈',
        desc: '请使用右下角按钮直接进行客服提问反馈，或至 NGA 原帖回帖反馈',
      },
      {
        title: '感谢访问',
        desc: '如果觉得本站对您有所帮助还请多多分享，用户的使用是我更新的最大动力',
      },
      {
        title: 'NGA 原帖',
        desc: (
          <a href={meta.license} target='_blank'>
            {meta.license}
          </a>
        ),
      },
    ],
    [meta.license]
  );

  // router selected tab detector
  const history = useHistory();
  const [curTab, setCurTab] = useState(() => {
    const search = new URLSearchParams(history.location.search);
    return search.get('tab') || 'settings';
  });

  /**
   * @param {string} key
   */
  const onTabChange = useCallback(
    (key) => {
      setCurTab(key);
      const search = new URLSearchParams(history.location.search);
      search.set('tab', key);
      history.replace({ search: '?' + search.toString() });
    },
    [history]
  );

  return (
    <Loading loading={loading}>
      <div className='ffxiv'>
        <SettingsPanel value={curTZ} onChange={handleTimeZoneChange} update={meta.update} />
        <Tabs
          type='card'
          size='large'
          centered={true}
          animated={true}
          onChange={onTabChange}
          defaultActiveKey={curTab}
          activeKey={curTab}
        >
          <Tabs.TabPane tab='关于' key='settings' className='tabs-settings'>
            <Card>
              <List
                dataSource={metaList}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.title} description={item.desc} />
                  </List.Item>
                )}
              ></List>
            </Card>
          </Tabs.TabPane>
          {tabPanes.map((dataCenter) => (
            <Tabs.TabPane tab={dataCenter.name} key={dataCenter.key}>
              {tableTitles.map((title, idx) => (
                <Table
                  {...tableProps}
                  key={title}
                  title={() => title}
                  dataSource={dataCenter.records[idx]}
                />
              ))}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </Loading>
  );
}

export default FFXIV;
