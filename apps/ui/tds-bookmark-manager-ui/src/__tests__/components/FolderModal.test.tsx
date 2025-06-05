import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import FolderModal from '../../components/folders/FolderModal';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { cleanup, fireEvent, render, screen } from '../test-utils';

vi.mock('../../stores/authStore');
vi.mock('../../stores/bookmarkStore');
vi.mock('react-hot-toast');

describe('FolderModal', () => {
  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user'
  };

  const mockFolders = [
    { id: 'folder-1', name: 'Folder 1', userId: 'user-id', parentId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), bookmarkCount: 0 },
    { id: 'folder-2', name: 'Folder 2', userId: 'user-id', parentId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), bookmarkCount: 0 }
  ];

  let unmount: () => void;

  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({ user: mockUser });
    (useBookmarkStore as any).mockReturnValue({
      folders: mockFolders,
      addFolder: vi.fn(),
      updateFolder: vi.fn()
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    if (unmount) {
      unmount();
    }
  });

  it('renders create folder form', () => {
    ({ unmount } = render(<FolderModal isOpen={true} onClose={() => {}} />));
    
    expect(screen.getByText('folders.add')).toBeInTheDocument();
    expect(screen.getByTestId('folder-name-input')).toBeInTheDocument();
    expect(screen.getByText('Root (No parent)')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    ({ unmount } = render(<FolderModal isOpen={true} onClose={() => {}} />));
    
    const submitButton = screen.getByText('folders.form.submit');
    await fireEvent.click(submitButton);
    
    expect(screen.getByText('folders.form.nameRequired')).toBeInTheDocument();
  });

  it('handles folder creation', async () => {
    const { addFolder } = useBookmarkStore();
    const onClose = vi.fn();
    
    ({ unmount } = render(<FolderModal isOpen={true} onClose={onClose} />));
    
    const nameInput = screen.getByTestId('folder-name-input');
    await fireEvent.change(nameInput, { target: { value: 'New Folder' } });
    
    const submitButton = screen.getByText('folders.form.submit');
    await fireEvent.click(submitButton);
    
    expect(addFolder).toHaveBeenCalledWith('user-id', 'New Folder', null);
    expect(onClose).toHaveBeenCalled();
  });

  it('handles folder update', async () => {
    const { updateFolder } = useBookmarkStore();
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
    await fireEvent.change(nameInput, { target: { value: 'Updated Folder' } });
    
    const submitButton = screen.getByText('folders.form.submit');
    await fireEvent.click(submitButton);
    
    expect(updateFolder).toHaveBeenCalledWith('user-id', 'folder-1', 'Updated Folder', null);
    expect(onClose).toHaveBeenCalled();
  });
});
