import React from 'react';
import { Lesson } from '../types';
import { PrintIcon } from './Icons';

interface InvoiceProps {
  studentName: string;
  lessons: (Lesson & { date: string })[];
  studioName: string;
  onMarkAsPaid: () => void;
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ studentName, lessons, studioName, onMarkAsPaid, onClose }) => {
  const invoiceTotal = lessons.reduce((sum, lesson) => sum + lesson.rate, 0);
  const invoiceDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="text-brand-text-primary print:text-black">
        <style>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                .invoice-printable, .invoice-printable * {
                    visibility: visible;
                }
                .invoice-printable {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 2rem;
                }
                .no-print {
                    display: none;
                }
            }
        `}</style>

        <div id="invoice-content" className="invoice-printable bg-white print:bg-white p-6 rounded-lg text-black">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{studioName}</h2>
                    <p className="text-gray-500">Invoice</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-700 font-semibold">Date: {invoiceDate}</p>
                    <p className="text-gray-500">Invoice for: {studentName}</p>
                </div>
            </div>

            <table className="w-full text-left text-sm text-gray-700 mb-6">
                <thead className="border-b border-gray-300">
                    <tr>
                        <th className="py-2 pr-2 font-semibold">Date</th>
                        <th className="py-2 px-2 font-semibold">Lesson Details</th>
                        <th className="py-2 pl-2 font-semibold text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map(lesson => (
                        <tr key={lesson.id} className="border-b border-gray-200">
                            <td className="py-3 pr-2 whitespace-nowrap">{new Date(lesson.date + 'T00:00:00Z').toLocaleDateString()}</td>
                            <td className="py-3 px-2">{lesson.time}, {lesson.duration}</td>
                            <td className="py-3 pl-2 font-mono text-right">${lesson.rate.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-right">
                <p className="text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-800">${invoiceTotal.toFixed(2)}</p>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-400">
                <p>Thank you for your business!</p>
            </div>
        </div>
        
        <div className="no-print flex justify-end space-x-3 pt-6">
            <button onClick={handlePrint} className="inline-flex items-center px-4 py-2 rounded-md bg-brand-primary text-brand-text-primary hover:bg-opacity-80 transition-colors">
                <PrintIcon /> Print
            </button>
            <button onClick={onMarkAsPaid} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors">
                Mark as Paid
            </button>
        </div>
    </div>
  );
};

export default Invoice;