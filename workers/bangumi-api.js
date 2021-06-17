/*! Custom API Proxy | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

// 无 trail 的 URL
const API_BASE = 'https://api.bgm.tv';
// 代理子路径
const PROXY_PATH = /^\/bgm-api(\/?.*)/;
// 伪造请求头
const FAKE_ORIGIN = 'https://bgm.tv';
const FAKE_REFERRER = 'https://bgm.tv/calendar';
// 允许的 CORS 来源
const ALLOWED_ORIGIN = [/^https?:\/\/.*dsrkafuu\.su$/, /^https?:\/\/localhost/];
// 是否拒绝所有无 Origin 请求
const ALLOW_NO_ORIGIN = false;
// 缓存控制
const CACHE_CONTROL = 'public, no-cache, must-revalidate';

/**
 * 验证 Origin
 * @param {Request} req
 * @return {boolean}
 */
function validateOrigin(req) {
  const origin = req.headers.get('Origin');
  if (origin) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true;
      }
    }
  }
  return ALLOW_NO_ORIGIN; // 是否拒绝所有无 Origin 请求
}

/**
 * 解析 API 请求路径
 * @param {Request} req
 * @return {string|null}
 */
function validatePath(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const exp = PROXY_PATH.exec(path);
  // `api.live.bilibili.com/data` => `workers.dsrkafuu.su/bilive/data`
  // `api.live.bilibili.com/` => `workers.dsrkafuu.su/bilive`
  if (exp && exp.length > 1) {
    return exp[1] || '';
  }
  return null;
}

/**
 * 响应 CORS OPTIONS 请求
 * @param {Request} req 源请求
 * @return {Response}
 */
function handleOptions(req) {
  const rawOrigin = req.headers.get('Origin');
  const rawMethod = req.headers.get('Access-Control-Request-Method');
  const rawHeaders = req.headers.get('Access-Control-Request-Headers');

  const res = new Response(null, { status: 200 });
  res.headers.set('Access-Control-Allow-Origin', rawOrigin);
  rawMethod && res.headers.set('Access-Control-Allow-Methods', rawMethod);
  rawHeaders && res.headers.set('Access-Control-Allow-Headers', rawHeaders);
  res.headers.set('Access-Control-Max-Age', 86400);
  // 设置 Vary 头使浏览器正确进行缓存
  res.headers.append('Vary', 'Accept-Encoding');
  res.headers.append('Vary', 'Origin');
  return res;
}

/**
 * 响应 CORS 请求 + 请求伪装
 * @param {Request} req 源请求
 * @param {string} path 解析后的 API 请求路径 (非 null)
 * @return {Response}
 */
async function handleRequest(req, path) {
  const rawURL = new URL(req.url);
  const rawOrigin = req.headers.get('Origin');
  const rawQuerys = rawURL.searchParams;

  // 迁移路径
  const proxyURL = new URL(API_BASE);
  proxyURL.pathname = (proxyURL.pathname + path).replace('//', '/'); // path 由 `/` 开头或为 ``
  // 迁移 query
  for (const [key, value] of rawQuerys) {
    proxyURL.searchParams.append(key, value);
  }

  // 发起代理请求
  req = new Request(proxyURL, req); // 覆盖源请求使其 muteable
  // 伪装 Origin
  req.headers.delete('Origin');
  FAKE_ORIGIN && req.headers.set('Origin', FAKE_ORIGIN);
  // 伪装 Referer
  req.headers.delete('Referer');
  FAKE_REFERRER && req.headers.set('Referer', FAKE_REFERRER);
  // 获取响应
  let res = await fetch(req);
  res = new Response(res.body, res); // 覆盖响应 response 使其 muteable

  res.headers.set('Access-Control-Allow-Origin', rawOrigin || '*');
  res.headers.set('Cache-Control', CACHE_CONTROL);
  // 设置 Vary 头使浏览器正确进行缓存
  res.headers.append('Vary', 'Accept-Encoding');
  res.headers.append('Vary', 'Origin');
  return res;
}

/**
 * 拒绝请求
 * @return {Response}
 */
async function handleReject() {
  return new Response('[CloudFlare Workers] REQUEST NOT ALLOWED', { status: 403 });
}

addEventListener('fetch', (event) => {
  // 获取请求的信息
  const req = event.request;
  // 验证和解析
  const validOrigin = validateOrigin(req);
  const validPath = validatePath(req);
  if (validOrigin && typeof validPath === 'string') {
    if (req.method === 'OPTIONS') {
      event.respondWith(handleOptions(req));
    } else {
      event.respondWith(handleRequest(req, validPath));
    }
  } else {
    event.respondWith(handleReject());
  }
});
