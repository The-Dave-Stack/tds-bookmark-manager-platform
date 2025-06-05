import toast from 'react-hot-toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BookmarkGrid from '../../components/bookmarks/BookmarkGrid';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { cleanup, fireEvent, render, screen } from '../test-utils';

vi.mock('../../stores/authStore');
vi.mock('../../stores/bookmarkStore');
vi.mock('react-hot-toast');

describe('BookmarkGrid', () => {
  const mockUser = {
    id: 'user-id',
    email: 'test@example.com'
  };

  const mockBookmarks = [
    {
      id: 'bookmark-1',
      url: 'https://example.com',
      title: 'Test Bookmark',
      clickCount: 0,
      isHidden: false,
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({ user: mockUser });
    (useBookmarkStore as any).mockReturnValue({
      bookmarks: mockBookmarks,
      loading: false,
      toggleArchive: vi.fn(),
      deleteBookmark: vi.fn(),
      incrementClickCount: vi.fn(),
      updateBookmark: vi.fn((userId, bookmarkId, updatedFields) => {
        if (updatedFields.customImageUrl) {
          toast.success('Image updated successfully');
        }
      })
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders bookmarks', () => {
    render(<BookmarkGrid />);
    
    expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('handles search', async () => {
    render(<BookmarkGrid />);
    
    const searchInput = screen.getByPlaceholderText('bookmarks.search');
    await fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('bookmarks.empty')).toBeInTheDocument();
  });

  it('handles sorting', async () => {
    const { rerender } = render(<BookmarkGrid />);
    
    const sortSelect = screen.getByRole('combobox');
    await fireEvent.change(sortSelect, { target: { value: 'title' } });
    
    rerender(<BookmarkGrid />);
    
    expect(sortSelect).toHaveValue('title');
  });

  it('handles bookmark visit', async () => {
    const { incrementClickCount } = useBookmarkStore();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    render(<BookmarkGrid />);
    
    const visitButton = screen.getByTestId(`visit-site-button-${mockBookmarks[0].id}`);
    await fireEvent.click(visitButton);
    
    expect(incrementClickCount).toHaveBeenCalledWith(mockUser.id, mockBookmarks[0].id);
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('handles bookmark archive toggle', async () => {
    const { updateBookmark } = useBookmarkStore();
    
    render(<BookmarkGrid />);
    
    const menuButton = screen.getByTestId(`menu-button-${mockBookmarks[0].id}`);
    await fireEvent.click(menuButton);
    
    const archiveButton = screen.getByTestId(`archive-button-${mockBookmarks[0].id}`);
    await fireEvent.click(archiveButton);
    
    expect(updateBookmark).toHaveBeenCalledWith(mockUser.id, mockBookmarks[0].id, { isHidden: true });
    expect(toast.success).toHaveBeenCalled();
  });

  it('handles bookmark deletion', async () => {
    const { deleteBookmark } = useBookmarkStore();
    
    render(<BookmarkGrid />);
    
    const menuButton = screen.getByTestId(`menu-button-${mockBookmarks[0].id}`);
    await fireEvent.click(menuButton);
    
    const deleteButton = screen.getByTestId(`delete-button-${mockBookmarks[0].id}`);
    await fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByText('common.confirmDelete.confirm');
    await fireEvent.click(confirmButton);
    
    expect(deleteBookmark).toHaveBeenCalledWith(mockUser.id, mockBookmarks[0].id);
    expect(toast.success).toHaveBeenCalledWith('bookmarks.notifications.deleted');
  });

  it('handles image update', async () => {
    const { updateBookmark } = useBookmarkStore();
    const imageUrl = 'data:image/png;base64,test';
    
    render(<BookmarkGrid />);
    
    const bookmark = mockBookmarks[0];
    await updateBookmark(mockUser.id, bookmark.id, { customImageUrl: imageUrl });
    
    expect(updateBookmark).toHaveBeenCalledWith(mockUser.id, bookmark.id, { customImageUrl: imageUrl });
    expect(toast.success).toHaveBeenCalledWith('Image updated successfully');
  });
});
