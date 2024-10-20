import {
  render,
  screen,
  waitFor
} from '@testing-library/react';

import About from './About';

describe('About Component', () => {
  test('display Loading text initially', () => {
    render(<About />);

    expect(screen.getByText('Loading About...')).toBeInTheDocument();
  });

  test('display About Us text after loading', async () => {
    render(<About />);

    await waitFor(() => {
      expect(screen.getByText('About Us')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
