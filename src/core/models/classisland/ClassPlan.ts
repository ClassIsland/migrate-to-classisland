export class ClassInfo {
    SubjectId: string = "";
}

export class TimeRule {
    WeekDay: number = 0;
    WeekCountDiv: number = 0;
}

export class ClassPlan{
    TimeLayoutId: string = "";
    Classes: Array<ClassInfo> = [];
    Name: string = "";
    TimeRule: TimeRule = new TimeRule();
    IsOverlay: boolean = false;
    IsEnabled: boolean = true;
    OverlaySetupTime: Date = new Date();
}