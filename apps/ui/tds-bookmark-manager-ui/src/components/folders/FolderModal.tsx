import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import type { Folder } from '../../api/types';
import toast from 'react-hot-toast';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder?: Folder;
  parentId?: string | null;
}

const FolderModal = ({ isOpen, onClose, folder, parentId = null }: FolderModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { folders, addFolder, updateFolder } = useBookmarkStore();
  
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
    
    if (!validateForm() || !user?.id) return;
    
    try {
      if (folder) {
        await updateFolder(user.id, folder.id, name, selectedParentId);
        toast.success(t('folders.notifications.updated'));
      } else {
        await addFolder(user.id, name, selectedParentId);
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
      const children = folders.filter(f => f.parentId === folder.id);
      return children.some(child => isDescendant(child, targetId));
    };
    
    return folders.filter(f => !isDescendant(f, currentFolderId));
  };
  
  const availableParents = getAvailableParents(folder?.id);
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-invertedText shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-lightBorder">
            <Dialog.Title className="text-lg font-medium text-mainText">
              {folder ? t('folders.edit') : t('folders.add')}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-mainText/70 hover:text-mainText transition-colors duration-200"
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
                    error ? 'border-danger focus:border-danger focus:ring-danger' : 
                    'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Enter folder name"
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
                >
                  <option value="">Root (No parent)</option>
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
              >
                {t('folders.form.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-invertedText bg-primary hover:bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              >
                {t('folders.form.submit')}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FolderModal;