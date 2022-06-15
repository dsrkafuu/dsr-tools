import axios from 'axios';
import ZMessage from '../components/ZMessage';

const inst = axios.create({
  timeout: 10000,
});

inst.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    ZMessage.error('数据请求出现错误');
    return Promise.reject(error);
  }
);

export default inst;

export type { AxiosRequestConfig } from 'axios';
