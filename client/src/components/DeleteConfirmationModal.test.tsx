import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { describe, it, expect, vi } from 'vitest';

const mockDeleteEmployee = vi.fn();
const mockOnClose = vi.fn();

vi.mock('../store/useStore', () => ({
  useStore: () => ({
    deleteEmployee: mockDeleteEmployee,
  })
}));

const mockEmployee = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
  salary: 100000,
  countryId: 'c1',
  jobTitleId: 'j1',
  country: { id: 'c1', name: 'USA' },
  jobTitle: { id: 'j1', title: 'Engineer' }
};

describe('DeleteConfirmationModal', () => {
  it('should render warning text with employee name', () => {
    render(<DeleteConfirmationModal employee={mockEmployee} onClose={mockOnClose} />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText('Delete Employee?')).toBeInTheDocument();
  });

  it('should call deleteEmployee on confirmation', async () => {
    render(<DeleteConfirmationModal employee={mockEmployee} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Yes, delete'));

    await waitFor(() => {
      expect(mockDeleteEmployee).toHaveBeenCalledWith('1');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
