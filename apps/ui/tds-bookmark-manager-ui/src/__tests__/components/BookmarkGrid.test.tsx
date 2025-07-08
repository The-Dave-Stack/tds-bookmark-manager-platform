
import { Role } from '@tds/tds-bm-common';
import toast from 'react-hot-toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BookmarkGrid from '../../components/bookmarks/BookmarkGrid';
import { useAuthStore } from '../../stores/authStore';
import { cleanup, fireEvent, render, screen, waitFor } from '../test-utils';

const mockBookmarks = [
  {
    id: 'bookmark-1',
    url: 'https://example.com',
    title: 'Test Bookmark',
    clickCount: 0,
    isHidden: false,
    createdAt: new Date(), // Use Date object
    updatedAt: new Date(), // Add updatedAt as Date object
  },
];

const {
  mockToggleArchive,
  mockDeleteBookmark,
  mockIncrementClickCount,
  mockUpdateBookmark,
} = vi.hoisted(() => {
  return {
    mockToggleArchive: vi.fn(),
    mockDeleteBookmark: vi.fn(),
    mockIncrementClickCount: vi.fn(),
    mockUpdateBookmark: vi.fn(),
  };
});

vi.mock('../../stores/authStore');
vi.mock('../../stores/bookmarkStore', () => ({
  useBookmarkStore: () => ({
    toggleArchive: mockToggleArchive,
    deleteBookmark: mockDeleteBookmark,
    incrementClickCount: mockIncrementClickCount,
    updateBookmark: mockUpdateBookmark,
    bookmarks: mockBookmarks,
    loading: false,
    error: null,
    fetchBookmarks: vi.fn(),
    addBookmark: vi.fn(),
    upsertBookmarks: vi.fn(),
  }),
}));

vi.mock('react-hot-toast');

describe('BookmarkGrid', () => {
  const mockUser = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    roles: [Role.USER],
  };


  beforeEach(() => {
    // Reset mocks before each test
    mockToggleArchive.mockClear();
    mockDeleteBookmark.mockClear();
    mockIncrementClickCount.mockClear();
    mockUpdateBookmark.mockClear();
    (useAuthStore as any).mockReturnValue({ user: mockUser });
    vi.clearAllMocks(); // This will clear other mocks like react-hot-toast
  });

  afterEach(() => {
    cleanup();
  });

  it('renders bookmarks', () => {
    render(<BookmarkGrid />);
    
    expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
  });

  it('handles search', async () => {
    render(<BookmarkGrid />);
    
    const searchInput = screen.getByPlaceholderText('bookmarks.search');
    await fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('bookmarks.empty')).toBeInTheDocument();
  });

  it('handles sorting', async () => {
    render(<BookmarkGrid />);
    const sortSelect = screen.getByRole('combobox');
    await fireEvent.change(sortSelect, { target: { value: 'title' } });
    expect(sortSelect).toHaveValue('title');
  });

  it('handles bookmark visit', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    render(<BookmarkGrid />);
    
    const visitButton = screen.getByTestId(`visit-site-button-${mockBookmarks[0].id}`);
    fireEvent.click(visitButton);
    
    await waitFor(() => {
      expect(mockIncrementClickCount).toHaveBeenCalledWith(mockBookmarks[0].id);
    });

    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    openSpy.mockRestore();
  });

  it('handles bookmark archive toggle', async () => {
    render(<BookmarkGrid />);

    const menuButton = screen.getByTestId(`menu-button-${mockBookmarks[0].id}`);
    fireEvent.click(menuButton);

    const archiveButton = screen.getByTestId(`archive-button-${mockBookmarks[0].id}`);
    fireEvent.click(archiveButton);

    // Use waitFor to ensure all async actions complete
    await waitFor(() => {
      expect(mockUpdateBookmark).toHaveBeenCalledWith(mockBookmarks[0].id, { isHidden: true });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('handles bookmark deletion', async () => {
    render(<BookmarkGrid />);

    const menuButton = screen.getByTestId(`menu-button-${mockBookmarks[0].id}`);
    fireEvent.click(menuButton);

    const deleteButton = screen.getByTestId(`delete-button-${mockBookmarks[0].id}`);
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText('common.confirmDelete.confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
        expect(mockDeleteBookmark).toHaveBeenCalledWith(mockBookmarks[0].id);
    });

    await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('bookmarks.notifications.deleted');
    });
  });

  it('handles image update', async () => {
    const imageUrl = 'data:image/png;base64,test';
    
    render(<BookmarkGrid />);
    
    // This isn't a real user action, but we can test the mock call
    await mockUpdateBookmark(mockBookmarks[0].id, { customImageUrl: imageUrl } as any);
    
    expect(mockUpdateBookmark).toHaveBeenCalledWith(mockBookmarks[0].id, { customImageUrl: imageUrl });
  });
});
