// 导入 DailyClass 类
import { DailyClass } from './DailyClass';

// 定义 Schedule 类
export class Schedule {
  // 设置倒计时目标时间
  countdown_target: Date = new Date();
  // 定义每日课程数组
  daily_class: Array<DailyClass> = [];
  // 定义科目名称映射
  subject_name: Map<string, string> = new Map<string, string>();
  // 定义时间表
  timetable: Map<string, Map<string, string | number>> = new Map<
    string,
    Map<string, string | number>
  >();
  // 定义分隔线
  divider: Map<string, Array<number>> = new Map<string, Array<number>>();
  // 设置是否显示星期
  week_display: boolean = true;
  // 定义样式
  css_style: Map<string, string> = new Map<string, string>();
}
