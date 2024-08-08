import { Lesson } from './Lesson';

export interface Timetable {
  Monday: Lesson[];
  Tuesday: Lesson[];
  Wednesday: Lesson[];
  Thursday: Lesson[];
  Friday: Lesson[];
  Saturday: Lesson[];
  Sunday: Lesson[];
  Temp: Lesson[];
}
