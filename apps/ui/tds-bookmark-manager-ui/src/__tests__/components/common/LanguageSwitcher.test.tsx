/**
 * LanguageSwitcher.test.tsx
 *
 * Purpose:
 * - Unit tests for the `LanguageSwitcher` component.
 * - Verifies correct rendering of the language switcher, dropdown functionality, and language change events.
 *
 * Logic Overview:
 * 1. Mocks `react-i18next`'s `useTranslation` hook to control the current language and spy on `changeLanguage`.
 * 2. Uses `beforeEach` to reset mocks and `afterEach` to clean up rendered components.
 * 3. Tests:
 *    - Renders the current language (English by default) correctly.
 *    - Opens and closes the language dropdown on button click.
 *    - Calls `changeLanguage` with the correct locale when a language option is clicked.
 *    - Renders the current language correctly when it is Spanish.
 *    - Defaults to English if an unsupported language is set.
 *    - Applies active styling to the currently selected language option in the dropdown.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from 'vitest';

import LanguageSwitcher from '../../../components/common/LanguageSwitcher';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('LanguageSwitcher', () => {
  const mockChangeLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as unknown as Mock).mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key, // Simple passthrough for translation keys
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the current language correctly (English by default)', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument(); // More specific query
  });

  it('opens and closes the language dropdown on button click', () => {
    render(<LanguageSwitcher />);
    
    const toggleButton = screen.getByRole('button', { name: /English/i });
    
    // Open dropdown
    fireEvent.click(toggleButton);
    expect(screen.getByText('Español')).toBeInTheDocument();
    
    // Close dropdown
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Español')).not.toBeInTheDocument();
  });

  it('changes language when a language option is clicked', () => {
    render(<LanguageSwitcher />);
    
    const toggleButton = screen.getByRole('button', { name: /English/i });
    fireEvent.click(toggleButton); // Open dropdown
    
    const spanishOption = screen.getByText('Español');
    fireEvent.click(spanishOption);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
    expect(screen.queryByText('Español')).not.toBeInTheDocument(); // Dropdown should close
  });

  it('renders the current language correctly when it is Spanish', () => {
    (useTranslation as unknown as Mock).mockReturnValue({
      i18n: {
        language: 'es',
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key,
    });
    render(<LanguageSwitcher />);
    expect(screen.getByText('🇪🇸')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  it('defaults to English if current language is not supported', () => {
    (useTranslation as unknown as Mock).mockReturnValue({
      i18n: {
        language: 'fr', // Unsupported language
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key,
    });
    render(<LanguageSwitcher />);
    expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('applies active styling to the current language option', () => {
    render(<LanguageSwitcher />);
    
    const toggleButton = screen.getByRole('button', { name: /English/i });
    fireEvent.click(toggleButton); // Open dropdown
    
    const englishOption = screen.getByRole('menuitem', { name: /English/i }); // Use regex for name
    expect(englishOption).toHaveClass('text-primary bg-lightBg font-medium');
    
    const spanishOption = screen.getByRole('menuitem', { name: /Español/i }); // Use regex for name
    expect(spanishOption).toHaveClass('text-mainText');
  });
});
