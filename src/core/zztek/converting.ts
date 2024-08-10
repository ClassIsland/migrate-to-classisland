import { TimeLayout } from '../models/classisland/TimeLayout';
import { TimeLayoutItem } from '../models/classisland/TimeLayoutItem';
import { Profile } from '../models/classisland/Profile';
import { ClassPlan } from '../models/classisland/ClassPlan';
import { Timetable } from '../models/zztek/Timetable';
import { v4 as uuidV4 } from 'uuid';

function generateGuid(): string {
  return uuidV4();
}

function parseTime(timeStr: string): Date {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const time = new Date();
  time.setUTCHours(hours);
  time.setUTCMinutes(minutes);
  time.setUTCSeconds(seconds);
  return time;
}

export function convertZongziTEKToClassIsland(timetable: Timetable): Profile {
  const classIsland = new Profile();

  // 创建一个Map，用于存储学科的guid
  const subjectMapping = new Map<string, string>();
  // 创建一个Map，用于存储时间表的guid
  const timeTableMapping = new Map<string, string>();

  // 处理科目
  Object.keys(timetable).forEach((day) => {
    const lessons = timetable[day as keyof Timetable];
    lessons.forEach((lesson) => {
      const guid = generateGuid();
      subjectMapping.set(lesson.Subject, guid);
      classIsland.Subjects.set(guid, {
        Name: lesson.Subject,
        Initial: lesson.Subject.substring(0, 1),
        TeacherName: '',
        IsOutDoor: false
      });
    });
  });

  // 处理时间表
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  daysOfWeek.forEach((day) => {
    const lessons = timetable[day as keyof Timetable];
    if (!lessons || lessons.length === 0) return;

    const guid = generateGuid();
    timeTableMapping.set(day, guid);

    const tl = new TimeLayout();
    tl.Name = day;

    lessons.forEach((lesson, index) => {
      const tp = new TimeLayoutItem();
      // 将时间字符串转换为 Date 对象
      const startTime = parseTime(lesson.StartTime);
      const endTime = parseTime(lesson.EndTime);

      tp.StartSecond = startTime;
      tp.EndSecond = endTime;
      tp.TimeType = 0;
      tl.Layouts.push(tp);

      if (index < lessons.length - 1) {
        const nextLessonStartTime = parseTime(lessons[index + 1].StartTime);
        const restTp = new TimeLayoutItem();
        restTp.StartSecond = endTime;
        restTp.EndSecond = nextLessonStartTime;
        restTp.TimeType = 1; // 课间休息时间
        tl.Layouts.push(restTp);
      }
    });

    classIsland.TimeLayouts.set(guid, tl);
  });

  // 处理课表
  daysOfWeek.forEach((day, index) => {
    const cp = new ClassPlan();
    const lessons = timetable[day as keyof Timetable];

    const timeLayoutId = timeTableMapping.get(day);
    if (timeLayoutId == undefined) return;

    cp.Name = day;
    cp.TimeRule.WeekDay = (index + 1) % 7 === 0 ? 0 : (index + 1) % 7;
    cp.TimeLayoutId = timeLayoutId;

    lessons.forEach((lesson) => {
      const subjectId = subjectMapping.get(lesson.Subject);
      cp.Classes.push({ SubjectId: subjectId ?? '' });
    });

    classIsland.ClassPlans.set(generateGuid(), cp);
  });

  return classIsland;
}
