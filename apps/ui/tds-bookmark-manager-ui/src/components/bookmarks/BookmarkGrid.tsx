import { useState, useMemo } from 'react';

import { SortDesc } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SearchInput from '../common/SearchInput';
import EmptyState from '../common/EmptyState';
import SelectInput from '../common/SelectInput';
import { useBookmarkStore } from '../../stores/bookmarkStore';

import BookmarkCard from './BookmarkCard';

interface BookmarkGridProps {
  folderFilter?: string;
  showArchived?: boolean;
}

const BookmarkGrid = ({ folderFilter, showArchived = false }: BookmarkGridProps) => {
  const { t } = useTranslation();
  const { bookmarks, loading } = useBookmarkStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'clicks'>('date');
  
  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    const result = bookmarks.filter(bookmark => {
      // Filter by archived status
      if (showArchived !== bookmark.isHidden) return false;
      
      // Filter by folder if specified
      if (folderFilter && bookmark.folderId !== folderFilter) return false;
      
      // If no folder is specified but we're not showing archived, show all non-archived bookmarks
      if (!folderFilter && !showArchived && bookmark.isHidden) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
    
    // Sort bookmarks
    return result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'clicks') {
        const clicksA = a.clickCount ?? 0;
        const clicksB = b.clickCount ?? 0;
        return clicksB - clicksA;
      }
      return 0;
    });
  }, [bookmarks, searchQuery, sortBy, folderFilter, showArchived]);
  
  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading...</div>;
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder={t('bookmarks.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="sm:w-48">
          <SelectInput
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'clicks')}
            options={[
              { value: 'date', label: t('bookmarks.sort.date') },
              { value: 'title', label: t('bookmarks.sort.title') },
              { value: 'clicks', label: t('bookmarks.sort.clicks') },
            ]}
            icon={<SortDesc className="h-5 w-5 text-gray-400" />}
          />
        </div>
      </div>
      
      {filteredBookmarks.length === 0 ? (
        <EmptyState message={showArchived ? t('bookmarks.emptyArchived') : t('bookmarks.empty')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkGrid;
