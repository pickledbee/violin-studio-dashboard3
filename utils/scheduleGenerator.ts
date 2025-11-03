import { InitialDaySchedule } from '../types';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function generateYearSchedule(year: number, templateWeek: InitialDaySchedule[]): InitialDaySchedule[] {
    const yearSchedule: InitialDaySchedule[] = [];
    
    // Create a map for easy lookup: 0 (Sun) -> template, 1 (Mon) -> template, etc.
    const templateMap = new Map<number, Omit<InitialDaySchedule, 'day' | 'date'>>();
    for (const templateDay of templateWeek) {
        // The date string is 'YYYY-MM-DD', which is treated as UTC.
        // We need to parse it carefully to get the parts.
        const [y, m, d] = templateDay.date.split('-').map(Number);
        // Create a UTC date to get the day of the week reliably.
        const templateDate = new Date(Date.UTC(y, m - 1, d));
        const dayOfWeek = templateDate.getUTCDay(); // 0 for Sunday, 1 for Monday, etc.
        
        const { day, date, ...restOfTemplate } = templateDay;
        templateMap.set(dayOfWeek, restOfTemplate);
    }

    // Iterate through all days of the year in UTC
    const currentDate = new Date(Date.UTC(year, 0, 1));
    while (currentDate.getUTCFullYear() === year) {
        const dayOfWeek = currentDate.getUTCDay();
        const template = templateMap.get(dayOfWeek);

        if (template) {
            const yearStr = currentDate.getUTCFullYear();
            const monthStr = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
            const dayStr = String(currentDate.getUTCDate()).padStart(2, '0');

            const newDaySchedule: InitialDaySchedule = {
                ...template,
                day: daysOfWeek[dayOfWeek],
                date: `${yearStr}-${monthStr}-${dayStr}`,
                // Deep copy lessons to avoid reference issues
                lessons: template.lessons.map(lesson => ({...lesson}))
            };
            yearSchedule.push(newDaySchedule);
        }

        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    
    return yearSchedule;
}