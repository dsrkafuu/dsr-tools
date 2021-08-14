import React, { memo } from 'react';
import { useHistory } from 'react-router';
import { Button, Result } from 'antd';
import { ReactComponent as ConstructionIcon } from '@/assets/svg/construction.svg';

function Construction() {
  const history = useHistory();

  return (
    <div className='construction'>
      <Result
        icon={<ConstructionIcon style={{ width: '168px', height: '168px' }} />}
        title='页面施工中'
        extra={
          <Button type='primary' onClick={() => history.goBack()}>
            返回
          </Button>
        }
      />
    </div>
  );
}

export default memo(Construction);
