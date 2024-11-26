import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import Jest DOM matchers
import { Button } from '.';

describe('Button component', () => {
  it('matches snapshot for default state', () => {
    const { container } = render(
      <Button
        label="Click me"
        onClick={() => { }} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the correct label', () => {
    // Render the Button component with a label "Click me"
    render(<Button label="Click me" onClick={() => { }} />);

    // Find the button element by its label text
    const buttonElement = screen.getByText(/click me/i);

    // Assert that the button is in the document
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    // Find the button and simulate a click
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);

    // Assert that the onClick function was called once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button label="Disabled" onClick={() => { }} disabled={true} />);

    // Find the button element
    const buttonElement = screen.getByText(/disabled/i);

    // Assert that the button is disabled
    expect(buttonElement).toBeDisabled();
  });

  it('has correct class when disabled', () => {
    render(<Button label="Disabled" onClick={() => { }} disabled={true} />);

    // Find the button element
    const buttonElement = screen.getByText(/disabled/i);

    // Assert that the button has the correct CSS classes for a disabled state
    expect(buttonElement).toHaveClass('bg-gray-300 text-gray-500 cursor-not-allowed');
  });

  it('has correct class when not disabled', () => {
    render(<Button label="Enabled" onClick={() => { }} disabled={false} />);

    // Find the button element
    const buttonElement = screen.getByText(/enabled/i);

    // Assert that the button has the correct CSS classes for an enabled state
    expect(buttonElement).toHaveClass('bg-[#F4F5F9] text-[#1CA1C1] hover:bg-slate-300');
  });
});
