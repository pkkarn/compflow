import { useEffect, useState } from 'react';
import { useStore, type Employee } from '../store/useStore';
import { Search, ChevronLeft, ChevronRight, Plus, Trash2, LayoutList, Network } from 'lucide-react';
import { EmployeeModal } from '../components/EmployeeModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { EmployeeGraph } from '../components/EmployeeGraph';

export function EmployeesPage() {
  const { employees, totalEmployees, currentPage, totalPages, isLoading, searchQuery, setSearchQuery, fetchEmployees } = useStore();
  
  // Local state for debounced input
  const [inputValue, setInputValue] = useState(searchQuery);

  // View state
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Fetch initial data or when page changes
  useEffect(() => {
    fetchEmployees(currentPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
        fetchEmployees(1, inputValue); // Reset to page 1 on new search
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery, fetchEmployees]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-hr-light focus:border-hr-sage sm:text-sm transition-colors"
            placeholder="Search employees by name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="flex space-x-3">
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-hr-charcoal' : 'text-gray-500 hover:text-gray-700'}`}
              title="Table View"
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('graph')}
              className={`p-2 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'graph' ? 'bg-white shadow-sm text-hr-charcoal' : 'text-gray-500 hover:text-gray-700'}`}
              title="Canvas View"
            >
              <Network className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }}
            className="flex items-center justify-center space-x-2 bg-hr-olive text-white px-5 py-2.5 rounded-xl hover:bg-hr-charcoal transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Employee</span>
          </button>
        </div>
      </div>

      {/* Table vs Graph Rendering */}
      {viewMode === 'graph' ? (
        <EmployeeGraph />
      ) : (
        <div className="flex-1 overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-0 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 relative">
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-3 h-3 bg-hr-sage rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-hr-olive rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-3 h-3 bg-hr-charcoal rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                      <p className="mt-4 text-sm text-gray-500 font-medium">Loading records...</p>
                    </td>
                  </tr>
                )}
                {!isLoading && employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
                    </td>
                  </tr>
                )}
                {!isLoading && employees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => { setSelectedEmployee(emp); setIsModalOpen(true); }}
                    className="hover:bg-hr-mist/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-hr-light/20 flex items-center justify-center text-hr-olive font-bold group-hover:bg-hr-olive group-hover:text-white transition-colors">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{emp.fullName}</div>
                          <div className="text-sm text-gray-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-hr-mist text-hr-charcoal border border-hr-light/50">
                        {emp.jobTitle.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-hr-sage mr-2"></span>
                        {emp.country.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${emp.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmployeeToDelete(emp);
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
            <div>
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + (employees.length > 0 ? 1 : 0)}</span> to <span className="font-medium">{(currentPage - 1) * 10 + employees.length}</span> of{' '}
                <span className="font-medium">{totalEmployees}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => fetchEmployees(currentPage - 1, searchQuery)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-3">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => fetchEmployees(currentPage + 1, searchQuery)}
                disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <EmployeeModal 
          employee={selectedEmployee} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {employeeToDelete && (
        <DeleteConfirmationModal
          employee={employeeToDelete}
          onClose={() => setEmployeeToDelete(null)}
        />
      )}
    </div>
  );
}
