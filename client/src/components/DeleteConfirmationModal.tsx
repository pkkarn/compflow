import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore, type Employee } from '../store/useStore';

interface DeleteConfirmationModalProps {
  employee: Employee;
  onClose: () => void;
}

export function DeleteConfirmationModal({ employee, onClose }: DeleteConfirmationModalProps) {
  const { deleteEmployee } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await deleteEmployee(employee.id);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete employee');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hr-charcoal/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Employee?</h3>
          <p className="text-sm text-center text-gray-500 mb-6">
            Are you sure you want to permanently remove <span className="font-semibold text-gray-700">{employee.fullName}</span> from the directory? This action cannot be undone.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
