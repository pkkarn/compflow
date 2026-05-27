import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmployeeModal } from './EmployeeModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Zustand store
const mockCreateEmployee = vi.fn();
const mockUpdateEmployee = vi.fn();
const mockOnClose = vi.fn();

vi.mock('../store/useStore', () => ({
  useStore: () => ({
    countries: [{ id: 'c1', name: 'USA' }],
    jobTitles: [{ id: 'j1', title: 'Engineer' }],
    fetchMetadata: vi.fn(),
    createEmployee: mockCreateEmployee,
    updateEmployee: mockUpdateEmployee
  })
}));

describe('EmployeeModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Add New Employee form', () => {
    render(<EmployeeModal onClose={mockOnClose} />);
    expect(screen.getByText('Add New Employee')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John Doe')).toBeInTheDocument();
  });

  it('should call createEmployee and onClose on valid submission', async () => {
    render(<EmployeeModal onClose={mockOnClose} />);
    
    // Use closest labeling or placeholders since the UI uses block labels
    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. john@compflow.com'), { target: { value: 'jane@compflow.com' } });
    fireEvent.change(screen.getByPlaceholderText('100000'), { target: { value: '120000' } });
    
    // Target the select dropdowns by finding them in the document
    const selects = screen.getAllByRole('combobox');
    // Job Title is first select, Country is second
    fireEvent.change(selects[0], { target: { value: 'j1' } });
    fireEvent.change(selects[1], { target: { value: 'c1' } });

    // Submit form
    fireEvent.click(screen.getByText('Save Employee'));

    await waitFor(() => {
      expect(mockCreateEmployee).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: 'jane@compflow.com',
        salary: 120000,
        jobTitleId: 'j1',
        countryId: 'c1'
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
