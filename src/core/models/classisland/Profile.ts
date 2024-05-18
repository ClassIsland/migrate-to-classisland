import { ClassPlan } from "./ClassPlan";
import { Subject } from "./Subject";
import { TimeLayout } from "./TimeLayout";

export class Profile {
    Name: string = "";
    TimeLayouts: Map<string, TimeLayout> = new Map<string, TimeLayout>();
    ClassPlans: Map<string, ClassPlan> = new Map<string, ClassPlan>();
    Subjects: Map<string, Subject> = new Map<string, Subject>();
    IsOverlayClassPlanEnabled: boolean = false;
    OverlayClassPlanId: string | undefined;
    TempClassPlanId: string | undefined;
    TempClassPlanSetupTime: Date = new Date();
}