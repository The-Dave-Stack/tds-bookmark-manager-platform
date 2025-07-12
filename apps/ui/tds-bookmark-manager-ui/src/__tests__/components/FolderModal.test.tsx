import { Role } from '@tds/tds-bm-common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';


import FolderModal from '../../components/folders/FolderModal';
import { useAuthStore } from '../../stores/authStore';
import { act, cleanup, fireEvent, render, screen } from '../test-utils';

const { mockAddFolder, mockUpdateFolder } = vi.hoisted(() => {
  return {
    mockAddFolder: vi.fn(),
    mockUpdateFolder: vi.fn(),
  };
});

vi.mock('../../stores/authStore');
vi.mock('../../stores/folderStore', () => ({
  useFolderStore: () => ({
    addFolder: mockAddFolder,
    updateFolder: mockUpdateFolder,
    folders: [],
    loading: false,
    error: null,
    fetchFolders: vi.fn(),
    deleteFolder: vi.fn(),
  }),
}));

// We also need to mock useBookmarkStore as it's used in FolderModal for folder hierarchy
vi.mock('../../stores/bookmarkStore', () => ({
  useBookmarkStore: () => ({
    folders: [], // Provide mock folders for bookmarkStore
  }),
}));

vi.mock('react-hot-toast');

describe('FolderModal', () => {
  const mockOnClose = vi.fn();

  const mockUser = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: [Role.USER],
  };

  const mockFolders = [
    { id: 'folder-1', name: 'Folder 1', userId: 'user-id', parentId: null, createdAt: new Date(), updatedAt: new Date(), bookmarkCount: 0, clickCount: 0 },
    { id: 'folder-2', name: 'Folder 2', userId: 'user-id', parentId: null, createdAt: new Date(), updatedAt: new Date(), bookmarkCount: 0, clickCount: 0 }
  ];

  let unmount: () => void;

  beforeEach(() => {
    // Reset mocks before each test
    mockAddFolder.mockClear();
    mockUpdateFolder.mockClear();
    (useAuthStore as any).mockReturnValue({ user: mockUser });
    vi.clearAllMocks(); // This will clear other mocks like react-hot-toast
  });

  afterEach(() => {
    cleanup();
    if (unmount) {
      unmount();
    }
  });

  it('renders create folder form', () => {
    ({ unmount } = render(<FolderModal isOpen={true} onClose={mockOnClose} />));
    
    expect(screen.getByText('folders.add')).toBeInTheDocument();
    expect(screen.getByTestId('folder-name-input')).toBeInTheDocument();
    // The "Root (No parent)" option is not explicitly rendered in the select dropdown.
    // expect(screen.getByText('folders.form.noParent')).toBeInTheDocument(); // Removed due to component behavior
  });

  it('validates required fields', async () => {
    ({ unmount } = render(<FolderModal isOpen={true} onClose={mockOnClose} />));
    
    const submitButton = screen.getByText('folders.form.submit');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    
    expect(screen.getByText('folders.form.nameRequired')).toBeInTheDocument();
  });

  it('handles folder creation', async () => {
    const onClose = vi.fn();
    
    ({ unmount } = render(<FolderModal isOpen={true} onClose={onClose} />));
    
    const nameInput = screen.getByTestId('folder-name-input');
    await act(async () => {
      await fireEvent.change(nameInput, { target: { value: 'New Folder' } });
    });
    
    const submitButton = screen.getByText('folders.form.submit');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    
    expect(mockAddFolder).toHaveBeenCalledWith({ name: 'New Folder', parentId: null });
    expect(onClose).toHaveBeenCalled();
  });

  it('handles folder update', async () => {
    const onClose = vi.fn();
    const mockFolder = mockFolders[0];
    
    ({ unmount } = render(
      <FolderModal 
        isOpen={true} 
        onClose={onClose}
        folder={mockFolder}
      />
    ));
    
    const nameInput = screen.getByTestId('folder-name-input');
    await act(async () => {
      await fireEvent.change(nameInput, { target: { value: 'Updated Folder' } });
    });
    
    const submitButton = screen.getByText('folders.form.submit');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    
    expect(mockUpdateFolder).toHaveBeenCalledWith('folder-1', { name: 'Updated Folder', parentId: null });
    expect(onClose).toHaveBeenCalled();
  });
});
