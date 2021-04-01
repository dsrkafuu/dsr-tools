export const changelog = [
  {
    version: 'v4.0.3',
    date: '2021-04-01',
    logs: ['移除 loadable component', '添加路由 error boundary'],
  },
  {
    version: 'v4.0.2',
    date: '2021-03-31',
    logs: [
      '更新 FFXIV 模块 API',
      '移除未使用的组件',
      '优化 JSDoc 注释',
      '添加 API 请求 fallback',
      '修复 header 溢出问题',
    ],
  },
  {
    version: 'v4.0.1',
    date: '2021-03-30',
    logs: [
      '修复 iOS Safari 高度塌陷问题',
      '修复边栏菜单错误收起的问题',
      '优化 SVG 组件导入方式',
      '修复 iOS Safari flex gap 相关问题',
      '移除多余的 sidebar tooltip',
      '持久化保存 FFXIV 模块选择 tab',
    ],
  },
  {
    version: 'v4.0.0',
    date: '2021-03-29',
    logs: ['React 全站重构', '全站样式更新'],
  },
  {
    version: 'v3.5.1',
    date: '2021-02-24',
    logs: ['修复导航栏层级', '修复录播地址工具图片样式'],
  },
  {
    version: 'v3.5.0-hotfix',
    date: '2021-02-18',
    logs: ['修复通知 DOM 错误挂载问题'],
  },
  {
    version: 'v3.5.0',
    date: '2021-02-18',
    logs: ['添加星露谷物语整合包模块', '添加哔哩哔哩录播地址获取工具', '整合 Sentry SDK'],
  },
  {
    version: 'v3.4.0',
    date: '2021-02-17',
    logs: [
      '星露谷物语整合包模块预发布',
      '主页背景轮换',
      '主页设计调整',
      '全局提示信息优化',
      '全局样式修复',
    ],
  },
  {
    version: 'v3.3.2',
    date: '2021-02-08',
    logs: ['常规依赖更新', '切换至使用 SVG 图标', '修复番剧模块 API 代理'],
  },
  {
    version: 'v3.3.1',
    date: '2021-01-31',
    logs: ['修复 BGM 代理 API', '微调 Minecraft 模块样式', '更新路由路径'],
  },
  {
    version: 'v3.3.0',
    date: '2020-12-16',
    logs: ['修复 CDN 资源缓存更新错误', '站点 meta 更新'],
  },
  {
    version: 'v3.2.4',
    date: '2020-11-06',
    logs: ['修复 CDN 路径问题'],
  },
  {
    version: 'v3.2.2',
    date: '2020-10-09',
    logs: ['修复本季番组页面无图片错误'],
  },
  {
    version: 'v3.2.1',
    date: '2020-09-23',
    logs: ['移除部分路由页面', '修复 Minecraft 模块部分样式'],
  },
  {
    version: 'v3.2.0',
    date: '2020-09-12',
    logs: [
      '添加 Minecraft 模块',
      '优化 Changelog 数据结构',
      '修复按钮未捕获 Exception',
      'CDN 数据结构更新',
      '修复 Lazyload 占位问题',
    ],
  },
  {
    version: 'v3.1.1',
    date: '2020-08-09',
    logs: ['优化本季番组模块数据显示', '优化本季番组模块移动端布局'],
  },
  {
    version: 'v3.1.0',
    date: '2020-08-09',
    logs: ['添加本季番组模块', '添加番组模块图片 CDN', '添加番组模块日历资源缓存'],
  },
  {
    version: 'v3.0.3',
    date: '2020-07-27',
    logs: [
      '修改路由滚动行为',
      '移除对 jsDelivr API 的使用',
      '修复 TempAlert 组件 sessionStorage 使用问题',
    ],
  },
  {
    version: 'v3.0.2',
    date: '2020-07-19',
    logs: ['默认强制拉取最新版本数据规避缓存影响'],
  },
  {
    version: 'v3.0.1-hotfix',
    date: '2020-07-14',
    logs: ['修复缓存时间记录错误的问题'],
  },
  {
    version: 'v3.0.1',
    date: '2020-07-14',
    logs: [
      '修复访问旧版链接',
      '添加 FFXIV 狩猎车时间表缓存',
      '修复 Google Analytics',
      '添加 GitHub Actions 测试',
      '修复 SEO Tags',
      '修复关于页面列表样式',
    ],
  },
  {
    version: 'v3.0.0',
    date: '2020-07-12',
    logs: [
      'Vue 全站重构',
      '全站样式更新',
      '添加更新记录',
      'FFXIV 国服狩猎车时间表模块更新',
      'Minecraft DSRCA 整合包发布模块更新',
      '关于页面更新',
      'Crisp 客服支持',
    ],
  },
  {
    version: 'v2.3.1',
    date: '2020-05-14',
    logs: ['狩猎车页面添加导航锚链接', '狩猎车页面添加返回顶部', '修复部分样式错误'],
  },
  {
    version: 'v2.3.0',
    date: '2020-03-28',
    logs: [
      '考虑稳定性原因对服务器进行迁移',
      '全站样式更新',
      '狩猎车添加 4.0 车数据',
      '移除关于页面',
    ],
  },
  {
    version: 'v2.2.0',
    date: '2020-03-02',
    logs: ['二级页面迁移', '首页背景图片更新'],
  },
  {
    version: 'v2.1.1',
    date: '2020-02-14',
    logs: ['修改狩猎车时间表问题提交链接'],
  },
  {
    version: 'v2.1.0',
    date: '2020-02-10',
    logs: ['添加 FFXIV 国服狩猎车时间表模块'],
  },
  {
    version: 'v2.0.0',
    date: '2020-01-14',
    logs: ['Bootstrap v4 重构站点'],
  },
  {
    version: 'v1.3.0',
    date: '2019-12-30',
    logs: ['添加关于页面'],
  },
  {
    version: 'v1.2.0',
    date: '2019-12-25',
    logs: ['添加截图存档模块', '主页背景图片更新'],
  },
  {
    version: 'v1.1.1',
    date: '2019-10-12',
    logs: ['添加静态资源 CDN 加速', '修复部分页面问题'],
  },
  {
    version: 'v1.1.0',
    date: '2019-08-30',
    logs: ['添加 Minecraft DSRCA 整合包发布模块'],
  },
  {
    version: 'v1.0.0',
    date: '2019-08-21',
    logs: ['站点首页上线'],
  },
];

export const version = changelog[0].version;
