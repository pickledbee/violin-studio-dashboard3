import { DaySchedule } from '../types';

export function exportToCsv(scheduleData: DaySchedule[], filename: string = 'lesson_data.csv') {
    const headers = [
        'Student',
        'Date',
        'Time',
        'Duration',
        'Lesson Rate',
        'Paid Status',
        'Attendance'
    ];

    const allLessons = scheduleData.flatMap(day => 
        day.lessons.map(lesson => ({
            ...lesson,
            date: day.date
        }))
    );

    const csvRows = [headers.join(',')];

    for (const lesson of allLessons) {
        const values = [
            `"${lesson.student.replace(/"/g, '""')}"`,
            lesson.date,
            `"${lesson.time.replace(/"/g, '""')}"`,
            `"${lesson.duration.replace(/"/g, '""')}"`,
            lesson.rate.toFixed(2),
            lesson.paid ? 'Paid' : 'Unpaid',
            lesson.attendance.charAt(0).toUpperCase() + lesson.attendance.slice(1)
        ];
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}