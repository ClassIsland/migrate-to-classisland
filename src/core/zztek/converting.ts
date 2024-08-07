import { TimeLayout } from '../models/classisland/TimeLayout';
import { TimeLayoutItem } from '../models/classisland/TimeLayoutItem';
import { Profile } from '../models/classisland/Profile';
import { ClassPlan } from '../models/classisland/ClassPlan';
import { Timetable, Lesson } from './zongziTEKModels'; // 假设这是定义了 Timetable 和 Lesson 的文件
import { v4 as uuidV4 } from 'uuid';

interface Lesson {
  Subject: string;
  StartTime: string;
  EndTime: string;
  IsSplitBelow: boolean;
  IsStrongClassOverNotificationEnabled: boolean;
}

interface Timetable {
  Monday: Lesson[];
  Tuesday: Lesson[];
  Wednesday: Lesson[];
  Thursday: Lesson[];
  Friday: Lesson[];
  Saturday: Lesson[];
  Sunday: Lesson[];
  Temp: Lesson[];
}

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

function convertZongziTEKToClassIsland(timetable: Timetable): Profile {
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
      subjectMapping.set(lesson.subject, guid);
      classIsland.Subjects.set(guid, {
        Name: lesson.subject,
        Initial: lesson.subject.substring(0, 1),
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

    lessons.forEach((lesson) => {
      const tp = new TimeLayoutItem();
      // 将时间字符串转换为 Date 对象
      const startTime = parseTime(lesson.startTime);
      const endTime = parseTime(lesson.endTime);

      tp.StartSecond = startTime;
      tp.EndSecond = endTime;
      tp.TimeType = 1; // Assuming all lessons are of the same type for simplicity
      tl.Layouts.push(tp);
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
    cp.TimeRule.WeekDay = index;
    cp.TimeLayoutId = timeLayoutId;

    lessons.forEach((lesson) => {
      const subjectId = subjectMapping.get(lesson.subject);
      cp.Classes.push({ SubjectId: subjectId ?? '' });
    });

    classIsland.ClassPlans.set(generateGuid(), cp);
  });

  return classIsland;
}
