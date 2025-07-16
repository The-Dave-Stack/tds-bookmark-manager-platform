/**
 * LoadingScreen.test.tsx
 *
 * Purpose:
 * - Unit tests for the `LoadingScreen` component.
 * - Verifies that the loading spinner and text are rendered correctly.
 *
 * Logic Overview:
 * 1. Mocks `react-i18next`'s `useTranslation` hook to control translations.
 * 2. Uses `beforeEach` to reset mocks and `afterEach` to clean up rendered components.
 * 3. Tests:
 *    - Renders the loading text (mocked via i18n) and the loader icon.
 *    - Asserts that both elements are present in the document.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
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
