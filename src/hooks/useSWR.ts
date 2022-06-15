/**
 * 带缓存的 JSON 资源请求 (SWR)
 */
import type { AxiosRequestConfig } from '../utils/axios';
import { ref } from 'vue';
import { nanoid } from 'nanoid';
import stableHash from 'stable-hash';
import { getLS, setLS } from '../utils/storage';
import axios from '../utils/axios';
import { log } from '../utils/logger';
import { AxiosResponse } from 'axios';
import ZMessage from '../components/ZMessage';

/**
 * 将 URL 解析为标准 key，
 * 不包含协议和 hash，有序 query
 */
function formatURL(url: string) {
  url = decodeURI(url);
  const _url = new URL(url);
  let ret = _url.host + _url.pathname;
  if (_url.search) {
    ret += '?' + _url.search.replace(/\?/g, '').split('&').sort().join('&');
  }
  return ret;
}

// url 对应 nanoid 的 map
interface CacheIDMap {
  [key: string]: string;
}
let cacheMap: CacheIDMap = {};
const savedMap = getLS<CacheIDMap>('cache');
if (savedMap && typeof savedMap === 'object') {
  cacheMap = savedMap;
}
const uniquekeyMap = new Set(Object.values(cacheMap));

/**
 * 设置缓存
 */
function setCache(url: string, data: unknown) {
  // 格式化 URL
  const _url = formatURL(url);
  // 初始化缓存 key
  let cacheKey: string;
  // 更新缓存
  if (cacheMap[_url]) {
    cacheKey = cacheMap[_url];
  } else {
    cacheKey = nanoid();
    while (uniquekeyMap.has(cacheKey)) {
      cacheKey = nanoid();
    }
    cacheMap[_url] = cacheKey;
    setLS('cache', cacheMap);
  }
  setLS(`cache:${cacheKey}`, data);
  log('swr cache set', cacheKey);
}

/**
 * 获取缓存
 */
function getCache<T>(url: string): T | null {
  // 格式化 URL
  const _url = formatURL(url);
  // 查找缓存 key
  const cacheKey = cacheMap[_url];
  if (!cacheKey) {
    return null;
  }
  // 获取缓存数据
  const cache = getLS<T>(`cache:${cacheKey}`);
  if (cache) {
    log('swr cache hit', cacheKey);
  }
  return cache;
}

const ALLOWED_TYPES = ['application/json', 'text/plain'];
/**
 * 检查是否可缓存
 */
function allowCache(res: AxiosResponse) {
  return (
    res.status >= 200 &&
    res.status < 300 &&
    ALLOWED_TYPES.includes(res.headers['content-type']) &&
    res.data
  );
}

/**
 * 带缓存的请求工具，仅适用于 GET
 */
function useSWR<T>(url: string, config?: AxiosRequestConfig) {
  const _url = new URL(url);
  if (config?.params) {
    _url.search = '?' + new URLSearchParams(config.params).toString();
  }
  const cache = getCache(_url.toString());

  const stale = ref(true);
  const data = ref((cache as T) || null);

  axios
    .get(url, config)
    .then((res) => {
      // 检查数据是否更改
      if (stableHash(data.value) !== stableHash(res.data)) {
        // 检查是否可缓存
        if (allowCache(res)) {
          setCache(_url.toString(), res.data);
        }
        data.value = res.data;
        ZMessage.success('已更新数据');
      }
      stale.value = false;
    })
    .catch((e) => {
      console.error(e);
    });

  return {
    stale,
    data,
  };
}

export default useSWR;
