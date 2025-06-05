import toast from 'react-hot-toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BookmarkModal from '../../components/bookmarks/BookmarkModal';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { cleanup, fireEvent, render, screen } from '../test-utils';

vi.mock('../../stores/authStore');
vi.mock('../../stores/bookmarkStore');
vi.mock('react-hot-toast');

describe('BookmarkModal', () => {
  const mockUser = {
    id: 'user-id',
    email: 'test@example.com'
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({ user: mockUser });
    (useBookmarkStore as any).mockReturnValue({
      addBookmark: vi.fn(),
      updateBookmark: vi.fn(),
      folders: [] // Provide an empty array for folders to prevent TypeError
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders add bookmark form', () => {
    render(<BookmarkModal isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText('bookmarks.add')).toBeInTheDocument();
    expect(screen.getByLabelText('bookmarks.form.url')).toBeInTheDocument();
    expect(screen.getByLabelText('bookmarks.form.title')).toBeInTheDocument();
  });

  it('renders edit bookmark form with existing data', () => {
    render(
      <BookmarkModal 
        isOpen={true} 
        onClose={() => {}} 
        bookmark={mockBookmark}
      />
    );
    
    expect(screen.getByText('bookmarks.form.edit')).toBeInTheDocument();
    expect(screen.getByLabelText('bookmarks.form.url')).toHaveValue(mockBookmark.url);
    expect(screen.getByLabelText('bookmarks.form.title')).toHaveValue(mockBookmark.title);
  });

  it('validates required fields', async () => {
    render(<BookmarkModal isOpen={true} onClose={() => {}} />);
    
    const submitButton = screen.getByRole('button', { name: 'bookmarks.form.submit' });
    await fireEvent.click(submitButton);
    
    expect(screen.getByText('bookmarks.form.urlRequired')).toBeInTheDocument();
    expect(screen.getByText('bookmarks.form.titleRequired')).toBeInTheDocument();
  });

  it('handles bookmark creation', async () => {
    const onClose = vi.fn();
    const { addBookmark } = useBookmarkStore();
    
    render(<BookmarkModal isOpen={true} onClose={onClose} />);
    
    await fireEvent.change(screen.getByLabelText('bookmarks.form.url'), {
      target: { value: 'https://example.com' }
    });
    await fireEvent.change(screen.getByLabelText('bookmarks.form.title'), {
      target: { value: 'Test Bookmark' }
    });
    
    const submitButton = screen.getByRole('button', { name: 'bookmarks.form.submit' });
    await fireEvent.click(submitButton);
    
    expect(addBookmark).toHaveBeenCalledWith(mockUser.id, {
      url: 'https://example.com',
      title: 'Test Bookmark',
      faviconUrl: 'https://example.com/favicon.ico', // Added faviconUrl expectation
      folderId: undefined,
      isHidden: false
    });
    expect(onClose).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('bookmarks.notifications.added');
  });

  it('handles bookmark update', async () => {
    const onClose = vi.fn();
    const { updateBookmark } = useBookmarkStore();
    
    render(
      <BookmarkModal 
        isOpen={true} 
        onClose={onClose}
        bookmark={mockBookmark} // Changed bookmarkToEdit to bookmark
      />
    );
    
    await fireEvent.change(screen.getByLabelText('bookmarks.form.title'), {
      target: { value: 'Updated Title' }
    });
    
    const submitButton = screen.getByRole('button', { name: 'bookmarks.form.submit' });
    await fireEvent.click(submitButton);
    
    expect(updateBookmark).toHaveBeenCalledWith(mockUser.id, mockBookmark.id, {
      url: mockBookmark.url,
      title: 'Updated Title',
      faviconUrl: mockBookmark.faviconUrl, // Added faviconUrl expectation
      folderId: mockBookmark.folderId
    });
    expect(onClose).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('bookmarks.notifications.updated');
  });

  it('resets form on close', () => {
    const { rerender } = render(
      <BookmarkModal 
        isOpen={true} 
        onClose={() => {}} 
        bookmark={mockBookmark} // Changed bookmarkToEdit to bookmark
      />
    );
    
    expect(screen.getByLabelText('bookmarks.form.url')).toHaveValue(mockBookmark.url);
    
    rerender(
      <BookmarkModal 
        isOpen={true} 
        onClose={() => {}} 
        bookmark={undefined} // Changed bookmarkToEdit to bookmark and null to undefined
      />
    );
    
    expect(screen.getByLabelText('bookmarks.form.url')).toHaveValue('');
  });
});
