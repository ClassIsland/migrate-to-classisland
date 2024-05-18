import { Schedule } from "../models/ecs/Schedule";

export function loadEcsSchedule(configJs: string): Schedule {
    const r = Function(configJs + "\nreturn scheduleConfig")() as Schedule;
    console.log(r);
    r.subject_name = new Map<string, string>(Object.entries(r.subject_name));
    r.divider = new Map<string, Array<number>>(Object.entries(r.divider));
    r.timetable = new Map<string, Map<string, string | number>>(Object.entries(r.timetable));
    r.timetable.forEach((v, k) => {
        r.timetable.set(k, new Map<string, string | number>(Object.entries(v)));
    })
    return r;
}
