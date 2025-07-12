
import { Role } from '@tds/tds-bm-common';
import toast from 'react-hot-toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BookmarkModal from '../../components/bookmarks/BookmarkModal';
import { useAuthStore } from '../../stores/authStore';
import { act, cleanup, fireEvent, render, screen } from '../test-utils';

const { mockAddBookmark, mockUpdateBookmark } = vi.hoisted(() => {
  return {
    mockAddBookmark: vi.fn(),
    mockUpdateBookmark: vi.fn(),
  };
});

vi.mock('../../stores/bookmarkStore', () => ({
  useBookmarkStore: () => ({
    addBookmark: mockAddBookmark,
    updateBookmark: mockUpdateBookmark,
  }),
}));

vi.mock('../../stores/folderStore', () => ({
  useFolderStore: () => ({
    folders: [],
  }),
}));

// Mock other modules
vi.mock('../../stores/authStore');
vi.mock('react-hot-toast');

describe('BookmarkModal', () => {
  const mockOnClose = vi.fn();

  const mockUser = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    roles: [Role.USER],
  };

  const mockBookmark = {
    id: 'bookmark-1',
    userId: 'user-id',
    url: 'https://example.com',
    title: 'Test Bookmark',
    faviconUrl: 'https://example.com/favicon.ico',
    folderId: undefined,
    clickCount: 0,
    isHidden: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    mockAddBookmark.mockClear();
    mockUpdateBookmark.mockClear();

    // Set up auth store mock
    (useAuthStore as any).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    cleanup();
  });

  it('handles bookmark creation', async () => {
    mockAddBookmark.mockResolvedValue(undefined);

    render(<BookmarkModal isOpen={true} onClose={mockOnClose} />);
    
    await act(async () => {
      await fireEvent.change(screen.getByLabelText('bookmarks.form.url'), {
        target: { value: 'https://example.com' }
      });
      await fireEvent.change(screen.getByLabelText('bookmarks.form.title'), {
        target: { value: 'Test Bookmark' }
      });
      
      const submitButton = screen.getByRole('button', { name: 'bookmarks.form.submit' });
      await fireEvent.click(submitButton);
    });
    
    expect(mockAddBookmark).toHaveBeenCalledWith({
      url: 'https://example.com',
      title: 'Test Bookmark',
      faviconUrl: 'https://example.com/favicon.ico',
      folderId: undefined,
      isHidden: false,
    });
    expect(mockOnClose).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('bookmarks.notifications.added');
  });

  it('handles bookmark update', async () => {
    mockUpdateBookmark.mockResolvedValue(undefined);

    render(<BookmarkModal isOpen={true} onClose={mockOnClose} bookmark={mockBookmark} />);
    
    await act(async () => {
      await fireEvent.change(screen.getByLabelText('bookmarks.form.title'), {
        target: { value: 'Updated Title' }
      });
      
      const submitButton = screen.getByRole('button', { name: 'bookmarks.form.submit' });
      await fireEvent.click(submitButton);
    });
    
    expect(mockUpdateBookmark).toHaveBeenCalledWith(mockBookmark.id, {
      url: 'https://example.com',
      title: 'Updated Title',
      faviconUrl: 'https://example.com/favicon.ico',
      folderId: undefined
    });
    expect(mockOnClose).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('bookmarks.notifications.updated');
  });
});
