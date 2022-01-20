const API_BASE = 'https://api.dsrkafuu.net';
const API_VERSION = 'v1';
const REFERRER = 'https://tools.dsrkafuu.net';

export interface APIResponseData {
  time: number;
  status: boolean;
  data: unknown;
}

/**
 * @param path 以 / 开头的 API 路径
 */
export async function fetchAPI(path: string) {
  const url = new URL(`/${API_VERSION}` + path, API_BASE);
  const req = new Request(url.toString());
  req.headers.set('Referer', REFERRER);

  const res: APIResponseData = await (await fetch(req)).json();
  return res;
}
