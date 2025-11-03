import React, { useState } from 'react';
import { DaySchedule, Lesson } from '../types';
import { LocationIcon, AddIcon, EditIcon, DeleteIcon, CheckCircleIcon, CircleIcon, XCircleIcon } from './Icons';
import Modal from './Modal';
import LessonForm from './LessonForm';
import ConfirmationDialog from './ConfirmationDialog';

interface ScheduleCardProps {
  daySchedule: DaySchedule;
  isToday: boolean;
  onSaveLesson: (dayId: string, lesson: Lesson | Omit<Lesson, 'id' | 'paid' | 'attendance'>) => void;
  onDeleteLesson: (dayId: string, lessonId: string) => void;
  onTogglePayment: (dayId: string, lessonId: string) => void;
  onSetAttendance: (dayId: string, lessonId: string, status: Lesson['attendance']) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ daySchedule, isToday, onSaveLesson, onDeleteLesson, onTogglePayment, onSetAttendance }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonToDeleteId, setLessonToDeleteId] = useState<string | null>(null);

  const dailyEarned = daySchedule.lessons.reduce((sum, lesson) => {
    if (lesson.attendance !== 'absent') {
      return sum + lesson.rate;
    }
    return sum;
  }, 0);

  const handleAddNew = () => {
    setSelectedLesson(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsFormOpen(true);
  };

  const handleDelete = (lessonId: string) => {
    setLessonToDeleteId(lessonId);
    setIsConfirmOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (lessonToDeleteId) {
      onDeleteLesson(daySchedule.id, lessonToDeleteId);
    }
    setIsConfirmOpen(false);
    setLessonToDeleteId(null);
  };

  const handleSave = (lessonData: Lesson | Omit<Lesson, 'id' | 'paid' | 'attendance'>) => {
    onSaveLesson(daySchedule.id, lessonData);
    setIsFormOpen(false);
  };

  const formattedDate = new Date(daySchedule.date + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const cardClasses = `bg-brand-surface rounded-xl border shadow-2xl overflow-hidden flex flex-col transition-transform transform hover:scale-105 duration-300 ${isToday ? 'border-brand-secondary ring-2 ring-brand-secondary' : 'border-brand-primary'}`;


  return (
    <>
      <div className={cardClasses}>
        <div className="p-4 bg-brand-primary flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">{daySchedule.day}</h2>
            <p className="text-md text-brand-text-secondary leading-tight">{formattedDate}</p>
            <p className="text-sm text-brand-text-secondary flex items-center mt-2">
              <LocationIcon />
              {daySchedule.location}
            </p>
          </div>
          <button onClick={handleAddNew} className="p-2 rounded-full bg-brand-secondary text-white hover:bg-opacity-80 transition-colors" aria-label="Add new lesson">
            <AddIcon />
          </button>
        </div>
        <div className="flex-grow p-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-primary">
              <tr>
                <th className="py-2 pr-2 text-brand-text-secondary font-semibold">Student</th>
                <th className="py-2 px-2 text-brand-text-secondary font-semibold">Time</th>
                <th className="py-2 px-2 text-brand-text-secondary font-semibold text-center">Attendance</th>
                <th className="py-2 px-2 text-brand-text-secondary font-semibold text-center">Paid</th>
                <th className="py-2 pl-2 text-brand-text-secondary font-semibold text-right">Rate</th>
                <th className="py-2 pl-2 text-brand-text-secondary font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {daySchedule.lessons.map((lesson) => (
                <tr key={lesson.id} className={`border-b border-brand-primary/50 ${lesson.paid ? 'opacity-60' : ''} ${lesson.attendance === 'absent' ? 'text-gray-500' : ''}`}>
                  <td className={`py-3 pr-2 font-medium text-brand-text-primary whitespace-nowrap ${lesson.attendance === 'absent' ? 'line-through' : ''}`}>{lesson.student}</td>
                  <td className="py-3 px-2 text-brand-text-secondary whitespace-nowrap">{lesson.time}</td>
                   <td className="py-3 px-2 text-center">
                    <div className="flex justify-center items-center space-x-1">
                      <button onClick={() => onSetAttendance(daySchedule.id, lesson.id, 'present')} aria-label="Mark as present">
                        <CheckCircleIcon className={`h-6 w-6 ${lesson.attendance === 'present' ? 'text-green-400' : 'text-brand-text-secondary/50 hover:text-green-400'}`} />
                      </button>
                      <button onClick={() => onSetAttendance(daySchedule.id, lesson.id, 'absent')} aria-label="Mark as absent">
                        <XCircleIcon className={`h-6 w-6 ${lesson.attendance === 'absent' ? 'text-red-500' : 'text-brand-text-secondary/50 hover:text-red-500'}`} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button onClick={() => onTogglePayment(daySchedule.id, lesson.id)} aria-label={lesson.paid ? 'Mark as unpaid' : 'Mark as paid'}>
                      {lesson.paid ? <CheckCircleIcon className="h-6 w-6 text-green-400" /> : <CircleIcon className="h-6 w-6 text-brand-text-secondary" />}
                    </button>
                  </td>
                  <td className={`py-3 pl-2 font-mono text-right whitespace-nowrap ${lesson.paid ? 'text-green-400' : 'text-brand-text-primary'}`}>${lesson.rate.toFixed(2)}</td>
                  <td className="py-3 pl-2 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEdit(lesson)} className="text-brand-text-secondary hover:text-white" aria-label="Edit lesson"><EditIcon /></button>
                        <button onClick={() => handleDelete(lesson.id)} className="text-brand-secondary hover:text-red-500" aria-label="Delete lesson"><DeleteIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-auto p-4 bg-brand-primary/50 text-right">
          <span className="text-brand-text-secondary">Day's Earned:</span>
          <span className="ml-2 text-xl font-bold text-white">${dailyEarned.toFixed(2)}</span>
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedLesson ? 'Edit Lesson' : 'Add Lesson'}>
        <LessonForm lesson={selectedLesson} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Confirm Deletion">
        <ConfirmationDialog 
            onConfirm={handleConfirmDelete} 
            onCancel={() => setIsConfirmOpen(false)} 
            message="Are you sure you want to delete this lesson? This action cannot be undone."
        />
      </Modal>
    </>
  );
};

export default ScheduleCard;