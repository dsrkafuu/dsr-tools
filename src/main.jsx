import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// sentry
import sentry from './plugins/sentry';
sentry();

// antd
import 'normalize.css';
import 'antd/es/style';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// app
import './css/global.scss';
import './css/utils.scss';
import App from './App';

ReactDOM.render(
  /* <React.StrictMode> */
  <ConfigProvider autoInsertSpaceInButton={false} locale={zhCN}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>,
  /* </React.StrictMode> */
  document.getElementById('root')
);
