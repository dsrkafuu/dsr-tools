import './Loading.scss';
import 'antd/es/spin/style';
import 'antd/es/button/style';
import 'antd/es/result/style';
import { Spin, Result, Button } from 'antd';
import PropTypes from 'prop-types';

function Loading({ isLoading, isError, children }) {
  if (isError) {
    return (
      <div className='loading'>
        <div className='loading__overlay'>
          <Result
            type='error'
            title='资源加载发生错误'
            extra={
              <Button type='primary' onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            }
          />
        </div>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className='loading'>
        <div className='loading__overlay'>
          <Spin size='large' />
        </div>
        {isLoading ? null : children}
      </div>
    );
  } else {
    return children;
  }
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  children: PropTypes.element,
};

export default Loading;
