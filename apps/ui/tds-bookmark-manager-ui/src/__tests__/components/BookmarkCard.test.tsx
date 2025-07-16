/**
 * BookmarkCard.test.tsx
 *
 * Purpose:
 * - Unit tests for the `BookmarkCard` component.
 * - Verifies correct rendering of bookmark information and interaction handling (visit, archive, delete).
 *
 * Logic Overview:
 * 1. Mocks `useAuthStore`, `useBookmarkStore`, and `react-hot-toast` to isolate component behavior.
 * 2. Defines mock `bookmark` and `user` objects for consistent test data.
 * 3. Uses `beforeEach` to reset mock states and clear mock calls before each test.
 * 4. Tests rendering of bookmark details (title, URL, click count).
 * 5. Tests `visit site` functionality:
 *    - Mocks `window.open` to prevent actual navigation.
 *    - Asserts that `incrementClickCount` is called and `window.open` is called with correct arguments.
 * 6. Tests `archive toggle` functionality:
 *    - Simulates menu interaction and click on the archive button.
 *    - Asserts that `updateBookmark` is called with `isHidden: true`.
 * 7. Tests `delete` functionality:
 *    - Simulates menu interaction, click on delete, and confirmation dialog interaction.
 *    - Asserts that `deleteBookmark` is called.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation and updated mock data types)
 */
import { Role } from '@tds/tds-bm-common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';


import BookmarkCard from '../../components/bookmarks/BookmarkCard';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { cleanup, fireEvent, render, screen, waitFor } from '../test-utils';

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
    clickCount: 0,
    isHidden: false,
    folderId: undefined, // Added as it's a required property in BookmarkType
    createdAt: new Date(), // Changed to Date object
    updatedAt: new Date() // Changed to Date object
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
    // Explicitly cast window to Window to resolve TypeScript error if any
    const openSpy = vi.spyOn(window as Window, 'open').mockImplementation(() => null);
    
    render(<BookmarkCard bookmark={mockBookmark} />);
    
    const visitButton = screen.getByTestId(`visit-site-button-${mockBookmark.id}`);
    fireEvent.click(visitButton);
    
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
    fireEvent.click(menuButton);

    const archiveButton = screen.getByTestId(`archive-button-${mockBookmark.id}`);
    fireEvent.click(archiveButton);

    await waitFor(() => {
        expect(updateBookmark).toHaveBeenCalledWith('test-id', { isHidden: true });
    });
  });

  it('handles delete', async () => {
    const { deleteBookmark } = useBookmarkStore();
    render(<BookmarkCard bookmark={mockBookmark} />);

    const menuButton = screen.getByTestId(`menu-button-${mockBookmark.id}`);
    fireEvent.click(menuButton);

    const deleteButton = screen.getByTestId(`delete-button-${mockBookmark.id}`);
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: 'common.confirmDelete.confirm' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
        expect(deleteBookmark).toHaveBeenCalledWith('test-id');
    });
  });
});
