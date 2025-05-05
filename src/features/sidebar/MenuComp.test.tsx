import { render, screen } from '@testing-library/react';
import MenuComp from './MenuComp';
import { describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useDrawerStore } from '../../stores/drawer-store';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../stores/drawer-store', () => ({
  useDrawerStore: vi.fn(),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('MenuComp', () => {
  it('renders all menu items with icons', () => {
    (useDrawerStore as any).mockReturnValue({ open: true });
    renderWithRouter(<MenuComp />);

    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByAltText(/openlayers/i)).toBeInTheDocument();
    expect(screen.getByAltText(/d3/i)).toBeInTheDocument();
    expect(screen.getByAltText(/aggrid/i)).toBeInTheDocument();
  });

  it('does not render text labels when drawer is closed', () => {
    (useDrawerStore as any).mockReturnValue({ open: false });
    renderWithRouter(<MenuComp />);

    expect(screen.queryByText(/OpenLayers/)).not.toBeInTheDocument();
    expect(screen.queryByText(/D3/)).not.toBeInTheDocument();
    expect(screen.queryByText(/AGgrid/)).not.toBeInTheDocument();
  });
});
