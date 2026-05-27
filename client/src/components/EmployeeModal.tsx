import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore, type Employee } from '../store/useStore';

interface EmployeeModalProps {
  employee?: Employee | null;
  onClose: () => void;
}

export function EmployeeModal({ employee, onClose }: EmployeeModalProps) {
  const { createEmployee, updateEmployee, countries, jobTitles, fetchMetadata } = useStore();
  
  const [formData, setFormData] = useState({
    fullName: employee?.fullName || '',
    email: employee?.email || '',
    salary: employee?.salary || '',
    countryId: employee?.countryId || '',
    jobTitleId: employee?.jobTitleId || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countries.length === 0 || jobTitles.length === 0) {
      fetchMetadata();
    }
  }, [countries.length, jobTitles.length, fetchMetadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary)
      };

      if (employee) {
        await updateEmployee(employee.id, payload);
      } else {
        await createEmployee(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hr-charcoal/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-hr-mist/30">
          <h3 className="text-lg font-semibold text-hr-charcoal">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-hr-charcoal hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hr-light focus:border-hr-sage"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              type="email"
              disabled={!!employee}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hr-light focus:border-hr-sage disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="e.g. john@compflow.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary (USD)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">$</span>
              </div>
              <input
                required
                type="number"
                min="0"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: e.target.value })}
                className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hr-light focus:border-hr-sage"
                placeholder="100000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <select
                required
                value={formData.jobTitleId}
                onChange={e => setFormData({ ...formData, jobTitleId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hr-light focus:border-hr-sage bg-white"
              >
                <option value="">Select...</option>
                {jobTitles.map(jt => (
                  <option key={jt.id} value={jt.id}>{jt.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                required
                value={formData.countryId}
                onChange={e => setFormData({ ...formData, countryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hr-light focus:border-hr-sage bg-white"
              >
                <option value="">Select...</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-hr-olive rounded-lg hover:bg-hr-charcoal disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
