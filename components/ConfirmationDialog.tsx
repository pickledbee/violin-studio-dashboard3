import React from 'react';

interface ConfirmationDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div>
            <p className="text-brand-text-secondary mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
                <button 
                    onClick={onCancel} 
                    className="px-4 py-2 rounded-md bg-brand-primary text-brand-text-primary hover:bg-opacity-80 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm} 
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
