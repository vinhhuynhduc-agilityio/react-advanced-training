import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('should render the footer element', () => {
    render(<Footer />); // Render the Footer component

    // Find the footer element in the DOM
    const footerElement = screen.getByRole('contentinfo');

    // Assert that the footer element is in the document
    expect(footerElement).toBeInTheDocument();
  });

  it('should have the correct class names for background and height', () => {
    render(<Footer />);

    // Get the footer element
    const footerElement = screen.getByRole('contentinfo');

    // Assert that the footer has the correct class names
    expect(footerElement).toHaveClass('bg-gradient-to-r');
    expect(footerElement).toHaveClass('from-gray-800');
    expect(footerElement).toHaveClass('via-blue-900');
    expect(footerElement).toHaveClass('to-gray-900');
    expect(footerElement).toHaveClass('h-16');
  });
});
