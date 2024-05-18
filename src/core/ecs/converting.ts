import { Schedule } from "../models/ecs/Schedule";
import { TimeLayout } from "../models/classisland/TimeLayout";
import { TimeLayoutItem } from "../models/classisland/TimeLayoutItem";
import { Profile } from "../models/classisland/Profile";
import { ClassPlan } from "../models/classisland/ClassPlan";
import { v4 as uuidv4 } from 'uuid';


interface TimeSpan {
    start: Date;
    end: Date;
}

/// Generate GUID
function generateGuid(): string {
    return uuidv4();
}



function matchTimeSpan(s: string): TimeSpan {
    const regex = /\d+/gi;
    const nums = s.match(regex);
    if (nums == null || nums.length != 4){
        throw new Error("无效的时间格式：" + s);
    }
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
    return {
        start: start,
        end: end
    }
}

export function convertEcsToClassIsland(profile: Schedule): Profile {
    const classIsland = new Profile();
    const subjectMapping = new Map<string, string>();
    const timeTableMapping = new Map<string, string>();
    // 处理科目
    profile.subject_name.forEach((v, k) => {
        const guid = generateGuid();
        subjectMapping.set(k, guid);
        classIsland.Subjects.set(guid, {
            Name: v,
            Initial: k,
            TeacherName: "",
            IsOutDoor: false
        });
    })
    // 处理时间表
    profile.timetable.forEach((v, k) => {
        const guid = generateGuid();
        timeTableMapping.set(k, guid);
        const tl = new TimeLayout();
        if (v.size <= 0) {
            return;
        }
        tl.Name = k;
        let last: TimeLayoutItem | undefined;
        const dividers = profile.divider.get(k);
        v.forEach((v, k) => {
            const tp = new TimeLayoutItem();
            const ts = matchTimeSpan(k);
            console.debug("匹配时间段：", ts);
            tp.StartSecond = ts.start;
            tp.EndSecond = ts.end;
            if (last != undefined) {
                last.EndSecond = tp.StartSecond;
            }
            if (typeof(v) == "string") {
                tp.TimeType = 1;
            }
            last = tp
            tl.Layouts.push(tp);
            if (typeof(v) == "number" && dividers != undefined && dividers.includes(v as number)) {
                const startDivider = new Date(ts.end.getTime() + 120);
                const tpd = new TimeLayoutItem();
                tpd.StartSecond = tpd.EndSecond = startDivider;
                tpd.TimeType = 2;
                tl.Layouts.push(tpd)
            }
        });
        const first = tl.Layouts[0];
        const end = tl.Layouts[tl.Layouts.length - 1];
        if (first.StartSecond.getUTCHours() == 0 && first.StartSecond.getUTCMinutes() == 0) {
            tl.Layouts.shift();
        }
        if (end != undefined && end.EndSecond.getUTCHours() == 23 && end.EndSecond.getUTCMinutes() == 59) {
            tl.Layouts.pop();
        }
        tl.Layouts.sort((x, y) => {
            return x.StartSecond.getUTCSeconds() - y.EndSecond.getUTCSeconds();
        });
        classIsland.TimeLayouts.set(guid, tl);
    })

    //处理课表
    profile.daily_class.forEach((v, i) => {
        const cp1 = new ClassPlan();  // 单周
        const cp2 = new ClassPlan();  // 双周
        let isCp2Set = false;  // 是否使用双周课表？
        const timeTable = v.timetable;
        console.log(timeTable, v);

        const timeLayoutId = timeTableMapping.get(v.timetable);
        if (timeLayoutId == undefined)
            return;
        cp1.Name = cp2.Name = v.Chinese + v.English;
        cp1.TimeRule.WeekDay = cp2.TimeRule.WeekDay = i;
        cp1.TimeLayoutId = cp2.TimeLayoutId = timeLayoutId;
        v.classList.forEach((v) => {
            if (typeof(v) == "string") {
                const subjectId = subjectMapping.get(v);

                cp1.Classes.push({
                    SubjectId: subjectId == undefined ? "" : subjectId
                });
                cp2.Classes.push({
                    SubjectId: subjectId == undefined ? "" : subjectId
                });

            } else {
                isCp2Set = true;
                const subjectId1 = subjectMapping.get(v[0]);
                const subjectId2 = v.length >= 1 ? subjectMapping.get(v[1]) : undefined;
                cp1.Classes.push({
                    SubjectId: subjectId1 == undefined ? "" : subjectId1
                });
                cp2.Classes.push({
                    SubjectId: subjectId2 == undefined ? "" : subjectId2
                });
            }
        });
        if (isCp2Set) {
            cp1.TimeRule.WeekCountDiv = 1;
            cp1.Name += " 单";
            cp2.TimeRule.WeekCountDiv = 2;
            cp2.Name += " 双";
            classIsland.ClassPlans.set(generateGuid(), cp1);
            classIsland.ClassPlans.set(generateGuid(), cp2);
        } else {
            // 如果双周课表没有被使用，那么就认为这天没有轮换课程。
            classIsland.ClassPlans.set(generateGuid(), cp1);
        }
    })

    return classIsland;
}
