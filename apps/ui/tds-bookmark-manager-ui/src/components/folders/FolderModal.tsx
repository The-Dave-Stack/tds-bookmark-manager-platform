/**
 * FolderModal.tsx
 *
 * Purpose:
 * - Provides a modal form for creating and editing folders.
 * - Handles input validation, parent folder selection, and interaction with the folder store.
 *
 * Logic Overview:
 * 1. Uses `useState` for form fields (name, selectedParentId) and validation error.
 * 2. Uses `useTranslation` for internationalization.
 * 3. Integrates with `useAuthStore` and `useFolderStore` for data management.
 * 4. `useEffect` hook: Initializes form fields when an existing `folder` is passed (edit mode) or sets `parentId` for new folders.
 * 5. `validateForm`: Performs client-side validation for the folder name and prevents circular parent relationships.
 * 6. `handleSubmit`:
 *    - Prevents default form submission.
 *    - Validates the form and checks for authenticated user.
 *    - Calls `addFolder` or `updateFolder` based on whether a `folder` prop is provided.
 *    - Shows success/error toasts and closes the modal.
 * 7. `getAvailableParents`: Filters the list of folders to exclude the current folder and its descendants from being selected as a parent, preventing circular references.
 * 8. Renders a `Dialog` from `@headlessui/react` for the modal structure.
 * 9. Includes an input field for the folder name and a dropdown for selecting a parent folder.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { useEffect, useState } from 'react';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../stores/authStore';
import { useFolderStore } from '../../stores/folderStore';

import type { FolderType as Folder } from '../../api/types';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder?: Folder;
  parentId?: string | null;
}

const FolderModal = ({ isOpen, onClose, folder, parentId = null }: FolderModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { folders, addFolder, updateFolder } = useFolderStore();

  const [name, setName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(parentId);
  const [error, setError] = useState('');

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setSelectedParentId(folder.parentId);
    } else {
      setSelectedParentId(parentId);
    }
  }, [folder, parentId]);

  const validateForm = () => {
    if (!name.trim()) {
      setError(t('folders.form.nameRequired'));
      return false;
    }

    // Prevent circular references
    if (folder && selectedParentId === folder.id) {
      setError('A folder cannot be its own parent');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting folder:', { name, selectedParentId }, validateForm(), user?.username);
    if (!validateForm() || !user?.username) return;

    try {
      if (folder) {
        await updateFolder(folder.id, { name, parentId: selectedParentId });
        toast.success(t('folders.notifications.updated'));
      } else {
        await addFolder({ name, parentId: selectedParentId });
        toast.success(t('folders.notifications.added'));
      }

      onClose();
    } catch (error) {
      console.error('Error saving folder:', error);
      toast.error(t('common.error'));
    }
  };

  // Get available parent folders (exclude current folder and its children)
  const getAvailableParents = (currentFolderId?: string): Folder[] => {
    if (!currentFolderId) return folders;

    const isDescendant = (folder: Folder, targetId: string): boolean => {
      if (folder.id === targetId) return true;
      const children = folders.filter((f) => f.parentId === folder.id);
      return children.some((child) => isDescendant(child, targetId));
    };

    return folders.filter((f) => !isDescendant(f, currentFolderId));
  };

  const availableParents = getAvailableParents(folder?.id);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-invertedText shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-lightBorder">
            <DialogTitle className="text-lg font-medium text-mainText">{folder ? t('folders.edit') : t('folders.add')}</DialogTitle>
            <button
              onClick={onClose}
              className="text-mainText/70 hover:text-mainText transition-colors duration-200"
              aria-label="Close"
              data-testid="close-button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-mainText">
                  {t('folders.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm text-mainText ${
                    error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Enter folder name"
                  aria-label="Folder Name"
                  data-testid="folder-name-input"
                />
                {error && <p className="mt-1 text-sm text-danger">{error}</p>}
              </div>

              <div>
                <label htmlFor="parent" className="block text-sm font-medium text-mainText">
                  Parent Folder
                </label>
                <select
                  id="parent"
                  value={selectedParentId || ''}
                  onChange={(e) => setSelectedParentId(e.target.value || null)}
                  className="mt-1 block w-full rounded-md border-lightBorder shadow-sm focus:border-primary focus:ring-primary text-mainText"
                  data-testid="parent-folder-select"
                  aria-label="Parent Folder"
                >
                  {availableParents.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-mainText bg-lightBg hover:bg-lightBorder rounded-md transition-colors duration-200"
                data-testid="cancel-button"
                aria-label="Cancel"
              >
                {t('folders.form.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-invertedText bg-primary hover:bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                aria-label="Save Folder"
                id="save-folder-button"
              >
                {t('folders.form.submit')}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FolderModal;
