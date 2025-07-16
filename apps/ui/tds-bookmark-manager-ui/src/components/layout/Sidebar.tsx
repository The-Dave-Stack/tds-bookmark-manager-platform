/**
 * Sidebar.tsx
 *
 * Purpose:
 * - Renders the main application sidebar for authenticated users.
 * - Displays navigation links for all bookmarks, archived bookmarks, and a hierarchical list of folders.
 * - Provides functionality to add, edit, and delete folders.
 *
 * Logic Overview:
 * 1. Uses `useState` for managing modal/dialog visibility and selected folder states.
 * 2. Uses `useTranslation` for internationalization.
 * 3. Integrates with `useBookmarkStore`, `useFolderStore`, and `useAuthStore` for data management.
 * 4. `useEffect` hook: Fetches folders when the user is authenticated.
 * 5. `folderHierarchy` (memoized with `useMemo`):
 *    - Builds a nested structure of folders, calculating the number of non-hidden bookmarks within each folder.
 *    - Ensures correct parent-child relationships.
 * 6. `useEffect` for `handleClickOutside`: Closes the sidebar when a click occurs outside of it (for mobile/overlay).
 * 7. `handleAddSubfolder`, `handleEditFolder`, `handleDeleteFolder`: Functions to set state for opening modals/dialogs with relevant folder data.
 * 8. `confirmDeleteFolder`: Handles the actual deletion of a folder after confirmation.
 * 9. Renders:
 *    - Main navigation links for "All Bookmarks" and "Archived" (with counts).
 *    - A section for folders with an "Add Folder" button.
 *    - A recursive `FolderItem` component to display the folder hierarchy.
 * 10. Conditionally renders `FolderModal` for adding/editing folders and `ConfirmDialog` for deleting folders.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { Archive, ChevronDown, ChevronRight, Edit, FolderIcon, FolderPlus, MoreHorizontal, Trash, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import ConfirmDialog from '../common/ConfirmDialog';
import FolderModal from '../folders/FolderModal';
import type { FolderWithChildren } from '../../api/types';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useFolderStore } from '../../stores/folderStore';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FolderItemProps {
  folder: FolderWithChildren;
  level: number;
  onAddSubfolder: (parentId: string) => void;
  onEdit: (folder: FolderWithChildren) => void;
  onDelete: (folder: FolderWithChildren) => void;
  bookmarkCount: number;
}

const FolderItem = ({ folder, level, onAddSubfolder, onEdit, onDelete, bookmarkCount }: FolderItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const { t } = useTranslation();
  
  const baseClassName = "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200";
  const activeClassName = "bg-primary/10 text-primary font-medium";
  const inactiveClassName = "text-mainText hover:bg-lightBg";
  
  return (
    <div>
      <div className="flex items-center group">
        <NavLink
          to={`/bookmarks/folder/${folder.id}`}
          className={({ isActive }) =>
            `${baseClassName} flex-1 ${isActive ? activeClassName : inactiveClassName}`
          }
          style={{ paddingLeft: `${(level + 1) * 1}rem` }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-lightBorder rounded"
          >
            {folder.children.length > 0 && (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <FolderIcon className="h-5 w-5" />
          <span className="truncate flex-1">{folder.name}</span>
          <span className="text-xs text-gray-500 ml-2">{bookmarkCount}</span>
        </NavLink>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1 mr-2 text-gray-500 hover:text-gray-700 rounded-full transition-all duration-200"
            title={t('folders.actions.menu')}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(folder);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('folders.actions.edit')}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubfolder(folder.id);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  {t('folders.actions.addSubfolder')}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(folder);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {t('folders.actions.delete')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isExpanded && folder.children.length > 0 && (
        <div className="ml-4">
          {folder.children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              onAddSubfolder={onAddSubfolder}
              onEdit={onEdit}
              onDelete={onDelete}
              bookmarkCount={child.bookmarkCount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const { bookmarks } = useBookmarkStore();
  const { folders, fetchFolders, deleteFolder } = useFolderStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderWithChildren | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FolderWithChildren | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.username) {
      fetchFolders();
    }
  }, [user, fetchFolders]);
  
  // Build folder hierarchy with bookmark counts
  const folderHierarchy = useMemo(() => {
    console.log('[Sidebar] Building folder hierarchy...', bookmarks, folders);
    const getFolderBookmarkCount = (folderId: string): number => {
      return bookmarks.filter(b => b.folderId === folderId && !b.isHidden).length;
    };

    const buildHierarchy = (parentId: string | null | undefined): FolderWithChildren[] => {
      return folders
        .filter(folder => folder.parentId === parentId)
        .map(folder => ({
          ...folder,
          children: buildHierarchy(folder.id),
          bookmarkCount: getFolderBookmarkCount(folder.id)
        }));
    };
    
    const hierarchy = buildHierarchy(undefined);
    hierarchy.push(...buildHierarchy(null));
    console.log('[Sidebar] Folder Hierarchy:', hierarchy);
    return hierarchy;
  }, [folders, bookmarks]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const handleAddSubfolder = (parentId: string) => {
    setSelectedParentId(parentId);
    setSelectedFolder(null);
    setIsModalOpen(true);
  };

  const handleEditFolder = (folder: FolderWithChildren) => {
    setSelectedFolder(folder);
    setSelectedParentId(folder.parentId);
    setIsModalOpen(true);
  };

  const handleDeleteFolder = (folder: FolderWithChildren) => {
    setFolderToDelete(folder);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteFolder = async () => {
    if (!user?.username || !folderToDelete) return;

    try {
      await deleteFolder(folderToDelete.id);
      setFolderToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };
  
  const baseClassName = "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200";
  const activeClassName = "bg-primary/10 text-primary font-medium";
  const inactiveClassName = "text-mainText hover:bg-lightBg";
  
  return (
    <>
      <aside
        ref={sidebarRef}
        className={`bg-invertedText border-r border-lightBorder h-full w-64 fixed md:relative transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-mainText">{t('folders.title')}</h2>
            <button 
              className="md:hidden text-mainText hover:text-primary transition-colors duration-200" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col space-y-1 mb-4">
            <NavLink
              to="/bookmarks"
              end
              className={({ isActive }) =>
                `${baseClassName} ${isActive ? activeClassName : inactiveClassName}`
              }
            >
              <FolderIcon className="h-5 w-5" />
              <span>{t('folders.all')}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {bookmarks.filter(b => !b.isHidden).length}
              </span>
            </NavLink>
            
            <NavLink
              to="/bookmarks/archived"
              className={({ isActive }) =>
                `${baseClassName} ${isActive ? activeClassName : inactiveClassName}`
              }
            >
              <Archive className="h-5 w-5" />
              <span>{t('navigation.archived')}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {bookmarks.filter(b => b.isHidden).length}
              </span>
            </NavLink>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-mainText/70 uppercase tracking-wider">
              {t('folders.title')}
            </h3>
            <button
              className="text-primary hover:text-secondary p-1 rounded-full transition-colors duration-200"
              onClick={() => {
                setSelectedParentId(null);
                setSelectedFolder(null);
                setIsModalOpen(true);
              }}
              title={t('folders.add')}
            >
              <FolderPlus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {folderHierarchy.length === 0 ? (
              <p className="text-sm text-mainText/50 italic px-4 py-2">
                {t('folders.empty')}
              </p>
            ) : (
              <div className="space-y-1">
                {folderHierarchy.map((folder) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    level={0}
                    onAddSubfolder={handleAddSubfolder}
                    onEdit={handleEditFolder}
                    onDelete={handleDeleteFolder}
                    bookmarkCount={folder.bookmarkCount}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {isModalOpen && (
        <FolderModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedParentId(null);
            setSelectedFolder(null);
          }}
          folder={selectedFolder || undefined}
          parentId={selectedParentId}
        />
      )}

      {isDeleteDialogOpen && folderToDelete && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setFolderToDelete(null);
          }}
          onConfirm={confirmDeleteFolder}
          title={t('folders.confirmDelete.title')}
          message={t('folders.confirmDelete.message')}
          confirmText={t('folders.confirmDelete.confirm')}
          cancelText={t('folders.confirmDelete.cancel')}
        />
      )}
    </>
  );
};

export default Sidebar;
