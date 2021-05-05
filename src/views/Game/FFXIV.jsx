import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';

import { Tabs, Table, Card, Alert, List } from 'antd';
import 'antd/lib/tabs/style/index.less';
import 'antd/lib/table/style/index.less';
import 'antd/lib/empty/style/index.less'; // table empty
import 'antd/lib/card/style/index.less';
import 'antd/lib/alert/style/index.less';
import 'antd/lib/list/style/index.less';

import './FFXIV.scss';
import dayjs from '@/utils/dayjs';
import Loading from '@/components/Loading';
import { workers, api } from '@/utils/axios';
import { setLS, getLS } from '@/utils/storage';

const shadowbringers = () => '5.X SHADOWBRINGERS';
const stormblood = () => '4.X STORMBLOOD';

function FFXIV() {
  const [loading, setLoading] = useState(true);

  // metadata
  const [meta, setMeta] = useState({ message: '', update: '', license: '' });
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

  // server records
  const [data, setData] = useState({ chocobo: [], moogle: [], fatCat: [] });

  /**
   * fetch data from remote
   */
  const fetchData = useCallback(async () => {
    let res = null;
    res = await workers.get('/ffxiv-hunting');
    if (!res) {
      res = await api.get('/dsr-tools/ffxiv/index.min.json');
    }
    if (res?.data) {
      setMeta({
        message: res.data.message || '',
        update: res.data.update,
        license: res.data.license,
      });
      setData(res.data.data);
      setLoading(false);
    }
  }, []);
  useEffect(() => fetchData(), [fetchData]);

  // table configs
  const render = useCallback((t) => {
    if (!t) {
      return '';
    }
    return dayjs.tz(`2000-01-01 ${t}`, 'Asia/Shanghai').local().format('HH:mm');
  }, []);
  const columns = useMemo(
    () => [
      { title: '服务器', dataIndex: 'server', key: '服务器', align: 'center' },
      { title: '早车', dataIndex: ['times', '1'], key: '早车', align: 'center', render },
      { title: '午车', dataIndex: ['times', '2'], key: '午车', align: 'center', render },
      { title: '晚车', dataIndex: ['times', '3'], key: '晚车', align: 'center', render },
      { title: '灵车', dataIndex: ['times', '0'], key: '灵车', align: 'center', render },
      { title: '始发地', dataIndex: 'origin', key: '始发地', align: 'center' },
      { title: '路线', dataIndex: 'route', key: '路线', align: 'center' },
      { title: '备注', dataIndex: 'comment', key: '备注', align: 'center' },
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
  const tabPanes = useMemo(
    () => [
      { name: '陆行鸟', records: data.chocobo },
      { name: '莫古力', records: data.moogle },
      { name: '猫小胖', records: data.fatCat },
    ],
    [data.chocobo, data.fatCat, data.moogle]
  );

  // selected tab saver
  const savedTab = useMemo(() => getLS('ffxiv-tab') || '', []);
  /**
   * @param {string} key
   */
  const saveTab = useCallback((key) => setLS('ffxiv-tab', key), []);

  const statusMessage = useMemo(() => {
    let text = `更新于 ${dayjs(meta.lastUpdate).format('YYYY-MM-DD HH:mm:ss')}`;
    const tz = dayjs.tz.guess();
    if (tz) {
      text += ` | 时区 ${dayjs.tz.guess().replace(/\//gi, ' / ')}`;
    }
    return text;
  }, [meta.lastUpdate]);

  return (
    <Loading loading={loading}>
      <div className='ffxiv'>
        <div className='messages'>
          {meta.message && <Alert message={meta.message} type='error' showIcon={true} />}
          <Alert message={statusMessage} type='success' showIcon={true} />
        </div>
        <Tabs
          type='card'
          size='large'
          centered={true}
          animated={true}
          onChange={saveTab}
          defaultActiveKey={savedTab}
        >
          <Tabs.TabPane tab='关于' key='关于' className='tabs-about'>
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
            <Tabs.TabPane tab={dataCenter.name} key={dataCenter.name}>
              <Table {...tableProps} dataSource={dataCenter.records[0]} title={shadowbringers} />
              <Table {...tableProps} dataSource={dataCenter.records[1]} title={stormblood} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </Loading>
  );
}

export default memo(FFXIV);
