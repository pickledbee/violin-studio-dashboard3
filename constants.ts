import { InitialDaySchedule } from './types';

// This is the template week that will be used to generate the schedule for the entire year.
export const TEMPLATE_SCHEDULE_WEEK: InitialDaySchedule[] = [
  // This is the user's core data for the week of Oct 20, 2025
  {
    day: 'Monday',
    date: '2025-10-20',
    location: 'Hobart Studio',
    lessons: [
      { time: '2:00 – 2:30 pm', student: 'Joseph', duration: '30 min', rate: 25, monthly: 100 },
      { time: '3:45 – 4:15 pm', student: 'Iris', duration: '30 min', rate: 25, monthly: 100 },
      { time: '4:45 – 5:15 pm', student: 'Evelyn H', duration: '30 min', rate: 50, monthly: 200 },
      { time: '6:00 – 6:30 pm', student: 'Valerie', duration: '30 min', rate: 25, monthly: 100 },
      { time: '6:30 – 7:00 pm', student: 'Dillon', duration: '30 min', rate: 25, monthly: 100 },
      { time: '7:00 – 7:30 pm', student: 'Declan', duration: '30 min', rate: 25, monthly: 100 },
    ],
  },
  {
    day: 'Tuesday',
    date: '2025-10-21',
    location: 'Hobart Studio',
    lessons: [
      { time: '6:00 – 6:30 pm', student: 'Ana', duration: '30 min', rate: 25, monthly: 100 },
      { time: '7:00 – 7:30 pm', student: 'Ryken', duration: '30 min', rate: 25, monthly: 100 },
    ],
  },
  {
    day: 'Wednesday',
    date: '2025-10-22',
    location: 'Providence Academy',
    lessons: [
      { time: '11:25 – 11:55 am', student: 'Tansley', duration: '30 min', rate: 25, monthly: 100 },
      { time: '11:55 – 12:25 pm', student: 'Leah', duration: '30 min', rate: 25, monthly: 100 },
      { time: '4:30 – 5:00 pm', student: 'Ben', duration: '30 min', rate: 25, monthly: 100 },
      { time: '7:15 – 8:00 pm', student: 'Samuel', duration: '45 min', rate: 36, monthly: 144 },
    ],
  },
  {
    day: 'Thursday',
    date: '2025-10-23',
    location: 'Providence Academy',
    lessons: [
      { time: '11:25 – 11:55 am', student: 'Avia', duration: '30 min', rate: 25, monthly: 100 },
      { time: '5:30 – 6:00 pm', student: 'Xiomara', duration: '30 min', rate: 25, monthly: 100 },
    ],
  },
  {
    day: 'Friday',
    date: '2025-10-24',
    location: 'Providence → Hobart',
    lessons: [
      { time: '12:20 – 12:50 pm', student: 'Ada', duration: '30 min', rate: 25, monthly: 100 },
      { time: '1:00 – 1:45 pm', student: 'Edmund', duration: '45 min', rate: 37.50, monthly: 150 },
      { time: '3:30 – 4:15 pm', student: 'Freya', duration: '45 min', rate: 37.50, monthly: 150 },
    ],
  },
  {
    day: 'Sunday',
    date: '2025-10-26',
    location: 'Hobart Studio',
    lessons: [
      { time: '5:30 – 6:00 pm', student: 'Will', duration: '30 min', rate: 25, monthly: 100 },
      { time: '6:00 – 6:30 pm', student: 'Jonathan', duration: '30 min', rate: 25, monthly: 100 },
      { time: '6:30 – 6:45 pm', student: 'Evelyn (W. & J. sister)', duration: '15 min', rate: 12.50, monthly: 50 },
      { time: '7:00 – 7:30 pm', student: 'Ved', duration: '30 min', rate: 25, monthly: 100 },
    ],
  },
];