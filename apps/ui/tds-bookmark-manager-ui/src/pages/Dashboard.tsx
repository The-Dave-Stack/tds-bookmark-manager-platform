import { Bookmark, Plus } from 'lucide-react';

import BookmarkGrid from '../components/bookmarks/BookmarkGrid';
import BookmarkModal from '../components/bookmarks/BookmarkModal';
import MostClickedBookmarks from '../components/bookmarks/MostClickedBookmarks';
import UserStats from '../components/statistics/UserStats';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  isArchived?: boolean;
}

const Dashboard = ({ isArchived = false }: DashboardProps) => {
  const { t } = useTranslation();
  const { folderId } = useParams<{ folderId: string }>();
  const { folders } = useBookmarkStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get current folder name if applicable
  const currentFolder = folders.find(folder => folder.id === folderId);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <Bookmark className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold text-mainText">
            {isArchived
              ? t('bookmarks.archivedTitle')
              : currentFolder
                ? currentFolder.name
                : t('bookmarks.title')}
          </h1>
        </div>
        
        {!isArchived && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-invertedText bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('bookmarks.add')}
          </button>
        )}
      </div>
      
      {!isArchived && !folderId && (
        <div className="space-y-6 mb-6">
          <UserStats />
          <MostClickedBookmarks />
        </div>
      )}
      
      <div className="bg-invertedText rounded-lg shadow-sm border border-lightBorder p-6">
        <BookmarkGrid folderFilter={folderId} showArchived={isArchived} />
      </div>
      
      {isModalOpen && (
        <BookmarkModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;