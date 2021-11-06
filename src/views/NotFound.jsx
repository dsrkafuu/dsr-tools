import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import 'antd/es/button/style';
import 'antd/es/result/style';

function NotFound() {
  const navigate = useNavigate();

  // count down
  const [counter, setCounter] = useState(8);
  useEffect(() => {
    const timer = setInterval(() => setCounter((val) => val - 1), 1000);
    return () => clearInterval(timer);
  }, []);
  if (counter === 0) {
    history.push('/');
  }

  return (
    <div className='not-found'>
      <Result
        status='warning'
        title='404 NOT FOUND'
        extra={
          <Button type='primary' onClick={() => navigate('/')}>
            返回首页「{counter}」
          </Button>
        }
      />
    </div>
  );
}

export default NotFound;
