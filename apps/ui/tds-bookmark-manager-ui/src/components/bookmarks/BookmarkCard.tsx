import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { MoreHorizontal, Edit, Trash, Archive, RotateCcw, ExternalLink } from 'lucide-react';
import BookmarkModal from './BookmarkModal';
import ConfirmDialog from '../common/ConfirmDialog';
import toast from 'react-hot-toast';
import type { Bookmark } from '../../api/types';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { updateBookmark, deleteBookmark, incrementClickCount } = useBookmarkStore();
  
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const toggleArchive = async () => {
    if (!user?.id) return;
    
    try {
      await updateBookmark(user.id, bookmark.id, { 
        isHidden: !bookmark.isHidden 
      });
      
      toast.success(
        bookmark.isHidden 
          ? t('bookmarks.notifications.unarchived') 
          : t('bookmarks.notifications.archived')
      );
    } catch (error) {
      console.error('Error toggling archive:', error);
      toast.error(t('common.error'));
    }
    
    setShowMenu(false);
  };
  
  const handleDelete = async () => {
    if (!user?.id) return;
    
    try {
      await deleteBookmark(user.id, bookmark.id);
      toast.success(t('bookmarks.notifications.deleted'));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast.error(t('common.error'));
    }
  };
  
  const handleVisit = async () => {
    if (!user?.id) return;
    
    try {
      // Increment click count first
      await incrementClickCount(user.id, bookmark.id);
      
      // Then open URL in new tab
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error incrementing click count:', error);
      // Still open the URL even if click count fails
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
        onClick={handleVisit}
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {bookmark.faviconUrl ? (
                <img 
                  src={bookmark.faviconUrl} 
                  alt="favicon" 
                  className="w-6 h-6 mr-3 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-6 h-6 mr-3 rounded bg-gray-200 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <h3 className="font-medium text-gray-900 truncate max-w-[200px]">{bookmark.title}</h3>
            </div>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Menu"
                data-testid={`menu-button-${bookmark.id}`}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditModalOpen(true);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      data-testid={`edit-button-${bookmark.id}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('bookmarks.actions.edit')}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive();
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      data-testid={`archive-button-${bookmark.id}`}
                    >
                      {bookmark.isHidden ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {t('bookmarks.actions.unarchive')}
                        </>
                      ) : (
                        <>
                          <Archive className="h-4 w-4 mr-2" />
                          {t('bookmarks.actions.archive')}
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteDialogOpen(true);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      data-testid={`delete-button-${bookmark.id}`}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      {t('bookmarks.actions.delete')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-500 truncate">{bookmark.url}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <span>{t('bookmarks.actions.clickCount', { count: bookmark.clickCount })}</span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVisit();
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              aria-label="Visit Site"
              data-testid={`visit-site-button-${bookmark.id}`}
            >
              {t('bookmarks.actions.visitSite')}
              <ExternalLink className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <BookmarkModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          bookmark={bookmark}
        />
      )}
      
      {isDeleteDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title={t('common.confirmDelete.title')}
          message={t('common.confirmDelete.message')}
          confirmText={t('common.confirmDelete.confirm')}
          cancelText={t('common.confirmDelete.cancel')}
        />
      )}
    </>
  );
};

export default BookmarkCard;