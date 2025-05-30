import { useEffect, useRef, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useAuthStore } from '../../stores/authStore';
import { X, FolderPlus, Archive, FolderIcon, ChevronRight, ChevronDown } from 'lucide-react';
import FolderModal from '../folders/FolderModal';
import { useState } from 'react';
import type { FolderWithChildren } from '../../api/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FolderItemProps {
  folder: FolderWithChildren;
  level: number;
  onAddSubfolder: (parentId: string) => void;
}

const FolderItem = ({ folder, level, onAddSubfolder }: FolderItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
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
          <span className="truncate">{folder.name}</span>
        </NavLink>
        
        <button
          onClick={() => onAddSubfolder(folder.id)}
          className="opacity-0 group-hover:opacity-100 p-1 mr-2 text-primary hover:text-secondary rounded-full transition-all duration-200"
          title={t('folders.addSubfolder')}
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>
      
      {isExpanded && folder.children.length > 0 && (
        <div className="ml-4">
          {folder.children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              onAddSubfolder={onAddSubfolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const { folders, fetchFolders } = useBookmarkStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      fetchFolders(user.id);
    }
  }, [user, fetchFolders]);
  
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
    setIsModalOpen(true);
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
            </NavLink>
            
            <NavLink
              to="/bookmarks/archived"
              className={({ isActive }) =>
                `${baseClassName} ${isActive ? activeClassName : inactiveClassName}`
              }
            >
              <Archive className="h-5 w-5" />
              <span>{t('navigation.archived')}</span>
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
          }}
          parentId={selectedParentId}
        />
      )}
    </>
  );
};

export default Sidebar;