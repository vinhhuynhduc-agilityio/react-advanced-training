import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ICellRendererParams } from 'ag-grid-community';
import { UserData } from '@/types/table';
import { PersonRenderer } from './PersonRenderer';

const mockData: UserData = {
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "fullName": "Joe Bloggs",
  "earnings": "$5000",
  "email": "john@example.com",
  "avatarUrl": "https://i.pravatar.cc/150?img=1",
  "registered": "May 21, 2020 17:02:06",
  "lastUpdated": "October 10, 2023 12:30:00"
};

describe('PersonRenderer component', () => {
  const params: ICellRendererParams<UserData> = { data: mockData } as ICellRendererParams<UserData>;
  it('matches snapshot for default state', () => {
    const { container } = render(<PersonRenderer {...params} />);
    expect(container).toMatchSnapshot();
  });

  it('should render user data correctly', () => {
    const params: ICellRendererParams<UserData> = { data: mockData } as ICellRendererParams<UserData>;

    render(<PersonRenderer {...params} />);

    expect(screen.getByText('Joe Bloggs')).toBeInTheDocument();
    expect(screen.getByText('$5000')).toBeInTheDocument();
    const img = screen.getByAltText('avatar') as HTMLImageElement;
    expect(img.src).toBe('https://i.pravatar.cc/150?img=1');
  });
});
