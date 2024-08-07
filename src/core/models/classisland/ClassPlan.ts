// 导出ClassInfo类
export class ClassInfo {
  // 课程ID
  SubjectId: string = '';
}

// 导出TimeRule类
export class TimeRule {
  // 课程周期
  WeekDay: number = 0;
  // 课程周期
  WeekCountDiv: number = 0;
}

// 导出ClassPlan类
export class ClassPlan {
  // 时间布局ID
  TimeLayoutId: string = '';
  // 课程信息
  Classes: Array<ClassInfo> = [];
  // 班级名称
  Name: string = '';
  // 课程周期
  TimeRule: TimeRule = new TimeRule();
  // 是否允许覆盖
  IsOverlay: boolean = false;
  // 是否启用
  IsEnabled: boolean = true;
  // 设置时间
  OverlaySetupTime: Date = new Date();
}
