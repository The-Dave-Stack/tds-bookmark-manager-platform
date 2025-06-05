import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from 'vitest';
import LanguageSwitcher from '../../../components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

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
