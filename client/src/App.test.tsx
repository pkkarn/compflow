import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('should render the dashboard layout', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/CompFlow HR/i)).toBeInTheDocument();
  });
});
