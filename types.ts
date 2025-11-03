export interface Lesson {
  id: string;
  time: string;
  student: string;
  duration: string;
  rate: number;
  monthly: number;
  paid: boolean;
  attendance: 'present' | 'absent' | 'pending';
}

export interface DaySchedule {
  id: string;
  day: string;
  date: string;
  location: string;
  lessons: Lesson[];
}

// Types for initial data structure before being processed
export type InitialLesson = Omit<Lesson, 'id' | 'paid' | 'attendance'>;

export type InitialDaySchedule = Omit<DaySchedule, 'id' | 'lessons'> & {
  lessons: InitialLesson[];
};