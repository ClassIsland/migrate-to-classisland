import { Timetable } from '../models/zztek/Timetable';

export function loadZongziTEKSchedule(jsonString: string): Timetable {
  // 使用 JSON.parse 将 JSON 字符串转换为对象
  return JSON.parse(jsonString);
}
