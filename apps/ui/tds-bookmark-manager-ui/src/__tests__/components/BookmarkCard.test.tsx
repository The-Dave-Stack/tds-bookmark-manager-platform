import { Role } from '@tds/tds-bm-common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';


import BookmarkCard from '../../components/bookmarks/BookmarkCard';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { act, cleanup, fireEvent, render, screen, waitFor } from '../test-utils';

// Mock stores
vi.mock('../../stores/authStore');
vi.mock('../../stores/bookmarkStore');
vi.mock('react-hot-toast');

describe('BookmarkCard', () => {
  const mockBookmark = {
    id: 'test-id',
    userId: 'user-id',
    url: 'https://example.com',
    title: 'Test Bookmark',
    faviconUrl: 'https://example.com/favicon.ico',
    folderId: undefined, // Explicitly set to null or undefined as per BookmarkType
    clickCount: 0,
    isHidden: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUser = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: [Role.USER]
  };

  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({ user: mockUser });
    (useBookmarkStore as any).mockReturnValue({
      updateBookmark: vi.fn(),
      deleteBookmark: vi.fn(),
      incrementClickCount: vi.fn()
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders bookmark information correctly', () => {
    render(<BookmarkCard bookmark={mockBookmark} />);
    
    expect(screen.getByText(mockBookmark.title)).toBeInTheDocument();
    expect(screen.getByText(mockBookmark.url)).toBeInTheDocument();
    expect(screen.getByText('bookmarks.actions.clickCount')).toBeInTheDocument();
  });

  it('handles visit site click', async () => {
    const { incrementClickCount } = useBookmarkStore();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    render(<BookmarkCard bookmark={mockBookmark} />);
    
    const visitButton = screen.getByTestId(`visit-site-button-${mockBookmark.id}`);
    await act(async () => {
      fireEvent.click(visitButton);
    });
    
    await waitFor(() => {
        expect(incrementClickCount).toHaveBeenCalledWith('test-id');
    });

    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    openSpy.mockRestore();
  });

  it('handles archive toggle', async () => {
    const { updateBookmark } = useBookmarkStore();
    render(<BookmarkCard bookmark={mockBookmark} />);

    const menuButton = screen.getByTestId(`menu-button-${mockBookmark.id}`);
    await act(async () => {
      fireEvent.click(menuButton);
    });

    const archiveButton = screen.getByTestId(`archive-button-${mockBookmark.id}`);
    await act(async () => {
      fireEvent.click(archiveButton);
    });

    await waitFor(() => {
        expect(updateBookmark).toHaveBeenCalledWith('test-id', { isHidden: true });
    });
  });

  it('handles delete', async () => {
    const { deleteBookmark } = useBookmarkStore();
    render(<BookmarkCard bookmark={mockBookmark} />);

    const menuButton = screen.getByTestId(`menu-button-${mockBookmark.id}`);
    await act(async () => {
      fireEvent.click(menuButton);
    });

    const deleteButton = screen.getByTestId(`delete-button-${mockBookmark.id}`);
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmButton = screen.getByRole('button', { name: 'common.confirmDelete.confirm' });
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
        expect(deleteBookmark).toHaveBeenCalledWith('test-id');
    });
  });
});
