import React from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from './Icons';

interface DateNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onWeekChange: (direction: 'prev' | 'next') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ currentDate, onDateChange, onWeekChange, searchQuery, onSearchChange }) => {

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value; // e.g., "2025-10-24"
    const [year, month, day] = dateString.split('-').map(Number);
    // Create a local date object, as the user selected it in their local context.
    const newDate = new Date(year, month - 1, day);
    onDateChange(newDate);
  };
  
  const handleGoToToday = () => {
    onDateChange(new Date());
  };

  const getWeekDisplayRange = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startDate = new Date(d.setDate(diff));

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };
  
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="p-4 bg-brand-surface rounded-xl border border-brand-primary shadow-2xl">
      <h2 className="text-xl font-bold text-white flex items-center mb-4">
        <CalendarIcon />
        Schedule Navigator
      </h2>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onWeekChange('prev')} className="flex items-center px-3 py-2 rounded-md bg-brand-primary text-brand-text-primary hover:bg-opacity-80 transition-colors">
            <ChevronLeftIcon className="mr-1" /> Prev Week
          </button>
          <button onClick={handleGoToToday} className="px-4 py-2 rounded-md bg-brand-primary text-brand-text-primary hover:bg-opacity-80 transition-colors">
            Today
          </button>
          <button onClick={() => onWeekChange('next')} className="flex items-center px-3 py-2 rounded-md bg-brand-primary text-brand-text-primary hover:bg-opacity-80 transition-colors">
            Next Week <ChevronRightIcon className="ml-1" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full flex-grow">
            <label htmlFor="search-input" className="sr-only">Search Students</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-brand-text-secondary" />
            </div>
            <input
              type="text"
              id="search-input"
              placeholder="Search students in week..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full p-2 pl-10 bg-brand-background border border-brand-primary rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none text-brand-text-primary"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
              <label htmlFor="date-picker" className="text-brand-text-secondary font-medium whitespace-nowrap">Go to:</label>
              <input
                  type="date"
                  id="date-picker"
                  value={formatDateForInput(currentDate)}
                  onChange={handleDateInputChange}
                  className="p-2 bg-brand-background border border-brand-primary rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none text-brand-text-primary"
              />
          </div>
        </div>
      </div>
       <p className="text-center text-brand-text-secondary mt-4 font-semibold">
        Displaying week of: {getWeekDisplayRange(currentDate)}
      </p>
    </div>
  );
};

export default DateNavigator;