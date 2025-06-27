import { format } from 'date-fns';

/**
 * 將秒數格式化為 HH:mm:ss 或 mm:ss
 * @param seconds 秒數
 */
export function formatDuration(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  if (seconds >= 3600) {
    return format(date, 'H:mm:ss');
  } else {
    return format(date, 'm:ss');
  }
}
