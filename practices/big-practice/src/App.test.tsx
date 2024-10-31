import {
  render,
  screen
} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders Dashboard component', () => {
    render(<App />);
    const dashboardElement = screen.getByText(/Team Progress/i);
    expect(dashboardElement).toBeInTheDocument();
  });
});
