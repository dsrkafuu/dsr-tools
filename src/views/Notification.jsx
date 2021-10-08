import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Result, Alert, Typography, Space } from 'antd';
import 'antd/es/button/style';
import 'antd/es/result/style';
import 'antd/es/alert/style';
import 'antd/es/typography/style';
import 'antd/es/space/style';
import { setLS, getLS } from '@/utils/storage';
import notification from '@/notification';
const { show, key, type, title, content } = notification;

export function NotificationBanner() {
  const history = useHistory();

  const [showBanner, setShowBanner] = useState(show && !getLS(key));
  const closeBanner = useCallback(() => {
    setShowBanner(false);
    setLS(key, true);
  }, []);

  if (showBanner) {
    return (
      <Alert
        type={type}
        message={title}
        banner={true}
        action={
          <Space>
            <Button size='small' onClick={() => history.push('/notification')}>
              了解详情
            </Button>
            <Button size='small' danger={true} onClick={closeBanner}>
              忽略通知
            </Button>
          </Space>
        }
      />
    );
  } else {
    return null;
  }
}

function Notification() {
  const history = useHistory();

  return (
    <div className='notification'>
      <Result
        type={type}
        title={title}
        extra={
          <Button type='primary' onClick={() => history.goBack()}>
            返回
          </Button>
        }
      >
        <Typography>{content}</Typography>
      </Result>
    </div>
  );
}

export default Notification;
