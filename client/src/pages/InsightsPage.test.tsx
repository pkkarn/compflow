import { render, screen, fireEvent } from '@testing-library/react';
import { InsightsPage } from './InsightsPage';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../store/useStore', () => ({
  useStore: () => ({
    countries: [{ id: 'c1', name: 'USA' }],
    jobTitles: [{ id: 'j1', title: 'Engineer' }],
    insightsData: { min: 50000, avg: 100000, max: 150000, currency: 'USD' },
    fetchMetadata: vi.fn(),
    fetchInsights: vi.fn()
  })
}));

describe('InsightsPage Component', () => {
  it('should render the "No Data Selected" placeholder initially', () => {
    render(<InsightsPage />);
    expect(screen.getByText('No Data Selected')).toBeInTheDocument();
  });

  it('should render KPI cards after selecting a country', () => {
    render(<InsightsPage />);
    
    // Select a country to reveal the KPIs
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'c1' } });
    
    // Check if KPI titles render
    expect(screen.getByText('Minimum Salary')).toBeInTheDocument();
    expect(screen.getByText('Average Salary')).toBeInTheDocument();
    expect(screen.getByText('Maximum Salary')).toBeInTheDocument();
    
    // Check if the mocked values render formatted correctly
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
  });
});
