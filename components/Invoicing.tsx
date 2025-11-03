import React, { useState, useMemo } from 'react';
import { DaySchedule, Lesson } from '../types';
import { InvoiceIcon } from './Icons';
import Modal from './Modal';
import Invoice from './Invoice';

interface InvoicingProps {
  scheduleData: DaySchedule[];
  onMarkLessonsPaid: (lessonIds: string[]) => void;
}

const Invoicing: React.FC<InvoicingProps> = ({ scheduleData, onMarkLessonsPaid }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const students = useMemo(() => {
    const studentSet = new Set<string>();
    scheduleData.forEach(day => {
      day.lessons.forEach(lesson => studentSet.add(lesson.student));
    });
    return Array.from(studentSet).sort();
  }, [scheduleData]);

  const unpaidLessons = useMemo(() => {
    if (!selectedStudent) return [];
    
    const lessons: (Lesson & { date: string })[] = [];
    scheduleData.forEach(day => {
      day.lessons.forEach(lesson => {
        if (lesson.student === selectedStudent && !lesson.paid && lesson.attendance !== 'absent') {
          lessons.push({ ...lesson, date: day.date });
        }
      });
    });
    return lessons.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedStudent, scheduleData]);

  const handleGenerateInvoice = () => {
    if (unpaidLessons.length > 0) {
      setIsInvoiceOpen(true);
    }
  };

  const handleMarkAsPaid = () => {
      const lessonIds = unpaidLessons.map(l => l.id);
      onMarkLessonsPaid(lessonIds);
      setIsInvoiceOpen(false);
  }

  return (
    <>
      <div className="mt-8 p-6 bg-brand-surface rounded-xl border border-brand-primary shadow-2xl">
        <h2 className="text-2xl font-bold text-white flex items-center mb-6">
          <InvoiceIcon />
          Invoicing
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="student-select" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Select a Student
            </label>
            <select
              id="student-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 bg-brand-background border border-brand-primary rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none text-brand-text-primary"
            >
              <option value="">-- Select --</option>
              {students.map(student => (
                <option key={student} value={student}>{student}</option>
              ))}
            </select>
          </div>
          
          {selectedStudent && (
            <div>
              <h3 className="text-lg font-semibold text-brand-text-primary mt-4 mb-2">
                Unpaid Lessons for {selectedStudent}
              </h3>
              {unpaidLessons.length > 0 ? (
                <div className="space-y-2">
                  <ul className="max-h-60 overflow-y-auto p-3 bg-brand-primary/30 rounded-lg">
                      {unpaidLessons.map(lesson => (
                          <li key={lesson.id} className="flex justify-between items-center text-brand-text-secondary">
                              <span>{new Date(lesson.date + 'T00:00:00Z').toLocaleDateString()} - {lesson.time}</span>
                              <span className="font-mono text-brand-text-primary">${lesson.rate.toFixed(2)}</span>
                          </li>
                      ))}
                  </ul>
                  <div className="pt-2 text-right">
                    <button
                      onClick={handleGenerateInvoice}
                      className="px-4 py-2 rounded-md bg-brand-secondary text-white hover:bg-opacity-80 transition-colors"
                    >
                      Generate Invoice
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-brand-text-secondary p-3 bg-brand-primary/30 rounded-lg">No unpaid lessons for {selectedStudent}.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} title={`Invoice for ${selectedStudent}`}>
        <Invoice 
          studentName={selectedStudent}
          lessons={unpaidLessons}
          studioName="Bruce Bowers’ Violin Studio"
          onMarkAsPaid={handleMarkAsPaid}
          onClose={() => setIsInvoiceOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Invoicing;