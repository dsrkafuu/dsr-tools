import axios from 'axios';
import useSWR from 'swr';
import jsdelivr from '@/utils/jsdelivr';

const ainst = axios.create({ timeout: 10000 });
const fetcher = (url) => ainst.get(url).then((res) => res.data);

/**
 * @param {string} path bangumi api path
 */
export function useSWRBGM(path) {
  return useSWR(`https://workers.dsrkafuu.su/bgm-api${path}`, fetcher);
}

/**
 * @param {string} path resource path
 * @param {boolean} workers use CloudFlare Workers
 */
export function useSWRAPI(path, workers = false) {
  if (workers) {
    return useSWR(`https://workers.dsrkafuu.su/dsr-cdn-api/dsr-tools${path}`, fetcher);
  } else {
    return useSWR(jsdelivr(`/dsr-tools${path}`, 'dsr-cdn-api'), fetcher);
  }
}

/**
 * @param {string} path resource path
 */
export function useSWRCDN(path) {
  return useSWR(jsdelivr(path, 'dsr-cdn-main'), fetcher);
}
