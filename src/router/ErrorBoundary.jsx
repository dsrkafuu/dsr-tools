import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Result } from 'antd';
import 'antd/es/button/style';
import 'antd/es/result/style';

class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  /**
   * update state so the next render will show the fallback UI
   * @param {Error} error
   */
  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className='error-boundary'>
          <Result
            type='error'
            title='发生了某些错误'
            extra={
              <Button type='primary' onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            }
          >
            <pre className='code' style={{ margin: '0', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
            </pre>
          </Result>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element,
};

export default ErrorBoundary;
