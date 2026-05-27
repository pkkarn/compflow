import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeesPage } from './EmployeesPage';
import { describe, it, expect, vi } from 'vitest';

// Mock the Zustand store entirely so we don't need real API calls for the UI test
vi.mock('../store/useStore', () => ({
  useStore: () => ({
    employees: [
      {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        salary: 100000,
        jobTitle: { title: 'Engineer' },
        country: { name: 'USA' }
      }
    ],
    totalEmployees: 1,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    searchQuery: '',
    countries: [{ id: 'c1', name: 'USA' }],
    jobTitles: [{ id: 'j1', title: 'Engineer' }],
    insightsData: { min: 50000, avg: 100000, max: 150000, currency: 'USD' },
    graphData: null,
    setSearchQuery: vi.fn(),
    fetchEmployees: vi.fn(),
    fetchMetadata: vi.fn(),
    fetchInsights: vi.fn(),
    fetchGraphData: vi.fn(),
    createEmployee: vi.fn(),
    updateEmployee: vi.fn()
  })
}));

describe('EmployeesPage Component', () => {
  it('should render the search bar and Add Employee button', () => {
    render(<EmployeesPage />);
    
    // Check Search Bar
    expect(screen.getByPlaceholderText(/Search employees by name.../i)).toBeInTheDocument();
    
    // Check Add Button
    expect(screen.getByText(/Add Employee/i)).toBeInTheDocument();
  });

  it('should render the mocked employee data in the table', () => {
    render(<EmployeesPage />);
    
    // Verify the mock data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('should open the Add Employee modal when clicking the button', () => {
    render(<EmployeesPage />);
    const addButton = screen.getByText(/Add Employee/i);
    fireEvent.click(addButton);
    
    expect(screen.getByText('Add New Employee')).toBeInTheDocument();
  });

  it('should toggle between table and canvas views', () => {
    render(<EmployeesPage />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    const canvasBtn = screen.getByTitle('Canvas View');
    fireEvent.click(canvasBtn);
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Loading graph structure...')).toBeInTheDocument();
  });
});
