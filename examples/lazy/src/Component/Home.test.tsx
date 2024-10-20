import {
    render,
    screen,
    waitFor
} from '@testing-library/react';

import Home from './Home';

describe('Home Component', () => {
    test('displays loading text initially', () => {
        render(<Home />);

        // Check "Loading Home..." appears when the page is loading
        expect(screen.getByText(/Loading Home.../i)).toBeInTheDocument();
    });

    test('displays welcome text after loading', async () => {
        render(<Home />);

        // Wait until "Welcome to Home Page" appears
        await waitFor(() => {
            expect(screen.getByText(/Welcome to Home Page/i)).toBeInTheDocument();
        }, { timeout: 3000 }); // Set a timeout long enough for the loading process to complete
    });
});
