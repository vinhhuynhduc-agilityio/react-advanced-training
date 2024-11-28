import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock the @/config module globally for all tests
jest.mock('@/config', () => ({
  API_BASE_URL: 'http://localhost:3001',
}));
