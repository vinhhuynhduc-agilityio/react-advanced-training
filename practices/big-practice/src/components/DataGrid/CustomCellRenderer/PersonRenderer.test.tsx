import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PersonRenderer } from './PersonRenderer';
import { ICellRendererParams } from 'ag-grid-community';
import { RowData } from '@/types/users';

const mockData: RowData =     {
  "pk_user": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "full_name": "John Doe",
  "earnings": "$5000",
  "email": "john@example.com",
  "avatar_url": "https://i.pravatar.cc/150?img=1",
  "registered": "May 21, 2020 17:02:06",
  "last_updated": "October 10, 2023 12:30:00"
};

describe('PersonRenderer component', () => {
  it('should render user data correctly', () => {
    const params: ICellRendererParams<RowData> = { data: mockData } as ICellRendererParams<RowData>;

    render(<PersonRenderer {...params} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('$5000')).toBeInTheDocument();
    const img = screen.getByAltText('avatar') as HTMLImageElement;
    expect(img.src).toBe('https://i.pravatar.cc/150?img=1');
  });
});
