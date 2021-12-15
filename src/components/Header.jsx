import './Header.scss';
import 'antd/es/button/style';
import 'antd/es/message/style';
import 'antd/es/page-header/style';
import 'antd/es/popover/style';
import { Button, message, PageHeader, Popover } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShareAltOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import dayjs from '@/utils/dayjs';
import useRoute from '@/hooks/route';
import QRCode from './QRCode';

function Header({ collapsed, onCollapsedChange }) {
  // title
  const route = useRoute();
  const title = useMemo(() => route?.meta?.name || '', [route?.meta?.name]);

  // time updater
  const [clock, setClock] = useState(dayjs().format('HH:mm:ss'));
  useEffect(() => {
    const timer = setInterval(() => setClock(dayjs().format('HH:mm:ss')), 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * copy page link
   */
  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(
      () => message.success('已复制链接至剪贴板'),
      () => message.error('复制链接失败')
    );
  }, []);

  return (
    <PageHeader
      className='header'
      ghost={false}
      backIcon={
        <Button type='primary' icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
      }
      onBack={onCollapsedChange}
      title={title}
      subTitle='DSRToolS'
      extra={[
        <Button className='header__clock' type='text' key='time'>
          {clock}
        </Button>,
        <Button
          type='primary'
          key='refresh'
          icon={<SyncOutlined />}
          onClick={() => window.location.reload()}
        />,
        <Popover
          key='share'
          trigger='click'
          content={
            <>
              <QRCode className='header__qrcode' content={window.location.href} />
              <Button className='header__copy' block={true} type='primary' onClick={copyShareLink}>
                复制链接
              </Button>
            </>
          }
        >
          <Button type='primary' icon={<ShareAltOutlined />} />
        </Popover>,
      ]}
    />
  );
}

Header.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onCollapsedChange: PropTypes.func.isRequired,
};

export default Header;
