import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 检查是否为夏令时
 */
export function isDST(dayjsInst: Dayjs) {
  const date = dayjsInst.toDate();
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const stdTimezoneOffset = Math.max(
    jan.getTimezoneOffset(),
    jul.getTimezoneOffset()
  );
  return date.getTimezoneOffset() < stdTimezoneOffset;
}

export type { Dayjs };
export default dayjs;

export const tzdb = ['America/New_York', 'Asia/Shanghai', 'Asia/Tokyo'];
