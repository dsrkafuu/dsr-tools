import { createApp, nextTick, reactive } from 'vue';
import { log } from '../../utils/logger';
import ZMessage from './ZMessage.vue';

export type ZMessageType = 'info' | 'success' | 'error';

export interface ZMessageItem {
  id: number;
  type: ZMessageType;
  text: string;
  show: boolean; // 透明度动画控制
}

// 自动关闭实现
const messages = reactive<ZMessageItem[]>([]);
let mid = 0; // 消息 ID，由 0 自增

/**
 * 添加一个消息，返回新消息的 ID
 */
function append(type: ZMessageType, text: string) {
  const id = mid++;
  log('append message mid', id);
  messages.push({ id, type, text, show: false });
  // 触发入场动画
  nextTick(() => {
    const item = messages.find((item) => item.id === id);
    item && (item.show = true);
  });
  return id;
}

// 关闭等待队列
const closeQueue: (number | undefined)[] = [];

/**
 * 提供消息 ID，关闭一个消息
 */
function close(mid: number) {
  // 若手动关闭，确保移除关闭等待队列
  clearTimeout(closeQueue[mid]);
  closeQueue[mid] = undefined;
  // 触发出场动画
  const item = messages.find((item) => item.id === mid);
  item && (item.show = false);
  // 动画结束后移除该消息
  setTimeout(() => {
    log('remove message mid', mid);
    const idx = messages.findIndex((item) => item.id === mid);
    messages.splice(idx, 1);
  }, 300);
}

/**
 * 导出工具函数
 */
function getHandler(type: ZMessageType) {
  return (text: string) => {
    const id = append(type, text);
    // 加入关闭等待队列
    closeQueue[id] = window.setTimeout(() => {
      close(id);
    }, 3000);
  };
}

// 创建实例并挂载到 DOM
log('init message module');
const container = document.getElementById('message') as HTMLDivElement;
const app = createApp(ZMessage);
app.provide('messages', messages); // 提供信息列表
app.provide('close', close); // 提供关闭函数
app.mount(container);
document.body.appendChild(container);

export default {
  info: getHandler('info'),
  success: getHandler('success'),
  error: getHandler('error'),
};
