const API_BASE = 'https://api.live.bilibili.com';
const PROXY_PATH = /^\/bilive(\/?.*)/;
const ALLOWED_ORIGIN = [
  /^https?:\/\/tools\.dsrkafuu\.su/,
  /^https?:\/\/dsr-tools-bilive\.dsrkafuu\.workers\.dev/,
  /^https?:\/\/localhost/,
];
const FAKE_ORIGIN = 'https://live.bilibili.com';
const FAKE_REFERRER = 'https://live.bilibili.com/139';
const CACHE_CONTROL = 'public, no-cache, must-revalidate';

/**
 * 验证 Origin
 * @param {Request} request
 * @return {boolean}
 */
function validateOrigin(request) {
  const origin = request.headers.get('Origin');
  if (origin) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true;
      }
    }
  }
  // 拒绝所有无 Origin 请求
  return false;
}

/**
 * 解析 API 请求路径
 * @param {Request} request
 * @return {string}
 */
function validatePath(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const exp = PROXY_PATH.exec(path);
  if (exp) {
    // `api.live.bilibili.com/data` => `workers.dsrkafuu.su/bilive/data`
    if (exp[1]) {
      return exp[1];
    }
    // `api.live.bilibili.com/` => `workers.dsrkafuu.su/bilive`
    else if (exp[1] === '') {
      return '/';
    }
  }
  return '';
}

/**
 * 添加 CORS 头 + Referer 伪装
 * @param {Request} request 源请求
 * @param {string} path 解析后的 API 请求路径
 * @return {Response}
 */
async function handleRequest(request, path) {
  const rawURL = new URL(request.url);
  const rawOrigin = request.headers.get('Origin');
  const rawParams = rawURL.searchParams;

  const reqURL = new URL(API_BASE);
  // 迁移属性
  reqURL.pathname = path;
  for (const [key, value] of rawParams) {
    reqURL.searchParams.append(key, value);
  }
  // 发起代理请求
  request = new Request(reqURL, request); // 覆盖源 request
  request.headers.set('Origin', FAKE_ORIGIN); // 伪装 Origin
  request.headers.set('Referer', FAKE_REFERRER); // 伪装 Referer
  let res = await fetch(request); // 获取响应
  res = new Response(res.body, res); // 覆盖响应 response 使其 muteable

  res.headers.set('Access-Control-Allow-Origin', rawOrigin); // 设置 CORS 头
  res.headers.append('Vary', 'Origin'); // 设置 Vary 头使浏览器正确进行缓存
  res.headers.set('Cache-Control', CACHE_CONTROL); // 设置 Cache-Control
  return res;
}

/**
 * 拒绝请求
 * @return {Response}
 */
async function handleReject() {
  const res = new Response('[CloudFlare Workers] REQUEST NOT ALLOWED', { status: 403 });
  return res;
}

addEventListener('fetch', (event) => {
  // 获取请求的信息
  const request = event.request;
  // 验证和解析
  const validOrigin = validateOrigin(request);
  const validPath = validatePath(request);
  if (validOrigin && validPath) {
    event.respondWith(handleRequest(request, validPath));
  } else {
    event.respondWith(handleReject());
  }
});
