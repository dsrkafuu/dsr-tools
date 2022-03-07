const API_BASE = 'https://api.dsrkafuu.net';
const API_VERSION = 'v2';
const REFERRER = 'https://tools.dsrkafuu.net';

/**
 * @param path 以 / 开头的 API 路径
 */
export async function fetchAPI(path: string) {
  const url = new URL(`/${API_VERSION}` + path, API_BASE);
  const req = new Request(url.toString());
  req.headers.set('Referer', REFERRER);

  const res = await (await fetch(req)).json();
  return res as unknown;
}
