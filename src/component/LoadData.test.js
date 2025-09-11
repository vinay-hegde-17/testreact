import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LoadData from './LoadData';
import { fetchAllItems } from '../service/items';

jest.mock('../service/items');

const mockItems = [
  { id: '1', name: 'Bluetooth Speaker' },
  { id: '2', name: 'Wireless Mouse' },
  { id: '3', name: 'Laptop Stand' }
];

describe('LoadData Component', () => {
  beforeEach(() => {
    fetchAllItems.mockResolvedValue(mockItems);
  });

test('renders item list from API', async () => {
  render(<LoadData />);

  await waitFor(() => {
    mockItems.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });
});

  test('renders heading correctly', () => {
    render(<LoadData />);
    expect(screen.getByText(/Item data is/i)).toBeInTheDocument();
  });
});
