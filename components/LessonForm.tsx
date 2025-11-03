import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';

interface LessonFormProps {
  lesson: Lesson | null;
  onSave: (lessonData: Lesson | Omit<Lesson, 'id' | 'paid'>) => void;
  onCancel: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ lesson, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    student: '',
    time: '',
    duration: '',
    rate: 0,
    monthly: 0,
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        student: lesson.student,
        time: lesson.time,
        duration: lesson.duration,
        rate: lesson.rate,
        monthly: lesson.monthly,
      });
    } else {
      // Reset form for new lesson
      setFormData({ student: '', time: '', duration: '', rate: 0, monthly: 0 });
    }
  }, [lesson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rate' || name === 'monthly' ? parseFloat(value) || 0 : value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lesson) {
      onSave({ ...lesson, ...formData });
    } else {
      onSave(formData);
    }
  };

  const inputStyles = "w-full p-2 bg-brand-background border border-brand-primary rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none text-brand-text-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="student" className="block text-sm font-medium text-brand-text-secondary mb-1">Student Name</label>
        <input type="text" name="student" id="student" value={formData.student} onChange={handleChange} required className={inputStyles} />
      </div>
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-brand-text-secondary mb-1">Time</label>
        <input type="text" name="time" id="time" value={formData.time} onChange={handleChange} required className={inputStyles} />
      </div>
       <div>
        <label htmlFor="duration" className="block text-sm font-medium text-brand-text-secondary mb-1">Duration</label>
        <input type="text" name="duration" id="duration" value={formData.duration} onChange={handleChange} required className={inputStyles} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-brand-text-secondary mb-1">Rate ($)</label>
          <input type="number" name="rate" id="rate" step="0.01" value={formData.rate} onChange={handleChange} required className={inputStyles} />
        </div>
        <div>
          <label htmlFor="monthly" className="block text-sm font-medium text-brand-text-secondary mb-1">Monthly ($)</label>
          <input type="number" name="monthly" id="monthly" step="0.01" value={formData.monthly} onChange={handleChange} required className={inputStyles} />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-brand-primary text-brand-text-primary hover:bg-opacity-80 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md bg-brand-secondary text-white hover:bg-opacity-80 transition-colors">Save</button>
      </div>
    </form>
  );
};

export default LessonForm;
