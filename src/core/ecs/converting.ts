import { Schedule } from '../models/ecs/Schedule';
import { TimeLayout } from '../models/classisland/TimeLayout';
import { TimeLayoutItem } from '../models/classisland/TimeLayoutItem';
import { Profile } from '../models/classisland/Profile';
import { ClassPlan } from '../models/classisland/ClassPlan';
import { v4 as uuidv4 } from 'uuid';

interface TimeSpan {
  start: Date;
  end: Date;
}

/// Generate GUID
function generateGuid(): string {
  return uuidv4();
}

// 函数matchTimeSpan用于匹配字符串中的时间跨度
function matchTimeSpan(s: string): TimeSpan {
  // 定义正则表达式，匹配字符串中的数字
  const regex = /\d+/gi;
  // 获取字符串中匹配到的数字
  const nums = s.match(regex);
  // 判断匹配到的数字是否为4个，不是则抛出错误
  if (nums == null || nums.length != 4) {
    throw new Error('无效的时间格式：' + s);
  }
  // 定义开始时间和结束时间
  const start = new Date();
  start.setUTCHours(+nums[0]);
  start.setUTCMinutes(+nums[1]);
  start.setUTCSeconds(0);
  start.setUTCMilliseconds(0);
  const end = new Date();
  end.setUTCHours(+nums[2]);
  end.setUTCMinutes(+nums[3]);
  end.setUTCSeconds(0);
  end.setUTCMilliseconds(0);
  // 返回开始时间和结束时间
  return {
    start: start,
    end: end
  };
}

export function convertEcsToClassIsland(profile: Schedule): Profile {
  // 创建一个Profile实例
  const classIsland = new Profile();
  // 创建一个Map，用于存储学科的guid
  const subjectMapping = new Map<string, string>();
  // 创建一个Map，用于存储时间表的guid
  const timeTableMapping = new Map<string, string>();
  // 处理科目
  profile.subject_name.forEach((v, k) => {
    // 生成一个guid
    const guid = generateGuid();
    // 将subject_name和guid存入subjectMapping
    subjectMapping.set(k, guid);
    // 将guid和subject信息存入classIsland.Subjects
    classIsland.Subjects.set(guid, {
      Name: v,
      Initial: k,
      TeacherName: '',
      IsOutDoor: false
    });
  });
  // 处理时间表
  // 为profile的timetable循环
  profile.timetable.forEach((v, k) => {
    // 生成GUID
    const guid = generateGuid();
    // 存储GUID到timeTableMapping
    timeTableMapping.set(k, guid);
    // 创建TimeLayout实例
    const tl = new TimeLayout();
    // 如果v.size小于等于0，返回
    if (v.size <= 0) {
      return;
    }
    // 设置TimeLayout的name
    tl.Name = k;
    // 初始化last为undefined
    let last: TimeLayoutItem | undefined;
    // 获取dividers
    const dividers = profile.divider.get(k);
    // 遍历v
    v.forEach((v, k) => {
      // 创建TimeLayoutItem实例
      const tp = new TimeLayoutItem();
      // 获取时间段
      const ts = matchTimeSpan(k);
      console.debug('匹配时间段：', ts);
      // 设置TimeLayoutItem的startSecond
      tp.StartSecond = ts.start;
      // 设置TimeLayoutItem的endSecond
      tp.EndSecond = ts.end;
      // 如果last不为undefined，设置last的endSecond为tp的startSecond
      if (last != undefined) {
        last.EndSecond = tp.StartSecond;
      }
      // 如果v的类型为string，设置tp的timetype为1
      if (typeof v == 'string') {
        tp.TimeType = 1;
      }
      // 设置last为tp
      last = tp;
      // 将tp添加到tl的layouts数组中
      tl.Layouts.push(tp);
      // 如果v的类型为number，并且dividers包含v，创建TimeLayoutItem实例tpd，设置tpd的startSecond和endSecond，将tpd添加到tl的layouts数组中
      if (typeof v == 'number' && dividers != undefined && dividers.includes(v as number)) {
        const startDivider = new Date(ts.end.getTime() + 120);
        const tpd = new TimeLayoutItem();
        tpd.StartSecond = tpd.EndSecond = startDivider;
        tpd.TimeType = 2;
        tl.Layouts.push(tpd);
      }
    });
    // 获取tl的layouts数组中的第一个元素
    const first = tl.Layouts[0];
    // 获取tl的layouts数组中的最后一个元素
    const end = tl.Layouts[tl.Layouts.length - 1];
    // 如果first的startSecond的时为0，且分为为0，将first从tl的layouts数组中移除
    if (first.StartSecond.getUTCHours() == 0 && first.StartSecond.getUTCMinutes() == 0) {
      tl.Layouts.shift();
    }
    // 如果end的endSecond的时为23，且分为59，将end从tl的layouts数组中移除
    if (
      end != undefined &&
      end.EndSecond.getUTCHours() == 23 &&
      end.EndSecond.getUTCMinutes() == 59
    ) {
      tl.Layouts.pop();
    }
    // 对tl的layouts数组排序，根据startSecond
    tl.Layouts.sort((x, y) => {
      return x.StartSecond.getUTCSeconds() - y.EndSecond.getUTCSeconds();
    });
    // 将tl添加到classIsland的TimeLayouts中
    classIsland.TimeLayouts.set(guid, tl);
  });

  //处理课表
  profile.daily_class.forEach((v, i) => {
    const cp1 = new ClassPlan(); // 单周
    const cp2 = new ClassPlan(); // 双周
    let isCp2Set = false; // 是否使用双周课表？
    const timeTable = v.timetable;
    console.log(timeTable, v);

    const timeLayoutId = timeTableMapping.get(v.timetable);
    if (timeLayoutId == undefined) return;
    cp1.Name = cp2.Name = v.Chinese + v.English;
    cp1.TimeRule.WeekDay = cp2.TimeRule.WeekDay = i;
    cp1.TimeLayoutId = cp2.TimeLayoutId = timeLayoutId;
    v.classList.forEach((v) => {
      if (typeof v == 'string') {
        const subjectId = subjectMapping.get(v);

        cp1.Classes.push({
          SubjectId: subjectId == undefined ? '' : subjectId
        });
        cp2.Classes.push({
          SubjectId: subjectId == undefined ? '' : subjectId
        });
      } else {
        isCp2Set = true;
        const subjectId1 = subjectMapping.get(v[0]);
        const subjectId2 = v.length >= 1 ? subjectMapping.get(v[1]) : undefined;
        cp1.Classes.push({
          SubjectId: subjectId1 == undefined ? '' : subjectId1
        });
        cp2.Classes.push({
          SubjectId: subjectId2 == undefined ? '' : subjectId2
        });
      }
    });
    if (isCp2Set) {
      cp1.TimeRule.WeekCountDiv = 1;
      cp1.Name += ' 单';
      cp2.TimeRule.WeekCountDiv = 2;
      cp2.Name += ' 双';
      classIsland.ClassPlans.set(generateGuid(), cp1);
      classIsland.ClassPlans.set(generateGuid(), cp2);
    } else {
      // 如果双周课表没有被使用，那么就认为这天没有轮换课程。
      classIsland.ClassPlans.set(generateGuid(), cp1);
    }
  });

  return classIsland;
}
