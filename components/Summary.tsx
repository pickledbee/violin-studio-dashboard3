import React from 'react';
import { DaySchedule } from '../types';
import { ChartIcon, DownloadIcon } from './Icons';
import { exportToCsv } from '../utils/csvExporter';

interface SummaryProps {
  scheduleData: DaySchedule[];
  todayString: string;
  displayDate: Date;
}

const Summary: React.FC<SummaryProps> = ({ scheduleData, todayString, displayDate }) => {
  const visibleMonth = displayDate.getUTCMonth();
  const visibleYear = displayDate.getUTCFullYear();

  const monthlySchedule = scheduleData.filter(day => {
    // Parse the date string 'YYYY-MM-DD' to avoid timezone issues.
    const [year, month] = day.date.split('-').map(Number);
    // month is 1-based, convert to 0-based for comparison.
    return year === visibleYear && (month - 1) === visibleMonth;
  });

  // Monthly Calculations (for the currently selected month)

  // Calculate "Earned" by summing the `monthly` fee for each unique student in the month.
  const monthlyStudents = new Map<string, number>();
  monthlySchedule.forEach(day => {
    day.lessons.forEach(lesson => {
      // Only count students who are expected to have lessons toward the monthly total
      if (lesson.attendance !== 'absent') { 
        // Use a Map to ensure we only add each student's monthly fee once
        if (!monthlyStudents.has(lesson.student)) {
          monthlyStudents.set(lesson.student, lesson.monthly);
        }
      }
    });
  });
  const earnedIncomeMonthly = Array.from(monthlyStudents.values()).reduce((sum, monthlyRate) => sum + monthlyRate, 0);

  // Calculate "Collected" by summing the `rate` of individual lessons marked as paid.
  const collectedIncomeMonthly = monthlySchedule.reduce((total, day) => {
    return total + day.lessons
      .filter(l => l.paid && l.attendance !== 'absent')
      .reduce((dayTotal, lesson) => dayTotal + lesson.rate, 0);
  }, 0);

  const outstandingBalance = earnedIncomeMonthly - collectedIncomeMonthly;

  // Today's Calculations (always for today, regardless of selected month)
  const todaySchedule = scheduleData.find(day => day.date === todayString);
  
  const earnedIncomeToday = todaySchedule 
    ? todaySchedule.lessons
        .filter(l => l.attendance !== 'absent')
        .reduce((sum, lesson) => sum + lesson.rate, 0)
    : 0;

  const collectedIncomeToday = todaySchedule
    ? todaySchedule.lessons
        .filter(l => l.paid && l.attendance !== 'absent')
        .reduce((sum, lesson) => sum + lesson.rate, 0)
    : 0;

  const handleDownload = () => {
    exportToCsv(scheduleData, `violin_studio_summary_${new Date().toISOString().slice(0, 10)}.csv`);
  };
  
  const monthName = displayDate.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const year = visibleYear;

  return (
    <div className="mt-8 p-6 bg-brand-surface rounded-xl border border-brand-primary shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* Today's Summary */}
        <div>
          <h2 className="text-xl font-bold text-white flex items-center mb-4">
            Today's Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-brand-primary/30 rounded-lg">
              <span className="text-lg font-medium text-brand-text-secondary">Earned Today</span>
              <span className="text-2xl font-bold text-white font-mono">${earnedIncomeToday.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-brand-primary/30 rounded-lg">
              <span className="text-lg font-medium text-brand-text-secondary">Collected Today</span>
              <span className="text-2xl font-bold text-green-400 font-mono">${collectedIncomeToday.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center mb-4">
            <ChartIcon />
            {`${monthName} ${year} Summary`}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-brand-primary/30 rounded-lg">
              <span className="text-lg font-medium text-brand-text-secondary">Earned This Month</span>
              <span className="text-2xl font-bold text-white font-mono">${earnedIncomeMonthly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-brand-primary/30 rounded-lg">
              <span className="text-lg font-medium text-brand-text-secondary">Collected</span>
              <span className="text-2xl font-bold text-green-400 font-mono">${collectedIncomeMonthly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-brand-primary/30 rounded-lg">
              <span className="text-lg font-medium text-brand-text-secondary">Outstanding</span>
              <span className="text-2xl font-bold text-yellow-400 font-mono">${outstandingBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-brand-primary/50 text-center">
        <button 
          onClick={handleDownload}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-background focus:ring-brand-secondary"
        >
          <DownloadIcon />
          Download All Lessons (CSV)
        </button>
      </div>
    </div>
  );
};

export default Summary;