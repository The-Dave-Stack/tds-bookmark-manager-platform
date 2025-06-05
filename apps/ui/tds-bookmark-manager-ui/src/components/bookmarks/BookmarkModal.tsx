import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import type { Bookmark, FolderWithChildren } from '../../api/types';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark?: Bookmark;
}

interface FolderOptionProps {
  folder: FolderWithChildren;
  level: number;
  selectedFolderId: string | undefined;
  onSelect: (folderId: string) => void;
}

const FolderOption = ({ folder, level, selectedFolderId, onSelect }: FolderOptionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div>
      <div
        className={`flex items-center px-3 py-2 cursor-pointer hover:bg-lightBg transition-colors duration-200 ${
          selectedFolderId === folder.id ? 'bg-primary/10 text-primary' : 'text-mainText'
        }`}
        style={{ paddingLeft: `${(level + 1) * 1}rem` }}
        onClick={() => onSelect(folder.id)}
      >
        {folder.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-lightBorder rounded mr-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        <span className="truncate">{folder.name}</span>
      </div>
      
      {isExpanded && folder.children.length > 0 && (
        <div>
          {folder.children.map((child) => (
            <FolderOption
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BookmarkModal = ({ isOpen, onClose, bookmark }: BookmarkModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { folders, addBookmark, updateBookmark } = useBookmarkStore();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState({
    url: '',
    title: ''
  });

  // Try to extract favicon from URL
  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      return '';
    }
  };
  
  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title);
      setFaviconUrl(bookmark.faviconUrl || '');
      setFolderId(bookmark.folderId);
    } else {
      // Reset form when bookmark is undefined (for add mode or after close)
      setUrl('');
      setTitle('');
      setFaviconUrl('');
      setFolderId(undefined);
      setErrors({ url: '', title: '' }); // Also clear errors
    }
  }, [bookmark]);

  // When URL changes, try to get favicon
  useEffect(() => {
    if (url && !faviconUrl) {
      setFaviconUrl(getFaviconUrl(url));
    }
  }, [url, faviconUrl]);
  
  // Build folder hierarchy
  const folderHierarchy = useMemo(() => {
    const buildHierarchy = (parentId: string | null): FolderWithChildren[] => {
      return folders
        .filter(folder => folder.parentId === parentId)
        .map(folder => ({
          ...folder,
          children: buildHierarchy(folder.id)
        }));
    };
    
    return buildHierarchy(null);
  }, [folders]);
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      url: '',
      title: ''
    };
    
    if (!url.trim()) {
      newErrors.url = t('bookmarks.form.urlRequired');
      valid = false;
    }
    
    if (!title.trim()) {
      newErrors.title = t('bookmarks.form.titleRequired');
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) return;
    
    try {
      if (bookmark) {
        await updateBookmark(user.id, bookmark.id, {
          url,
          title,
          faviconUrl,
          folderId
        });
        toast.success(t('bookmarks.notifications.updated'));
      } else {
        await addBookmark(user.id, {
          url,
          title,
          faviconUrl,
          folderId,
          isHidden: false
        });
        toast.success(t('bookmarks.notifications.added'));
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast.error(t('common.error'));
    }
  };
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-invertedText shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-lightBorder">
            <Dialog.Title className="text-lg font-medium text-mainText">
              {bookmark ? t('bookmarks.form.edit') : t('bookmarks.add')}
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
                <label htmlFor="url" className="block text-sm font-medium text-mainText">
                  {t('bookmarks.form.url')}
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm text-mainText ${
                    errors.url ? 'border-danger focus:border-danger focus:ring-danger' : 
                    'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="https://example.com"
                />
                {errors.url && <p className="mt-1 text-sm text-danger">{errors.url}</p>}
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-mainText">
                  {t('bookmarks.form.title')}
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm text-mainText ${
                    errors.title ? 'border-danger focus:border-danger focus:ring-danger' : 
                    'border-lightBorder focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-danger">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="faviconUrl" className="block text-sm font-medium text-mainText">
                  {t('bookmarks.form.favicon')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    id="faviconUrl"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md shadow-sm text-mainText border-lightBorder focus:border-primary focus:ring-primary"
                    placeholder="https://example.com/favicon.ico"
                  />
                  {faviconUrl && (
                    <div className="flex-shrink-0 w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                      <img
                        src={faviconUrl}
                        alt="Favicon preview"
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-4 h-4 flex items-center justify-center';
                            fallback.innerHTML = '<svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {t('bookmarks.form.faviconHelp')}
                </p>
              </div>
              
              <div>
                <label htmlFor="folder" className="block text-sm font-medium text-mainText mb-1">
                  {t('bookmarks.form.folder')}
                </label>
                <div className="mt-1 border border-lightBorder rounded-md max-h-48 overflow-y-auto">
                  <div
                    className={`px-3 py-2 cursor-pointer hover:bg-lightBg transition-colors duration-200 ${
                      !folderId ? 'bg-primary/10 text-primary' : 'text-mainText'
                    }`}
                    onClick={() => setFolderId(undefined)}
                  >
                    {t('bookmarks.form.noFolder')}
                  </div>
                  {folderHierarchy.map((folder) => (
                    <FolderOption
                      key={folder.id}
                      folder={folder}
                      level={0}
                      selectedFolderId={folderId}
                      onSelect={setFolderId}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-mainText bg-lightBg hover:bg-lightBorder rounded-md transition-colors duration-200"
              >
                {t('bookmarks.form.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-invertedText bg-primary hover:bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              >
                {t('bookmarks.form.submit')}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookmarkModal;
