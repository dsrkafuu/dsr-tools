import puppeteer, { Browser } from 'puppeteer';
import { load } from 'cheerio';
import fs from 'fs';
import ffxivStaticData from '../data/ffxiv/index.json';

export const DCS = ['陆行鸟', '莫古力', '猫小胖', '豆豆柴'];
export const PATCHES = ['晓月之终途', '暗影之逆焰', '红莲之狂潮'];

export interface XIVServerItem {
  name: string;
  times: string[];
  start: string;
  route: string;
  comment: string;
}
export interface XIVPatchItem {
  name: string;
  servers: XIVServerItem[];
}
export interface XIVDCItem {
  name: string;
  patches: XIVPatchItem[];
}
export interface XIVData {
  stime: number;
  dcs: XIVDCItem[];
}

/**
 * 生成输出模板
 */
function getOutputTemplate() {
  const arr = [] as XIVDCItem[];
  DCS.forEach((dc) => {
    const patches = [] as XIVPatchItem[];
    PATCHES.forEach((patch) => {
      patches.push({ name: patch, servers: [] });
    });
    arr.push({ name: dc, patches });
  });
  return arr;
}

/**
 * 等待毫秒
 */
async function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * 格式化时间
 */
function formatTime(str: string) {
  if (typeof str !== 'string') {
    return '';
  }
  // 确认冒号
  str = str.replace(/：/g, ':');
  // 移除无用字符
  str = str.replace(/[^0-9:]/g, '');
  // 检查是否为有效时间
  if (!/^[0-9]+:[0-9]+$/.test(str)) {
    return '';
  }
  // 检查是否缺位
  if (str.length !== 5) {
    const arr = str.split(':');
    if (arr[0].length !== 2) {
      arr[0] = '0' + arr[0];
    }
    if (arr[1].length !== 2) {
      arr[1] = '0' + arr[1];
    }
    str = arr.join(':');
  }
  return str;
}

/**
 * 解析车次
 */
function parseTimes(str: string) {
  if (!str || typeof str !== 'string') {
    return null;
  }
  const regexp = /\d\d[：:]\d\d/g;
  const res = [];
  let tmp = regexp.exec(str);
  while (tmp && tmp[0]) {
    const time = formatTime(tmp[0]);
    time && res.push(tmp[0]);
    tmp = regexp.exec(str);
  }
  // 排序班次
  res.sort((a, b) => {
    const aNum = Number.parseInt(a.replace(':', ''));
    const bNum = Number.parseInt(b.replace(':', ''));
    return aNum - bNum;
  });
  return res;
}

/**
 * 解析信息字符串
 */
function parseString(str: string) {
  if (typeof str !== 'string') {
    return '';
  }
  str = str.trim();
  // 空信息
  if (/^[ -]+$/.test(str)) {
    return '';
  }
  // 特殊状态
  if (str.includes('待登入') || str.includes('未开服')) {
    return '';
  }
  // 数据和谐
  if (str.includes('群') || str.includes('qq') || str.includes('QQ')) {
    return '';
  }
  if (/\*[：:]/g.test(str)) {
    str = str.replace(/\*[：:]/g, '').trim();
  }
  return str;
}

/**
 * 从某个页面获取数据
 * @param browser 浏览器
 * @param href 页面路径
 * @param dc 该大区的 tab 按钮
 */
async function fetchPageHTML(browser: Browser, href: string, dc: string) {
  const page = await browser.newPage();
  await page.goto(href);
  await page.click(dc);
  await wait(100);
  const info = await page.content();
  await page.close();
  return info;
}

async function genDataFromPuppeteer() {
  const href = 'https://ffxivhuntcn.com/#/train/index';
  const dcs = [
    '#app > div > div.main-container > section > div:nth-child(1) > div.el-row > div.el-col.el-col-4.el-col-offset-2 > div > div',
    '#app > div > div.main-container > section > div:nth-child(1) > div.el-row > div:nth-child(2) > div > div',
    '#app > div > div.main-container > section > div:nth-child(1) > div.el-row > div:nth-child(3) > div > div',
    '#app > div > div.main-container > section > div:nth-child(1) > div.el-row > div:nth-child(4) > div > div',
  ];
  const patches = [
    '#app > div > div.main-container > section > div:nth-child(1) > div:nth-child(4) > div.el-table__body-wrapper',
    '#app > div > div.main-container > section > div:nth-child(1) > div:nth-child(6) > div.el-table__body-wrapper',
    '#app > div > div.main-container > section > div:nth-child(1) > div:nth-child(8) > div.el-table__body-wrapper',
  ];
  const output = getOutputTemplate();
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  let succeeded = 0;
  // 遍历大区
  for (let i = 0; i < dcs.length; i++) {
    const html = await fetchPageHTML(browser, href, dcs[i]);
    const $ = load(html);
    // 遍历版本
    for (let j = 0; j < patches.length; j++) {
      const servers = $(`${patches[j]} .el-table__row`);
      // 遍历服务器
      for (let k = 0; k < servers.length; k++) {
        // 服务器名
        const name = servers.eq(k).find('td:first-child div').text().trim();
        if (!name) {
          throw new Error('服务器名称获取失败');
        }
        // 车次
        const times = servers.eq(k).find('td:nth-child(2) div span').text();
        // 开始地点
        const start = servers.eq(k).find('td:nth-child(3) div').text().trim();
        // 路线
        const route = servers.eq(k).find('td:nth-child(4) div').text().trim();
        // 备注
        const com = servers.eq(k).find('td:nth-child(5) div').text().trim();
        // 添加到数据
        output[i].patches[j].servers.push({
          name,
          times: parseTimes(times) || [],
          start: parseString(start),
          route: parseString(route),
          comment: parseString(com),
        });
        // 狩猎车数据组 ${name}-${j} 更新完毕
        succeeded++;
      }
    }
  }

  await browser.close();
  // 添加生成时间
  const finalOutput = { stime: Date.now(), dcs: output } as XIVData;
  const patchNums = patches.length;
  if (
    succeeded ===
    8 * patchNums + 8 * patchNums + 7 * patchNums + 8 * patchNums
  ) {
    return finalOutput;
  } else {
    throw new Error('部分数据获取失败');
  }
}

async function ffxiv(file = false): Promise<XIVData> {
  if (file) {
    const data = await genDataFromPuppeteer();
    fs.writeFileSync('ffxiv.json', JSON.stringify(data, null, 2));
    return data;
  } else {
    try {
      return await genDataFromPuppeteer();
    } catch (e) {
      console.error(e);
      return ffxivStaticData;
    }
  }
}

export default ffxiv;
