import { DailyClass } from "./DailyClass";

export class Schedule {
    countdown_target: Date = new Date();
    daily_class: Array<DailyClass> = [];
    subject_name: Map<string, string> = new Map<string, string>();
    timetable: Map<string, Map<string, string | number>> = new Map<string, Map<string, string | number>>();
    divider: Map<string, Array<number>> = new Map<string, Array<number>>();
    week_display: boolean = true;
    css_style: Map<string, string> = new Map<string, string>();
}