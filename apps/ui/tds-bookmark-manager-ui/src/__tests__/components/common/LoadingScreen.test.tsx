import { render, screen } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';


import LoadingScreen from '../../../components/common/LoadingScreen';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('LoadingScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as unknown as Mock).mockReturnValue({
      t: (key: string) => key, // Simple passthrough for translation keys
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the loading spinner and text', () => {
    render(<LoadingScreen />);
    
    expect(screen.getByText('common.loading')).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument(); // Use data-testid
  });
});
