/// <reference types="vitest/globals" />
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from 'vitest';

import MostClickedBookmarks from '../../../components/bookmarks/MostClickedBookmarks';
import { useAuthStore } from '../../../stores/authStore';
import { useBookmarkStore } from '../../../stores/bookmarkStore';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      if (key === 'bookmarks.mostClicked') return 'Most Clicked Bookmarks';
      if (key === 'bookmarks.actions.clickCount') return `Clicks: ${options?.count}`;
      return key;
    },
  }),
}));

// Mock zustand stores
vi.mock('../../../stores/bookmarkStore', () => ({
  useBookmarkStore: vi.fn(),
}));

vi.mock('../../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('MostClickedBookmarks', () => {
  const mockBookmarks = [
    { id: '1', title: 'Bookmark A', url: 'http://a.com', clickCount: 10, isHidden: false, faviconUrl: 'http://a.com/fav.ico' },
    { id: '2', title: 'Bookmark B', url: 'http://b.com', clickCount: 20, isHidden: false, faviconUrl: 'http://b.com/fav.ico' },
    { id: '3', title: 'Bookmark C', url: 'http://c.com', clickCount: 5, isHidden: false, faviconUrl: 'http://c.com/fav.ico' },
    { id: '4', title: 'Bookmark D', url: 'http://d.com', clickCount: 15, isHidden: true, faviconUrl: 'http://d.com/fav.ico' }, // Hidden
    { id: '5', title: 'Bookmark E', url: 'http://e.com', clickCount: 25, isHidden: false, faviconUrl: 'http://e.com/fav.ico' },
    { id: '6', title: 'Bookmark F', url: 'http://f.com', clickCount: 30, isHidden: false, faviconUrl: undefined }, // No favicon
    { id: '7', title: 'Bookmark G', url: 'http://g.com', clickCount: 12, isHidden: false, faviconUrl: 'http://g.com/fav.ico' },
  ];

  const mockIncrementClickCount = vi.fn();
  const mockUser = { apiToken: 'test-token' };

  beforeEach(() => {
    vi.clearAllMocks();
    (useBookmarkStore as unknown as Mock).mockReturnValue({
      bookmarks: mockBookmarks,
      incrementClickCount: mockIncrementClickCount,
    });
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: mockUser,
    });
    vi.spyOn(window, 'open').mockImplementation(vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders null if there are no non-hidden bookmarks', () => {
    (useBookmarkStore as unknown as Mock).mockReturnValue({
      bookmarks: [{ id: '1', title: 'Hidden', url: 'http://hidden.com', clickCount: 1, isHidden: true }],
      incrementClickCount: mockIncrementClickCount,
    });
    const { container } = render(<MostClickedBookmarks />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the top 5 most clicked non-hidden bookmarks', () => {
    render(<MostClickedBookmarks />);

    expect(screen.getByText('Most Clicked Bookmarks')).toBeInTheDocument();
    
    // Expect top 5 non-hidden bookmarks by clickCount: F(30), E(25), B(20), G(12), A(10)
    expect(screen.getByText('Bookmark F')).toBeInTheDocument();
    expect(screen.getByText('Bookmark E')).toBeInTheDocument();
    expect(screen.getByText('Bookmark B')).toBeInTheDocument();
    expect(screen.getByText('Bookmark G')).toBeInTheDocument();
    expect(screen.getByText('Bookmark A')).toBeInTheDocument();
    expect(screen.queryByText('Bookmark C')).not.toBeInTheDocument(); // Not in top 5
    expect(screen.queryByText('Bookmark D')).not.toBeInTheDocument(); // Hidden
  });

  it('calls handleVisit and increments click count when bookmark is clicked', () => {
    render(<MostClickedBookmarks />);
    
    const bookmarkB = screen.getByText('Bookmark B');
    const visitButton = bookmarkB.closest('.flex.items-center.justify-between')?.querySelector('button');
    
    if (visitButton) {
      fireEvent.click(visitButton);
      expect(window.open).toHaveBeenCalledWith('http://b.com', '_blank');
      expect(mockIncrementClickCount).toHaveBeenCalledWith(mockUser.apiToken, '2');
    } else {
      throw new Error('Visit button not found for Bookmark B');
    }
  });

  it('does not call handleVisit if user has no apiToken', () => {
    (useAuthStore as unknown as Mock).mockReturnValue({ user: { apiToken: undefined } });
    render(<MostClickedBookmarks />);
    
    const bookmarkA = screen.getByText('Bookmark A');
    const visitButton = bookmarkA.closest('.flex.items-center.justify-between')?.querySelector('button');
    
    if (visitButton) {
      fireEvent.click(visitButton);
      expect(window.open).not.toHaveBeenCalled();
      expect(mockIncrementClickCount).not.toHaveBeenCalled();
    } else {
      throw new Error('Visit button not found for Bookmark A');
    }
  });

  it('renders default icon when faviconUrl is undefined', () => {
    render(<MostClickedBookmarks />);
    
    const bookmarkF = screen.getByText('Bookmark F');
    const defaultIconContainer = bookmarkF.closest('.flex.items-center.justify-between')?.querySelector('.bg-gray-200');
    expect(defaultIconContainer).toBeInTheDocument();
    expect(defaultIconContainer?.querySelector('svg')).toBeInTheDocument(); // Check for ExternalLink icon
  });

  it('handles favicon image error by hiding the image', () => {
    render(<MostClickedBookmarks />);
    
    const bookmarkA = screen.getByText('Bookmark A');
    const faviconImg = bookmarkA.closest('.flex.items-center.justify-between')?.querySelector('img');
    
    expect(faviconImg).toBeInTheDocument();
    
    if (faviconImg) {
      fireEvent.error(faviconImg);
      expect(faviconImg).toHaveStyle('display: none');
    } else {
      throw new Error('Favicon image not found for Bookmark A');
    }
  });
});
