import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ScheduleCard from './components/ScheduleCard';
import Summary from './components/Summary';
import Invoicing from './components/Invoicing';
import DateNavigator from './components/DateNavigator';
import { TEMPLATE_SCHEDULE_WEEK } from './constants';
import { generateYearSchedule } from './utils/scheduleGenerator';
import { DaySchedule, Lesson, InitialDaySchedule } from './types';

// Helper to initialize data with IDs and default paid status
const initializeData = (data: InitialDaySchedule[]): DaySchedule[] => {
  return data.map(day => ({
    ...day,
    id: crypto.randomUUID(),
    lessons: day.lessons.map((lesson) => ({
      ...lesson,
      id: crypto.randomUUID(),
      paid: false,
      attendance: 'pending',
    })),
  }));
};

const getWeekRange = (date: Date) => {
  // We use UTC methods to avoid timezone shift issues.
  // We get the year, month, day from the local `date` object and create a new UTC date.
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const d = new Date(Date.UTC(year, month, day));

  const dayOfWeek = d.getUTCDay(); // Sunday = 0, Monday = 1
  const diff = d.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start of week
  
  const startDate = new Date(d.setUTCDate(diff));
  
  const endDate = new Date(new Date(startDate).setUTCDate(startDate.getUTCDate() + 6));
  
  return { startDate, endDate };
};


const App: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(() => {
    try {
      const savedData = localStorage.getItem('violinStudioSchedule');
      if (savedData) {
        return JSON.parse(savedData);
      }
      // If no saved data, generate for 2025
      const generatedSchedule = generateYearSchedule(2025, TEMPLATE_SCHEDULE_WEEK);
      return initializeData(generatedSchedule);
    } catch (error) {
      console.error("Error loading/generating schedule data", error);
      // Fallback to generating from template
      const generatedSchedule = generateYearSchedule(2025, TEMPLATE_SCHEDULE_WEEK);
      return initializeData(generatedSchedule);
    }
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('violinStudioSchedule', JSON.stringify(scheduleData));
    } catch (error) {
      console.error("Error saving data to localStorage", error);
    }
  }, [scheduleData]);

  const handleSaveLesson = (dayId: string, lessonToSave: Lesson | Omit<Lesson, 'id' | 'paid' | 'attendance'>) => {
    setScheduleData(prevData => {
      return prevData.map(day => {
        if (day.id === dayId) {
          const lessonExists = 'id' in lessonToSave && day.lessons.some(l => l.id === lessonToSave.id);
          if (lessonExists) {
            // Update existing lesson
            const updatedLessons = day.lessons.map(l => l.id === (lessonToSave as Lesson).id ? (lessonToSave as Lesson) : l);
            return { ...day, lessons: updatedLessons };
          } else {
            // Add new lesson
            const newLesson: Lesson = { ...lessonToSave, id: crypto.randomUUID(), paid: false, attendance: 'pending' };
            return { ...day, lessons: [...day.lessons, newLesson] };
          }
        }
        return day;
      });
    });
  };

  const handleDeleteLesson = (dayId: string, lessonId: string) => {
    setScheduleData(prevData => {
      return prevData.map(day => {
        if (day.id === dayId) {
          return { ...day, lessons: day.lessons.filter(l => l.id !== lessonId) };
        }
        return day;
      });
    });
  };

  const handleTogglePayment = (dayId: string, lessonId: string) => {
    setScheduleData(prevData => {
      return prevData.map(day => {
        if (day.id === dayId) {
          const updatedLessons = day.lessons.map(l => l.id === lessonId ? { ...l, paid: !l.paid } : l);
          return { ...day, lessons: updatedLessons };
        }
        return day;
      });
    });
  };
  
  const handleSetAttendance = (dayId: string, lessonId: string, status: Lesson['attendance']) => {
    setScheduleData(prevData => {
      return prevData.map(day => {
        if (day.id === dayId) {
          const updatedLessons = day.lessons.map(l => 
            l.id === lessonId ? { ...l, attendance: status } : l
          );
          return { ...day, lessons: updatedLessons };
        }
        return day;
      });
    });
  };

  const handleMarkLessonsPaid = (lessonIds: string[]) => {
    setScheduleData(prevData => {
      const lessonIdSet = new Set(lessonIds);
      return prevData.map(day => {
        if (!day.lessons.some(l => lessonIdSet.has(l.id))) {
          return day;
        }
        return {
          ...day,
          lessons: day.lessons.map(lesson =>
            lessonIdSet.has(lesson.id) ? { ...lesson, paid: true } : lesson
          )
        };
      });
    });
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const amount = direction === 'prev' ? -7 : 7;
    newDate.setDate(newDate.getDate() + amount);
    setCurrentDate(newDate);
  };

  const { startDate, endDate } = getWeekRange(currentDate);

  const weeklySchedule = scheduleData
    .filter(day => {
      // day.date is 'YYYY-MM-DD'. To compare correctly, create a UTC date object from it.
      const [y, m, d] = day.date.split('-').map(Number);
      const dayDate = new Date(Date.UTC(y, m - 1, d));
      return dayDate >= startDate && dayDate <= endDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredSchedule = weeklySchedule
    .map(day => {
      if (!searchQuery.trim()) {
        return day;
      }
      const filteredLessons = day.lessons.filter(lesson =>
        lesson.student.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
      return { ...day, lessons: filteredLessons };
    })
    .filter(day => day.lessons.length > 0);


  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


  return (
    <div className="min-h-screen bg-brand-background font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          <DateNavigator 
            currentDate={currentDate}
            onDateChange={handleDateChange}
            onWeekChange={handleWeekChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {filteredSchedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
              {filteredSchedule.map((daySchedule) => (
                <ScheduleCard
                  key={daySchedule.id}
                  daySchedule={daySchedule}
                  isToday={daySchedule.date === todayString}
                  onSaveLesson={handleSaveLesson}
                  onDeleteLesson={handleDeleteLesson}
                  onTogglePayment={handleTogglePayment}
                  onSetAttendance={handleSetAttendance}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-16 px-6 bg-brand-surface rounded-xl border border-brand-primary">
              <h3 className="text-xl font-semibold text-brand-text-primary">
                {searchQuery ? 'No Matching Lessons Found' : 'No Lessons Scheduled'}
              </h3>
              <p className="text-brand-text-secondary mt-2">
                 {searchQuery 
                  ? `There are no lessons for "${searchQuery}" in the selected week. Try clearing the search or changing the week.` 
                  : 'There are no lessons scheduled for the selected week. Use the navigator to select a different date.'}
              </p>
            </div>
          )}
          <Summary scheduleData={scheduleData} todayString={todayString} displayDate={startDate} />
          <Invoicing scheduleData={scheduleData} onMarkLessonsPaid={handleMarkLessonsPaid} />
        </main>
      </div>
    </div>
  );
};

export default App;
